"""
Main Recommendation Engine for Career Recommendation System

Orchestrates the entire career recommendation process by coordinating:
- Data management
- CIP mapping
- Scoring and ranking
- Response formatting
"""

import pandas as pd
from typing import Dict, List, Optional, Any
import logging
from dataclasses import dataclass
from pathlib import Path

from data.data_manager import DataManager, DataConfig
from data.cip_mapper import CIPMapper
from scoring_engine import ScoringEngine, ScoringWeights, ScoringPreferences
from skills_engine import SkillsEngine, SkillsConfig

logger = logging.getLogger(__name__)

@dataclass
class RecommendationRequest:
    """Request structure for career recommendations"""
    cip_code: str
    preferences: Optional[Dict[str, Any]] = None
    max_results: int = 3
    include_metadata: bool = True
    entry_level_education: str = "Bachelor's degree"
    work_experience: str = "None"
    education_filter_type: str = "hierarchy"
    experience_filter_type: str = "hierarchy"

@dataclass
class RecommendationResponse:
    """Response structure for career recommendations"""
    recommendations: List[Dict]
    metadata: Dict[str, Any]
    request: RecommendationRequest

class RecommendationEngine:
    """Main engine for generating career recommendations"""
    
    def __init__(self, data_config: DataConfig = None, skills_config: SkillsConfig = None):
        self.data_config = data_config or DataConfig()
        self.skills_config = skills_config or SkillsConfig()
        self.data_manager = None
        self.cip_mapper = None
        self.scoring_engine = None
        self.skills_engine = None
        self._initialized = False
        
        # Data enrichment DataFrames
        self.oews_df = None
        self.soc_definitions_df = None
        self.employment_projections_df = None
    
    def initialize(self) -> bool:
        """Initialize the recommendation engine with all components"""
        try:
            logger.info("Initializing recommendation engine...")
            
            # Initialize data manager
            self.data_manager = DataManager(self.data_config)
            
            # Load all data
            if not self.data_manager.load_all_data():
                raise RuntimeError("Failed to load data")
            
            # Load enrichment data
            self._load_enrichment_data()
            
            # Validate data integrity
            validation_results = self.data_manager.validate_data_integrity()
            if not all(validation_results.values()):
                logger.warning(f"Data validation issues: {validation_results}")
            
            # Initialize skills engine
            self.skills_engine = SkillsEngine(self.skills_config)
            
            # Initialize CIP mapper (now simplified, loads its own crosswalk data)
            self.cip_mapper = CIPMapper(data_dir=str(self.data_config.data_dir))
            
            # Initialize scoring engine with default weights
            self.scoring_engine = ScoringEngine()
            
            self._initialized = True
            logger.info("Recommendation engine initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize recommendation engine: {e}")
            return False
    
    def _load_enrichment_data(self):
        """Load additional data for enriching recommendations"""
        try:
            data_dir = Path(self.data_config.data_dir)
            
            # Load OEWS data (wage information)
            oews_path = data_dir / "OEWS2023.csv"
            if oews_path.exists():
                self.oews_df = pd.read_csv(oews_path)
                logger.info(f"Loaded OEWS data: {len(self.oews_df)} rows")
                logger.info(f"OEWS columns: {list(self.oews_df.columns)}")
            else:
                logger.warning(f"OEWS data not found at {oews_path}")
            
            # Load SOC definitions (descriptions)
            soc_def_path = data_dir / "2018 SOC Definitions.csv"
            if soc_def_path.exists():
                self.soc_definitions_df = pd.read_csv(soc_def_path)
                logger.info(f"Loaded SOC definitions: {len(self.soc_definitions_df)} rows")
                logger.info(f"SOC definitions columns: {list(self.soc_definitions_df.columns)}")
            else:
                logger.warning(f"SOC definitions not found at {soc_def_path}")
            
            # Load employment projections (growth data)
            emp_proj_path = data_dir / "Employment Projections 2023-2033.csv"
            if emp_proj_path.exists():
                self.employment_projections_df = pd.read_csv(emp_proj_path)
                logger.info(f"Loaded employment projections: {len(self.employment_projections_df)} rows")
            else:
                logger.warning(f"Employment projections not found at {emp_proj_path}")
                
        except Exception as e:
            logger.error(f"Error loading enrichment data: {e}")
    
    def _enrich_occupation(self, occupation: Dict) -> Dict:
        """Enrich occupation with wage, description, and growth data"""
        soc_code = occupation.get('soc_code', '')
        
        try:
            # Enrich with OEWS wage data
            if self.oews_df is not None and soc_code:
                wage_data = self._get_wage_data(soc_code)
                if wage_data:
                    occupation.update(wage_data)
            
            # Enrich with SOC description
            if self.soc_definitions_df is not None and soc_code:
                description = self._get_soc_description(soc_code)
                if description:
                    occupation['description'] = description
            
            # Enrich with employment projections
            if self.employment_projections_df is not None and soc_code:
                projection_data = self._get_projection_data(soc_code)
                if projection_data:
                    occupation.update(projection_data)
                    
        except Exception as e:
            logger.warning(f"Error enriching occupation {soc_code}: {e}")
        
        return occupation
    
    def _get_wage_data(self, soc_code: str) -> Optional[Dict]:
        """Extract wage data from OEWS"""
        try:
            clean_soc = soc_code.replace('-', '')
            
            # Find SOC code column
            soc_col = None
            for col in ['OCC_CODE', 'SOC_CODE', 'O*NET-SOC Code', 'SOC']:
                if col in self.oews_df.columns:
                    soc_col = col
                    break
            
            if not soc_col:
                return None
            
            # Match the SOC code
            mask = self.oews_df[soc_col].astype(str).str.replace('-', '') == clean_soc
            matches = self.oews_df[mask]
            
            if len(matches) == 0:
                return None
            
            row = matches.iloc[0]
            result = {}
            
            # Extract annual median wage
            for wage_col in ['A_MEDIAN', 'H_MEDIAN', 'ANNUAL MEDIAN WAGE', 'Median Annual Wage']:
                if wage_col in row.index and pd.notna(row[wage_col]):
                    try:
                        wage_str = str(row[wage_col]).replace(',', '').replace('$', '').strip()
                        if wage_str and wage_str != '#':
                            result['median_wage'] = float(wage_str)
                            break
                    except (ValueError, AttributeError):
                        pass
            
            # Extract employment
            for emp_col in ['TOT_EMP', 'EMPLOYMENT', 'Total Employment']:
                if emp_col in row.index and pd.notna(row[emp_col]):
                    try:
                        emp_str = str(row[emp_col]).replace(',', '').strip()
                        if emp_str and emp_str != '#':
                            result['total_employment'] = float(emp_str)
                            break
                    except (ValueError, AttributeError):
                        pass
            
            return result if result else None
            
        except Exception as e:
            logger.warning(f"Error getting wage data for {soc_code}: {e}")
            return None
    
    def _get_soc_description(self, soc_code: str) -> Optional[str]:
        """Extract description from SOC definitions"""
        try:
            clean_soc = soc_code.replace('-', '')
            
            # Find SOC code column
            soc_col = None
            for col in ['SOC Code', 'O*NET-SOC Code', 'SOC_CODE', 'Code']:
                if col in self.soc_definitions_df.columns:
                    soc_col = col
                    break
            
            if not soc_col:
                return None
            
            # Match the SOC code
            mask = self.soc_definitions_df[soc_col].astype(str).str.replace('-', '') == clean_soc
            matches = self.soc_definitions_df[mask]
            
            if len(matches) == 0:
                return None
            
            row = matches.iloc[0]
            
            # Find description column
            for desc_col in ['Definition', 'Description', 'SOC Definition', 'Illustrative Examples']:
                if desc_col in row.index and pd.notna(row[desc_col]):
                    return str(row[desc_col]).strip()
            
            return None
            
        except Exception as e:
            logger.warning(f"Error getting description for {soc_code}: {e}")
            return None
    
    def _get_projection_data(self, soc_code: str) -> Optional[Dict]:
        """Extract employment projection data"""
        try:
            clean_soc = soc_code.replace('-', '')
            
            # Find SOC code column
            soc_col = None
            for col in ['SOC', 'SOC_CODE', 'Occupation Code', 'Code']:
                if col in self.employment_projections_df.columns:
                    soc_col = col
                    break
            
            if not soc_col:
                return None
            
            # Match the SOC code
            mask = self.employment_projections_df[soc_col].astype(str).str.replace('-', '') == clean_soc
            matches = self.employment_projections_df[mask]
            
            if len(matches) == 0:
                return None
            
            row = matches.iloc[0]
            result = {}
            
            # Extract 2023 employment
            for col in ['2023', 'Employment 2023', 'Employment_2023']:
                if col in row.index and pd.notna(row[col]):
                    try:
                        result['employment_2023'] = float(str(row[col]).replace(',', ''))
                        break
                    except (ValueError, AttributeError):
                        pass
            
            # Extract 2033 employment
            for col in ['2033', 'Employment 2033', 'Employment_2033']:
                if col in row.index and pd.notna(row[col]):
                    try:
                        result['employment_2033'] = float(str(row[col]).replace(',', ''))
                        break
                    except (ValueError, AttributeError):
                        pass
            
            # Calculate growth percentage if we have both years
            if 'employment_2023' in result and 'employment_2033' in result:
                if result['employment_2023'] > 0:
                    growth = ((result['employment_2033'] - result['employment_2023']) / result['employment_2023']) * 100
                    result['growth_pct'] = round(growth, 1)
            
            # Check for pre-calculated growth percentage
            for col in ['Change, percent', 'Growth %', 'Percent Change']:
                if col in row.index and pd.notna(row[col]):
                    try:
                        growth_str = str(row[col]).replace('%', '').replace(',', '').strip()
                        result['growth_pct'] = float(growth_str)
                        break
                    except (ValueError, AttributeError):
                        pass
            
            return result if result else None
            
        except Exception as e:
            logger.warning(f"Error getting projection data for {soc_code}: {e}")
            return None
    
    def get_recommendations(self, request: RecommendationRequest) -> RecommendationResponse:
        """Generate career recommendations for a given CIP code"""
        if not self._initialized:
            raise RuntimeError("Recommendation engine not initialized. Call initialize() first.")
        
        try:
            logger.info(f"Generating recommendations for CIP code: {request.cip_code}")
            
            # Validate CIP code
            if not self._is_valid_cip_code(request.cip_code):
                raise ValueError(f"Invalid CIP code: {request.cip_code}")
            
            # Get related occupations - Request MORE to ensure we get enough after filtering
            occupations = self.cip_mapper.get_related_occupations(
                request.cip_code, 
                max_results=request.max_results * 5,  # Get 5x more for better filtering
                entry_level_education=request.entry_level_education,
                work_experience=request.work_experience,
                education_filter_type=request.education_filter_type,
                experience_filter_type=request.experience_filter_type
            )
            
            if not occupations:
                logger.warning(f"No occupations found for CIP code: {request.cip_code}")
                return self._create_empty_response(request)
            
            logger.info(f"Found {len(occupations)} occupations before enrichment")
            
            # ENRICH each occupation with wage/description/growth data
            enriched_occupations = []
            for occ in occupations:
                enriched_occ = self._enrich_occupation(occ)
                enriched_occupations.append(enriched_occ)
            
            # Extract skills for CIP code if skills engine is available
            if self.skills_engine:
                cip_info = self.cip_mapper.get_cip_info(request.cip_code)
                if cip_info:
                    # Extract skills from CIP title and description
                    cip_text = f"{cip_info['cip_title']}"
                    extracted_skills = self.skills_engine.extract_skills_from_text(cip_text, max_skills=20)
                    
                    # Add skills to each occupation for context
                    for occupation in enriched_occupations:
                        occupation['cip_skills'] = [skill.name for skill in extracted_skills]
            
            # Apply scoring preferences if provided
            if request.preferences:
                self._apply_user_preferences(request.preferences)
            
            # Score and rank occupations
            ranked_occupations = self.scoring_engine.rank_occupations(
                enriched_occupations, 
                top_n=request.max_results
            )
            
            logger.info(f"Ranked {len(ranked_occupations)} occupations")
            
            # Format recommendations
            formatted_recommendations = self._format_recommendations(ranked_occupations)
            
            # Create response
            response = RecommendationResponse(
                recommendations=formatted_recommendations,
                metadata=self._create_metadata(request, ranked_occupations),
                request=request
            )
            
            logger.info(f"Generated {len(formatted_recommendations)} recommendations")
            return response
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {e}")
            import traceback
            logger.error(traceback.format_exc())
            raise
    
    def _is_valid_cip_code(self, cip_code: str) -> bool:
        """Validate that the CIP code exists in our data"""
        if not cip_code:
            return False
        
        # Use the CIP mapper's validation method
        return self.cip_mapper._is_valid_cip_code(cip_code)
    
    def _apply_user_preferences(self, preferences: Dict[str, Any]):
        """Apply user preferences to the scoring engine"""
        scoring_prefs = ScoringPreferences()
        
        # Map preference keys to ScoringPreferences fields
        preference_mapping = {
            'min_salary': 'min_salary',
            'max_salary': 'max_salary',
            'preferred_growth': 'preferred_growth',
            'preferred_education': 'preferred_education',
            'location': 'location'
        }
        
        for key, value in preferences.items():
            if key in preference_mapping and value is not None:
                setattr(scoring_prefs, preference_mapping[key], value)
        
        # Update scoring engine preferences
        self.scoring_engine.preferences = scoring_prefs
    
    def _format_recommendations(self, occupations: List[Dict]) -> List[Dict]:
        """Format occupations into the required response format"""
        formatted = []
        
        for occupation in occupations:
            # Use the enriched description if available
            description = occupation.get('description')
            if not description or description.startswith("Occupation mapped from"):
                # Fallback to generic description
                description = f"Career opportunity in {occupation.get('soc_title', 'this field')}"
            
            formatted_occ = {
                'soc': occupation['soc_code'],
                'title': occupation['soc_title'],
                'description': description,
                'skills_overlap': round(occupation.get('skill_score', 0), 3),
                'median_pay_usd': occupation.get('median_wage'),
                'growth_10yr_pct': occupation.get('growth_pct'),
                'education_needed': occupation.get('education_level'),
                'why_match': self._generate_why_match(occupation),
                'confidence_score': round(occupation.get('total_score', 0), 3),
                'cip_skills': occupation.get('cip_skills', []),
                'employment_2023': occupation.get('employment_2023'),
                'employment_2033': occupation.get('employment_2033'),
                'total_employment': occupation.get('total_employment')
            }
            
            # Clean up None values
            formatted_occ = {k: v for k, v in formatted_occ.items() if v is not None}
            
            formatted.append(formatted_occ)
        
        return formatted
    
    def _generate_why_match(self, occupation: Dict) -> str:
        """Generate explanation for why this occupation matches"""
        reasons = []
        
        # Skill match
        skill_score = occupation.get('skill_score', 0)
        if skill_score > 0.7:
            reasons.append("Strong skill alignment with your major")
        elif skill_score > 0.4:
            reasons.append("Good skill alignment with your major")
        
        # Source-based reasoning
        if occupation.get('source') == 'BLS_Crosswalk':
            reasons.append("Official BLS mapping - high confidence match")
        
        # Growth potential (if available)
        growth_pct = occupation.get('growth_pct')
        if growth_pct is not None:
            try:
                if isinstance(growth_pct, str):
                    growth_pct = float(growth_pct.replace('%', '').replace(',', ''))
                if growth_pct > 10:
                    reasons.append(f"High growth potential ({growth_pct:.1f}% projected growth)")
                elif growth_pct > 5:
                    reasons.append(f"Good growth potential ({growth_pct:.1f}% projected growth)")
                elif growth_pct < 0:
                    reasons.append(f"Declining field ({growth_pct:.1f}% projected decline)")
            except (ValueError, AttributeError):
                pass
        
        # Salary (if available)
        median_wage = occupation.get('median_wage')
        if median_wage and median_wage > 75000:
            reasons.append(f"Above-average salary (${median_wage:,.0f} median)")
        elif median_wage and median_wage > 50000:
            reasons.append(f"Competitive salary (${median_wage:,.0f} median)")
        
        # Education fit (if available)
        education_level = occupation.get('education_level')
        if education_level:
            reasons.append(f"Education requirement: {education_level}")
        
        # Employment size (if available)
        total_employment = occupation.get('total_employment')
        if total_employment:
            if total_employment > 1000000:
                reasons.append("Large field with many opportunities")
            elif total_employment > 100000:
                reasons.append("Established field with good opportunities")
        
        if not reasons:
            reasons.append("Good overall match based on multiple factors")
        
        return "; ".join(reasons)
    
    def _create_metadata(self, request: RecommendationRequest, occupations: List[Dict]) -> Dict[str, Any]:
        """Create metadata for the response"""
        metadata = {
            'request_id': f"req_{hash(str(request))}",
            'timestamp': pd.Timestamp.now().isoformat(),
            'cip_code': request.cip_code,
            'total_occupations_analyzed': len(occupations),
            'scoring_summary': self.scoring_engine.get_scoring_summary(occupations),
            'mapping_statistics': self.cip_mapper.get_mapping_statistics()
        }
        
        if request.include_metadata:
            metadata.update({
                'data_summary': self.data_manager.get_data_summary(),
                'weights_used': vars(self.scoring_engine.weights)
            })
        
        return metadata
    
    def _create_empty_response(self, request: RecommendationRequest) -> RecommendationResponse:
        """Create empty response when no recommendations found"""
        return RecommendationResponse(
            recommendations=[],
            metadata={
                'request_id': f"req_{hash(str(request))}",
                'timestamp': pd.Timestamp.now().isoformat(),
                'cip_code': request.cip_code,
                'error': 'No occupations found for this CIP code',
                'total_occupations_analyzed': 0
            },
            request=request
        )
    
    def get_available_majors(self, search_term: str = None, limit: int = 50) -> List[Dict]:
        """Get available majors (CIP codes) with optional search"""
        if not self._initialized:
            raise RuntimeError("Recommendation engine not initialized")
        
        cip_data = self.data_manager.get_cip_data()
        
        if search_term:
            # Filter by search term
            mask = (
                cip_data['CIPTitle'].str.contains(search_term, case=False, na=False) |
                cip_data['CIPDefinition'].str.contains(search_term, case=False, na=False)
            )
            cip_data = cip_data[mask]
        
        # Limit results and format
        results = []
        for _, row in cip_data.head(limit).iterrows():
            results.append({
                'cip_code': row['CIPCode'],
                'title': row['CIPTitle'],
                'description': row['CIPDefinition'][:200] + "..." if len(row['CIPDefinition']) > 200 else row['CIPDefinition']
            })
        
        return results
    
    def get_skills_analysis(self, cip_code: str) -> Dict[str, Any]:
        """Get detailed skills analysis for a given CIP code"""
        if not self._initialized:
            raise RuntimeError("Recommendation engine not initialized")
        
        if not self._is_valid_cip_code(cip_code):
            raise ValueError(f"Invalid CIP code: {cip_code}")
        
        return self.cip_mapper.get_skills_analysis(cip_code)
    
    def get_engine_status(self) -> Dict[str, Any]:
        """Get the current status of the recommendation engine"""
        return {
            'initialized': self._initialized,
            'data_loaded': self.data_manager._loaded if self.data_manager else False,
            'data_summary': self.data_manager.get_data_summary() if self.data_manager else None,
            'mapping_stats': self.cip_mapper.get_mapping_statistics() if self.cip_mapper else None,
            'skills_engine_available': self.skills_engine is not None,
            'enrichment_data_loaded': {
                'oews': self.oews_df is not None,
                'soc_definitions': self.soc_definitions_df is not None,
                'employment_projections': self.employment_projections_df is not None
            },
            'skills_config': {
                'api_available': self.skills_engine._api_available if self.skills_engine else False,
                'fallback_enabled': self.skills_config.fallback_to_local if self.skills_config else False
            } if self.skills_engine else None
        }