"""
CIP Mapper for Career Recommendation System

Handles mapping between CIP codes (educational programs) and SOC occupations
using the real BLS crosswalk data from CIP2020_SOC2020_SOC2018_Crosswalk.csv.
"""

import pandas as pd
import sys
from typing import Dict, List, Optional
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

class CIPMapper:
    """Maps CIP codes to related SOC occupations using real BLS crosswalk data"""
    
    def __init__(self, data_dir: str = "data"):
        self.data_dir = Path(data_dir)
        self.crosswalk_data = None
        self.cip_codes = set()
        self.projections_data = None
        self.oews_data = None
        self._load_crosswalk_data()
        self._load_supporting_data()
    
    def _load_crosswalk_data(self):
        """Load the real crosswalk data from CSV"""
        try:
            crosswalk_file = self.data_dir / "CIP2020_SOC2018_Crosswalk.csv"
            
            if not crosswalk_file.exists():
                raise FileNotFoundError(f"Crosswalk file not found: {crosswalk_file}")
            
            logger.info("Loading real crosswalk data...")
            self.crosswalk_data = pd.read_csv(crosswalk_file)
            
            # Extract all available CIP codes for validation
            self.cip_codes = set(self.crosswalk_data['CIP2020Code'].astype(str))
            
            logger.info(f"Loaded {len(self.crosswalk_data)} crosswalk mappings")
            logger.info(f"Available CIP codes: {len(self.cip_codes)}")
            
        except Exception as e:
            logger.error(f"Failed to load crosswalk data: {e}")
            raise
    
    def _load_supporting_data(self):
        """Load employment projections and OEWS data for enrichment"""
        try:
            # Load employment projections
            proj_file = self.data_dir / "Employment Projections.csv"
            if proj_file.exists():
                self.projections_data = pd.read_csv(proj_file)
                # Clean occupation codes
                self.projections_data['Occupation Code'] = (
                    self.projections_data['Occupation Code']
                    .str.replace('="', '')
                    .str.replace('"', '')
                    .str.strip()
                )
                logger.info(f"Loaded {len(self.projections_data)} employment projections")
            
            # Load OEWS data
            oews_file = self.data_dir / "OEWS2023.csv"
            if oews_file.exists():
                # Load only key columns for efficiency
                self.oews_data = pd.read_csv(
                    oews_file,
                    usecols=['OCC_CODE', 'A_MEDIAN', 'TOT_EMP'],
                    dtype={'OCC_CODE': 'string', 'A_MEDIAN': 'string', 'TOT_EMP': 'string'}
                )
                # Filter to national data and detailed occupations
                self.oews_data = self.oews_data[
                    (self.oews_data['OCC_CODE'].notna()) &
                    (self.oews_data['A_MEDIAN'].notna())
                ]
                # Convert to numeric
                self.oews_data['A_MEDIAN'] = pd.to_numeric(self.oews_data['A_MEDIAN'], errors='coerce')
                self.oews_data['TOT_EMP'] = pd.to_numeric(self.oews_data['TOT_EMP'], errors='coerce')
                self.oews_data = self.oews_data.dropna(subset=['A_MEDIAN'])
                logger.info(f"Loaded {len(self.oews_data)} OEWS records")
                
        except Exception as e:
            logger.warning(f"Failed to load supporting data: {e}")
    
    def get_related_occupations(self, cip_code: str, max_results: int = 10) -> List[Dict]:
        """Get related SOC occupations for a given CIP code"""
        if not self.crosswalk_data is not None:
            raise RuntimeError("Crosswalk data not loaded")
        
        # Validate CIP code
        if not self._is_valid_cip_code(cip_code):
            available_codes = sorted(list(self.cip_codes))[:10]  # Show first 10 for reference
            raise ValueError(
                f"Invalid CIP code: {cip_code}. "
                f"Available codes include: {', '.join(available_codes)}..."
            )
        
        # Get mappings for this CIP code (handle both exact and prefix matches)
        if str(cip_code) in self.cip_codes:
            # Exact match (e.g., "51.0501")
            mappings = self.crosswalk_data[
                self.crosswalk_data['CIP2020Code'].astype(str) == cip_code
            ]
        else:
            # Prefix match (e.g., "5.01" matches "5.0101", "51.05" matches "51.0501", etc.)
            mappings = self.crosswalk_data[
                self.crosswalk_data['CIP2020Code'].astype(str).str.startswith(cip_code)
            ]
        
        if mappings.empty:
            logger.warning(f"No occupations found for CIP code {cip_code} (exact or prefix match)")
            return []
        
        # Convert to list of dictionaries and enrich with additional data
        occupations = []
        for _, row in mappings.iterrows():
            soc_code = row['SOC2018Code']
            
            occupation = {
                'soc_code': soc_code,
                'soc_title': row['SOC2018Title'],
                'cip_code': row['CIP2020Code'],
                'cip_title': row['CIP2020Title'],
                'source': 'BLS_Crosswalk'
            }
            
            # Add employment projections if available
            if self.projections_data is not None:
                proj_match = self.projections_data[
                    self.projections_data['Occupation Code'] == soc_code
                ]
                if not proj_match.empty:
                    proj_row = proj_match.iloc[0]
                    occupation.update({
                        'employment_2023': proj_row.get('Employment 2023'),
                        'employment_2033': proj_row.get('Employment 2033'),
                        'growth_pct': proj_row.get('Employment Percent Change, 2023-2033'),
                        'education_level': proj_row.get('Typical Entry-Level Education')
                    })
            
            # Add OEWS wage data if available
            if self.oews_data is not None:
                oews_match = self.oews_data[self.oews_data['OCC_CODE'] == soc_code]
                if not oews_match.empty:
                    oews_row = oews_match.iloc[0]
                    occupation.update({
                        'median_wage': oews_row.get('A_MEDIAN'),
                        'total_employment': oews_row.get('TOT_EMP')
                    })
            
            occupations.append(occupation)
        
        # Limit results
        return occupations[:max_results]
    
    def _is_valid_cip_code(self, cip_code: str) -> bool:
        """Check if CIP code exists in our crosswalk data or matches a prefix"""
        if not cip_code:
            return False
        
        # Debug: Log what we're checking
        sys.stderr.write(f"Validating CIP code: '{cip_code}' (type: {type(cip_code)})\n")
        sys.stderr.write(f"Available CIP codes count: {len(self.cip_codes)}\n")
        
        # Check for exact match first
        if str(cip_code) in self.cip_codes:
            sys.stderr.write(f"Exact match found: {cip_code}\n")
            return True
        
        # Check for prefix match (e.g., "5.01" matches "5.0101", "51.05" matches "51.0501", etc.)
        if '.' in cip_code:
            # Validate format: must be x.xx or xx.xx (1-2 digits before decimal, 2 digits after)
            parts = cip_code.split('.')
            if len(parts) == 2 and len(parts[0]) in [1, 2] and len(parts[1]) == 2:
                prefix = cip_code
                # Debug: Log what we're looking for
                sys.stderr.write(f"Looking for prefix: {prefix}\n")
                sys.stderr.write(f"Available CIP codes (first 10): {sorted(list(self.cip_codes))[:10]}\n")
                
                # Check if any 6-digit codes start with this prefix
                for full_cip in self.cip_codes:
                    full_cip_str = str(full_cip)
                    if full_cip_str.startswith(prefix):
                        sys.stderr.write(f"Found match: {full_cip_str} starts with {prefix}\n")
                        return True
                
                sys.stderr.write(f"No prefix matches found for {prefix}\n")
        
        return False
    
    def get_mapping_statistics(self) -> Dict:
        """Get statistics about the crosswalk mappings"""
        if self.crosswalk_data is None:
            return {}
        
        stats = {
            'total_mappings': len(self.crosswalk_data),
            'unique_cip_codes': self.crosswalk_data['CIP2020Code'].nunique(),
            'unique_soc_codes': self.crosswalk_data['SOC2018Code'].nunique(),
            'data_source': 'BLS_Crosswalk_2020'
        }
        
        return stats
    
    def get_available_cip_codes(self, search_term: str = None, limit: int = 50) -> List[Dict]:
        """Get available CIP codes with optional search"""
        if self.crosswalk_data is None:
            return []
        
        # Get unique CIP codes with their titles
        cip_summary = self.crosswalk_data[['CIP2020Code', 'CIP2020Title']].drop_duplicates()
        
        if search_term:
            # Filter by search term
            mask = cip_summary['CIP2020Title'].str.contains(search_term, case=False, na=False)
            cip_summary = cip_summary[mask]
        
        # Limit results and format
        results = []
        for _, row in cip_summary.head(limit).iterrows():
            results.append({
                'cip_code': row['CIP2020Code'],
                'title': row['CIP2020Title']
            })
        
        return results
    
    def get_cip_info(self, cip_code: str) -> Optional[Dict]:
        """Get detailed information about a specific CIP code"""
        if not self._is_valid_cip_code(cip_code):
            return None
        
        # Get first occurrence of this CIP code (handle both exact and prefix matches)
        if str(cip_code) in self.cip_codes:
            # Exact match
            cip_info = self.crosswalk_data[
                self.crosswalk_data['CIP2020Code'].astype(str) == cip_code
            ].iloc[0]
        else:
            # Prefix match - get first matching code
            prefix_matches = self.crosswalk_data[
                self.crosswalk_data['CIP2020Code'].astype(str).str.startswith(cip_code)
            ]
            if prefix_matches.empty:
                return None
            cip_info = prefix_matches.iloc[0]
        
        return {
            'cip_code': cip_info['CIP2020Code'],
            'cip_title': cip_info['CIP2020Title'],
            'total_occupations': len(self.crosswalk_data[
                self.crosswalk_data['CIP2020Code'].astype(str).str.startswith(cip_code)
            ])
        }
