"""
Scoring Engine for Career Recommendation System

Implements multi-factor scoring algorithm to rank occupations based on:
- Skill similarity (45% weight)
- Pay score (20% weight)
- Growth score (15% weight)
- Education fit (10% weight)
- Location fit (10% weight)
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Tuple
import logging
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class ScoringWeights:
    """Weights for different scoring factors"""
    skill_similarity: float = 0.45
    pay_score: float = 0.20
    growth_score: float = 0.15
    education_fit: float = 0.10
    location_fit: float = 0.10

@dataclass
class ScoringPreferences:
    """User preferences for scoring adjustments"""
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None
    preferred_growth: Optional[float] = None
    preferred_education: Optional[str] = None
    location: Optional[str] = None

class ScoringEngine:
    """Implements multi-factor scoring algorithm for occupation ranking"""
    
    def __init__(self, weights: ScoringWeights = None, preferences: ScoringPreferences = None):
        self.weights = weights or ScoringWeights()
        self.preferences = preferences or ScoringPreferences()
        
        # Validate weights sum to 1.0
        total_weight = sum(vars(self.weights).values())
        if abs(total_weight - 1.0) > 0.001:
            raise ValueError(f"Weights must sum to 1.0, got {total_weight}")
    
    def calculate_occupation_scores(self, occupations: List[Dict]) -> List[Dict]:
        """Calculate comprehensive scores for a list of occupations"""
        if not occupations:
            return []
        
        scored_occupations = []
        
        for occupation in occupations:
            # Calculate individual factor scores
            skill_score = self._calculate_skill_score(occupation)
            pay_score = self._calculate_pay_score(occupation)
            growth_score = self._calculate_growth_score(occupation)
            education_score = self._calculate_education_score(occupation)
            location_score = self._calculate_location_score(occupation)
            
            # Calculate weighted total score
            total_score = (
                skill_score * self.weights.skill_similarity +
                pay_score * self.weights.pay_score +
                growth_score * self.weights.growth_score +
                education_score * self.weights.education_fit +
                location_score * self.weights.location_fit
            )
            
            # Create scored occupation
            scored_occupation = occupation.copy()
            scored_occupation.update({
                'skill_score': skill_score,
                'pay_score': pay_score,
                'growth_score': growth_score,
                'education_score': education_score,
                'location_score': location_score,
                'total_score': total_score,
                'factor_breakdown': {
                    'skill': skill_score,
                    'pay': pay_score,
                    'growth': growth_score,
                    'education': education_score,
                    'location': location_score
                }
            })
            
            scored_occupations.append(scored_occupation)
        
        return scored_occupations
    
    def _calculate_skill_score(self, occupation: Dict) -> float:
        """Calculate skill similarity score (0-1)"""
        # Full confidence for official crosswalk-based mappings
        if occupation.get('source') == 'BLS_Crosswalk':
            return 1.0  # Full confidence for official mappings
        
        # No confidence for other sources
        return 0.0
    
    def _calculate_pay_score(self, occupation: Dict) -> float:
        """Calculate pay score (0-1) based on median wage"""
        median_wage = occupation.get('median_wage')
        
        if median_wage is None or pd.isna(median_wage):
            return 0.5  # Neutral score for missing data
        
        # Normalize wage to 0-1 scale
        # Use percentiles: 0th = 0.0, 50th = 0.5, 100th = 1.0
        # Based on typical US wage distribution
        if median_wage < 30000:
            score = 0.1
        elif median_wage < 50000:
            score = 0.3
        elif median_wage < 75000:
            score = 0.5
        elif median_wage < 100000:
            score = 0.7
        elif median_wage < 150000:
            score = 0.85
        else:
            score = 1.0
        
        # Apply preference adjustments
        if self.preferences.min_salary and median_wage < self.preferences.min_salary:
            score *= 0.5  # Penalize below minimum
        
        if self.preferences.max_salary and median_wage > self.preferences.max_salary:
            score *= 0.8  # Slight penalty for above maximum
        
        return score
    
    def _calculate_growth_score(self, occupation: Dict) -> float:
        """Calculate growth score (0-1) based on employment projections"""
        growth_pct = occupation.get('growth_pct')
        
        if growth_pct is None or pd.isna(growth_pct):
            return 0.5  # Neutral score for missing data
        
        # Convert to numeric if it's a string
        try:
            if isinstance(growth_pct, str):
                growth_pct = float(growth_pct.replace('%', '').replace(',', ''))
        except (ValueError, AttributeError):
            return 0.5  # Return neutral score if conversion fails
        
        # Normalize growth percentage to 0-1 scale
        # Negative growth = 0.0, 0% = 0.5, 10%+ = 1.0
        if growth_pct < 0:
            score = 0.0
        elif growth_pct < 5:
            score = 0.3
        elif growth_pct < 10:
            score = 0.6
        elif growth_pct < 15:
            score = 0.8
        else:
            score = 1.0
        
        # Apply preference adjustments
        if self.preferences.preferred_growth:
            if abs(growth_pct - self.preferences.preferred_growth) < 5:
                score *= 1.2  # Boost for preferred growth range
            elif growth_pct < self.preferences.preferred_growth:
                score *= 0.8  # Penalize for lower growth
        
        return min(score, 1.0)  # Cap at 1.0
    
    def _calculate_education_score(self, occupation: Dict) -> float:
        """Calculate education fit score (0-1)"""
        required_education = occupation.get('education_level')
        
        if not required_education:
            return 0.5  # Neutral score for missing data
        
        # Education hierarchy scoring
        education_hierarchy = {
            'No formal educational credential': 0.1,
            'High school diploma or equivalent': 0.2,
            'Some college, no degree': 0.3,
            'Postsecondary nondegree award': 0.4,
            'Associate\'s degree': 0.5,
            'Bachelor\'s degree': 0.7,
            'Master\'s degree': 0.85,
            'Doctoral or professional degree': 1.0
        }
        
        base_score = education_hierarchy.get(required_education, 0.5)
        
        # Apply preference adjustments
        if self.preferences.preferred_education:
            if required_education == self.preferences.preferred_education:
                base_score *= 1.2  # Boost for exact match
            elif self._is_education_compatible(required_education, self.preferences.preferred_education):
                base_score *= 1.1  # Boost for compatible education
        
        return min(base_score, 1.0)
    
    def _is_education_compatible(self, required: str, preferred: str) -> bool:
        """Check if required education is compatible with preferred level"""
        education_levels = [
            'No formal educational credential',
            'High school diploma or equivalent',
            'Some college, no degree',
            'Postsecondary nondegree award',
            'Associate\'s degree',
            'Bachelor\'s degree',
            'Master\'s degree',
            'Doctoral or professional degree'
        ]
        
        try:
            required_idx = education_levels.index(required)
            preferred_idx = education_levels.index(preferred)
            return required_idx <= preferred_idx  # Required <= Preferred
        except ValueError:
            return False
    
    def _calculate_location_score(self, occupation: Dict) -> float:
        """Calculate location fit score (0-1)"""
        # For now, return neutral score since we don't have detailed location data
        # This can be enhanced with actual location-based data
        return 0.5
    
    def rank_occupations(self, occupations: List[Dict], top_n: int = 3) -> List[Dict]:
        """Rank occupations by total score and return top N"""
        if not occupations:
            return []
        
        # Calculate scores
        scored_occupations = self.calculate_occupation_scores(occupations)
        
        # Sort by total score (descending)
        scored_occupations.sort(key=lambda x: x['total_score'], reverse=True)
        
        # Apply diversification to avoid near-duplicates
        diversified_occupations = self._apply_diversification(scored_occupations, top_n)
        
        return diversified_occupations[:top_n]
    
    def _apply_diversification(self, occupations: List[Dict], top_n: int) -> List[Dict]:
        """Apply diversification to avoid near-duplicate occupations"""
        if len(occupations) <= top_n:
            return occupations
        
        diversified = []
        used_soc_codes = set()
        
        for occupation in occupations:
            if len(diversified) >= top_n:
                break
            
            soc_code = occupation['soc_code']
            
            # Check if this SOC code is too similar to already selected ones
            if not self._is_too_similar(soc_code, used_soc_codes):
                diversified.append(occupation)
                used_soc_codes.add(soc_code)
        
        # If we don't have enough diversified results, add remaining top scores
        remaining = [occ for occ in occupations if occ['soc_code'] not in used_soc_codes]
        diversified.extend(remaining[:top_n - len(diversified)])
        
        return diversified
    
    def _is_too_similar(self, soc_code: str, used_codes: set) -> bool:
        """Check if SOC code is too similar to already selected codes"""
        # Simple similarity check based on SOC code structure
        # Major group (first 2 digits) should be different
        major_group = soc_code[:2]
        
        for used_code in used_codes:
            if used_code[:2] == major_group:
                return True
        
        return False
    
    def get_scoring_summary(self, occupations: List[Dict]) -> Dict:
        """Get summary of scoring results"""
        if not occupations:
            return {}
        
        scores = {
            'skill_scores': [occ.get('skill_score', 0) for occ in occupations],
            'pay_scores': [occ.get('pay_score', 0) for occ in occupations],
            'growth_scores': [occ.get('growth_score', 0) for occ in occupations],
            'education_scores': [occ.get('education_score', 0) for occ in occupations],
            'location_scores': [occ.get('location_score', 0) for occ in occupations],
            'total_scores': [occ.get('total_score', 0) for occ in occupations]
        }
        
        summary = {
            'count': len(occupations),
            'avg_total_score': np.mean(scores['total_scores']),
            'score_ranges': {
                'skill': (min(scores['skill_scores']), max(scores['skill_scores'])),
                'pay': (min(scores['pay_scores']), max(scores['pay_scores'])),
                'growth': (min(scores['growth_scores']), max(scores['growth_scores'])),
                'education': (min(scores['education_scores']), max(scores['education_scores'])),
                'location': (min(scores['location_scores']), max(scores['location_scores']))
            },
            'weights_used': vars(self.weights)
        }
        
        return summary
