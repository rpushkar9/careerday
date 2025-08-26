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
    
    def initialize(self) -> bool:
        """Initialize the recommendation engine with all components"""
        try:
            logger.info("Initializing recommendation engine...")
            
            # Initialize data manager
            self.data_manager = DataManager(self.data_config)
            
            # Load all data
            if not self.data_manager.load_all_data():
                raise RuntimeError("Failed to load data")
            
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
    
    def get_recommendations(self, request: RecommendationRequest) -> RecommendationResponse:
        """Generate career recommendations for a given CIP code"""
        if not self._initialized:
            raise RuntimeError("Recommendation engine not initialized. Call initialize() first.")
        
        try:
            logger.info(f"Generating recommendations for CIP code: {request.cip_code}")
            
            # Validate CIP code
            if not self._is_valid_cip_code(request.cip_code):
                raise ValueError(f"Invalid CIP code: {request.cip_code}")
            
            # Get related occupations
            occupations = self.cip_mapper.get_related_occupations(
                request.cip_code, 
                max_results=request.max_results * 2  # Get more for diversification
            )
            
            if not occupations:
                logger.warning(f"No occupations found for CIP code: {request.cip_code}")
                return self._create_empty_response(request)
            
            # Extract skills for CIP code if skills engine is available
            if self.skills_engine:
                cip_info = self.cip_mapper.get_cip_info(request.cip_code)
                if cip_info:
                    # Extract skills from CIP title and description
                    cip_text = f"{cip_info['cip_title']}"
                    extracted_skills = self.skills_engine.extract_skills_from_text(cip_text, max_skills=20)
                    
                    # Add skills to each occupation for context
                    for occupation in occupations:
                        occupation['cip_skills'] = [skill.name for skill in extracted_skills]
            
            # Apply scoring preferences if provided
            if request.preferences:
                self._apply_user_preferences(request.preferences)
            
            # Score and rank occupations
            ranked_occupations = self.scoring_engine.rank_occupations(
                occupations, 
                top_n=request.max_results
            )
            
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
            formatted_occ = {
                'soc': occupation['soc_code'],
                'title': occupation['soc_title'],
                'description': f"Occupation mapped from {occupation.get('cip_title', 'CIP code')}",
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
            'skills_config': {
                'api_available': self.skills_engine._api_available if self.skills_engine else False,
                'fallback_enabled': self.skills_config.fallback_to_local if self.skills_config else False
            } if self.skills_engine else None
        }
