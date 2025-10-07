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
                # Clean the occupation code column
                if 'Occupation Code' in self.projections_data.columns:
                    self.projections_data['Occupation Code'] = (
                        self.projections_data['Occupation Code']
                        .astype(str)
                        .str.replace('="', '')
                        .str.replace('"', '')
                        .str.strip()
                    )
                logger.info(f"Loaded {len(self.projections_data)} employment projections")
                logger.info(f"Projections columns: {list(self.projections_data.columns)}")
            else:
                logger.warning(f"Employment projections file not found: {proj_file}")
            
            # Load OEWS data
            oews_file = self.data_dir / "OEWS2023.csv"
            if oews_file.exists():
                self.oews_data = pd.read_csv(oews_file, low_memory=False)
                
                # Keep only rows with valid occupation codes and wages
                self.oews_data = self.oews_data[
                    (self.oews_data['OCC_CODE'].notna()) &
                    (self.oews_data['A_MEDIAN'].notna())
                ]
                
                # Convert to numeric, handling '#' and other non-numeric values
                self.oews_data['A_MEDIAN'] = pd.to_numeric(
                    self.oews_data['A_MEDIAN'].astype(str).str.replace('#', '').str.replace(',', ''), 
                    errors='coerce'
                )
                self.oews_data['TOT_EMP'] = pd.to_numeric(
                    self.oews_data['TOT_EMP'].astype(str).str.replace('#', '').str.replace(',', ''), 
                    errors='coerce'
                )
                
                # Remove rows where wage conversion failed
                self.oews_data = self.oews_data.dropna(subset=['A_MEDIAN'])
                
                logger.info(f"Loaded {len(self.oews_data)} OEWS records with valid wages")
                
        except Exception as e:
            logger.warning(f"Failed to load supporting data: {e}")
            import traceback
            logger.warning(traceback.format_exc())
    
    def _get_education_hierarchy(self, max_education: str) -> List[str]:
        try:
            max_index = ENTRY_LEVEL_EDUCATION.index(max_education)
            return ENTRY_LEVEL_EDUCATION[max_index:]
        except ValueError:
            logger.warning(f"Invalid education level: {max_education}, using default (Bachelor's degree)")
            return ENTRY_LEVEL_EDUCATION[2:]
    
    def _get_experience_hierarchy(self, max_experience: str) -> List[str]:
        try:
            max_index = WORK_EXPERIENCE_REQUIRED.index(max_experience)
            return WORK_EXPERIENCE_REQUIRED[max_index:]
        except ValueError:
            logger.warning(f"Invalid work experience level: {max_experience}, using default (None)")
            return WORK_EXPERIENCE_REQUIRED[2:]
    
    def get_related_occupations(self, cip_code: str, max_results: int = 3, 
                               entry_level_education: str = "Bachelor's degree",
                               work_experience: str = "None",
                               education_filter_type: str = "hierarchy",
                               experience_filter_type: str = "hierarchy") -> List[Dict]:
        """Get related SOC occupations for a given CIP code with filtering"""
        
        if self.crosswalk_data is None or self.crosswalk_data.empty:
            raise RuntimeError("Crosswalk data not loaded or empty")
        
        if not self._is_valid_cip_code(cip_code):
            available_codes = sorted(list(self.cip_codes))[:10]
            raise ValueError(
                f"Invalid CIP code: {cip_code}. Available codes include: {', '.join(available_codes)}..."
            )
        
        # Get all mappings for this CIP code
        if str(cip_code) in self.cip_codes:
            mappings = self.crosswalk_data[
                self.crosswalk_data['CIP2020Code'].astype(str) == cip_code
            ]
        else:
            mappings = self.crosswalk_data[
                self.crosswalk_data['CIP2020Code'].astype(str).str.startswith(cip_code)
            ]
        
        if mappings.empty:
            logger.warning(f"No occupations found for CIP code {cip_code}")
            return []
        
        logger.info(f"Found {len(mappings)} occupations for CIP {cip_code}")
        
        # Validate filter types
        valid_filter_types = ["hierarchy", "strict"]
        if education_filter_type not in valid_filter_types:
            raise ValueError(f"education_filter_type must be one of {valid_filter_types}")
        if experience_filter_type not in valid_filter_types:
            raise ValueError(f"experience_filter_type must be one of {valid_filter_types}")
        
        # Determine allowed education and experience levels
        if education_filter_type == "hierarchy":
            allowed_education_levels = self._get_education_hierarchy(entry_level_education)
        else:
            allowed_education_levels = [entry_level_education]
            
        if experience_filter_type == "hierarchy":
            allowed_experience_levels = self._get_experience_hierarchy(work_experience)
        else:
            allowed_experience_levels = [work_experience]
        
        occupations = []
        filtered_out = 0
        
        for _, row in mappings.iterrows():
            soc_code = row['SOC2018Code']
            
            occupation = {
                'soc_code': soc_code,
                'soc_title': row['SOC2018Title'],
                'cip_code': row['CIP2020Code'],
                'cip_title': row['CIP2020Title'],
                'source': 'BLS_Crosswalk'
            }
            
            # Try to enrich with projection data
            should_include = True
            if self.projections_data is not None:
                proj_match = self.projections_data[
                    self.projections_data['Occupation Code'] == soc_code
                ]
                
                if not proj_match.empty:
                    proj_row = proj_match.iloc[0]
                    education_req = proj_row.get('Typical Entry-Level Education')
                    experience_req = proj_row.get('Work Experience in a Related Occupation')
                    
                    # ONLY filter if we have projection data AND it doesn't match
                    if pd.notna(education_req) and education_req not in allowed_education_levels:
                        logger.debug(f"Filtering {soc_code}: education {education_req} not in {allowed_education_levels}")
                        filtered_out += 1
                        should_include = False
                        continue
                        
                    if pd.notna(experience_req) and experience_req not in allowed_experience_levels:
                        logger.debug(f"Filtering {soc_code}: experience {experience_req} not in {allowed_experience_levels}")
                        filtered_out += 1
                        should_include = False
                        continue
                    
                    # Add projection data to occupation
                    occupation.update({
                        'employment_2023': proj_row.get('Employment 2023'),
                        'employment_2033': proj_row.get('Employment 2033'),
                        'growth_pct': proj_row.get('Employment Percent Change, 2023-2033'),
                        'education_level': education_req,
                        'work_experience': experience_req
                    })
                else:
                    # No projection data found - INCLUDE the occupation anyway
                    logger.debug(f"No projection data for {soc_code}, including anyway")
            
            # Enrich with OEWS wage data
            if self.oews_data is not None:
                # Try to find matching OEWS data
                oews_match = self.oews_data[self.oews_data['OCC_CODE'] == soc_code]
                
                if not oews_match.empty:
                    oews_row = oews_match.iloc[0]
                    median_wage = oews_row.get('A_MEDIAN')
                    total_emp = oews_row.get('TOT_EMP')
                    
                    if pd.notna(median_wage):
                        occupation['median_wage'] = float(median_wage)
                    if pd.notna(total_emp):
                        occupation['total_employment'] = float(total_emp)
                    
                    logger.debug(f"Found OEWS data for {soc_code}: wage=${median_wage}, emp={total_emp}")
                else:
                    logger.debug(f"No OEWS data found for {soc_code}")
            
            if should_include:
                occupations.append(occupation)
        
        logger.info(f"Returning {len(occupations)} occupations (filtered out {filtered_out})")
        
        return occupations[:max_results]
    
    def _is_valid_cip_code(self, cip_code: str) -> bool:
        if not cip_code:
            return False
        
        sys.stderr.write(f"Validating CIP code: '{cip_code}'\n")
        
        if str(cip_code) in self.cip_codes:
            return True
        
        if '.' in cip_code:
            parts = cip_code.split('.')
            if len(parts) == 2 and len(parts[0]) in [1,2] and len(parts[1]) == 4:
                prefix = cip_code
                for full_cip in self.cip_codes:
                    if str(full_cip).startswith(prefix):
                        return True
        return False
    
    def get_mapping_statistics(self) -> Dict:
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
        if self.crosswalk_data is None:
            return []
        
        cip_summary = self.crosswalk_data[['CIP2020Code', 'CIP2020Title']].drop_duplicates()
        
        if search_term:
            mask = cip_summary['CIP2020Title'].str.contains(search_term, case=False, na=False)
            cip_summary = cip_summary[mask]
        
        results = []
        for _, row in cip_summary.head(limit).iterrows():
            results.append({
                'cip_code': row['CIP2020Code'],
                'title': row['CIP2020Title']
            })
        
        return results
    
    def get_cip_info(self, cip_code: str) -> Optional[Dict]:
        if not self._is_valid_cip_code(cip_code):
            return None
        
        if str(cip_code) in self.cip_codes:
            cip_info = self.crosswalk_data[
                self.crosswalk_data['CIP2020Code'].astype(str) == cip_code
            ].iloc[0]
        else:
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