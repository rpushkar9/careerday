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
from constants.employmentProjection import ENTRY_LEVEL_EDUCATION, WORK_EXPERIENCE_REQUIRED

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
    
    def _get_education_hierarchy(self, max_education: str) -> List[str]:
        """Get education levels up to and including the specified max level"""
        try:
            max_index = ENTRY_LEVEL_EDUCATION.index(max_education)
            return ENTRY_LEVEL_EDUCATION[max_index:]
        except ValueError:
            logger.warning(f"Invalid education level: {max_education}, using default (Bachelor's degree)")
            return ENTRY_LEVEL_EDUCATION[2:]  # Bachelor's degree and below
    
    def _get_experience_hierarchy(self, max_experience: str) -> List[str]:
        """Get work experience levels up to and including the specified max level"""
        try:
            max_index = WORK_EXPERIENCE_REQUIRED.index(max_experience)
            return WORK_EXPERIENCE_REQUIRED[max_index:]
        except ValueError:
            logger.warning(f"Invalid work experience level: {max_experience}, using default (None)")
            return WORK_EXPERIENCE_REQUIRED[2:]  # None
    
    def get_related_occupations(self, cip_code: str, max_results: int = 10, 
                               entry_level_education: str = "Bachelor's degree",
                               work_experience: str = "None",
                               education_filter_type: str = "hierarchy",
                               experience_filter_type: str = "hierarchy") -> List[Dict]:
        """Get related SOC occupations for a given CIP code with education and experience filtering
        
        Args:
            cip_code: The CIP code to search for
            max_results: Maximum number of results to return
            entry_level_education: Maximum education level to include
            work_experience: Maximum work experience to include
            education_filter_type: "hierarchy" (include all levels up to max) or "strict" (exact match only)
            experience_filter_type: "hierarchy" (include all levels up to max) or "strict" (exact match only)
        """
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
        
        # Validate filter types
        valid_filter_types = ["hierarchy", "strict"]
        if education_filter_type not in valid_filter_types:
            raise ValueError(f"education_filter_type must be one of {valid_filter_types}")
        if experience_filter_type not in valid_filter_types:
            raise ValueError(f"experience_filter_type must be one of {valid_filter_types}")
        
        # Get filtering levels based on filter type
        if education_filter_type == "hierarchy":
            allowed_education_levels = self._get_education_hierarchy(entry_level_education)
        else:  # strict
            allowed_education_levels = [entry_level_education]
            
        if experience_filter_type == "hierarchy":
            allowed_experience_levels = self._get_experience_hierarchy(work_experience)
        else:  # strict
            allowed_experience_levels = [work_experience]
        
        logger.info(f"Education filtering ({education_filter_type}): {allowed_education_levels}")
        logger.info(f"Experience filtering ({experience_filter_type}): {allowed_experience_levels}")
        
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
                    
                    # Get education and experience requirements
                    education_req = proj_row.get('Typical Entry-Level Education')
                    experience_req = proj_row.get('Work Experience in a Related Occupation')
                    
                    # Apply filtering based on hierarchy
                    if education_req and education_req not in allowed_education_levels:
                        continue  # Skip if education requirement doesn't meet criteria
                    
                    if experience_req and experience_req not in allowed_experience_levels:
                        continue  # Skip if experience requirement doesn't meet criteria
                    
                    occupation.update({
                        'employment_2023': proj_row.get('Employment 2023'),
                        'employment_2033': proj_row.get('Employment 2033'),
                        'growth_pct': proj_row.get('Employment Percent Change, 2023-2033'),
                        'education_level': education_req,
                        'work_experience': experience_req
                    })
                else:
                    # If no projections data, still include the occupation but without filtering
                    # This ensures we don't lose occupations that might not have complete projection data
                    pass
            
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
    
    def get_related_occupations_with_filters(self, cip_code: str, max_results: int = 10,
                                           filters: Dict[str, any] = None) -> List[Dict]:
        """Get related SOC occupations with flexible filtering options
        
        Args:
            cip_code: The CIP code to search for
            max_results: Maximum number of results to return
            filters: Dictionary with filtering options:
                - entry_level_education: Maximum education level to include
                - work_experience: Maximum work experience to include
                - education_filter_type: "hierarchy" or "strict"
                - experience_filter_type: "hierarchy" or "strict"
                
        Example:
            filters = {
                "entry_level_education": "Bachelor's degree",
                "work_experience": "None",
                "education_filter_type": "strict",      # Only Bachelor's degree
                "experience_filter_type": "hierarchy"  # None, Less than 5 years, 5+ years
            }
        """
        if filters is None:
            filters = {}
        
        return self.get_related_occupations(
            cip_code=cip_code,
            max_results=max_results,
            entry_level_education=filters.get("entry_level_education", "Bachelor's degree"),
            work_experience=filters.get("work_experience", "None"),
            education_filter_type=filters.get("education_filter_type", "hierarchy"),
            experience_filter_type=filters.get("experience_filter_type", "hierarchy")
        )
    
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
            'data_source': 'BLS_Crosswalk_2020',
            'available_education_levels': ENTRY_LEVEL_EDUCATION,
            'available_experience_levels': WORK_EXPERIENCE_REQUIRED
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
