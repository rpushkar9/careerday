"""
Skills Engine for Career Recommendation System

Handles skills extraction, analysis, and matching using:
- Lightcast API integration for skills taxonomy
- Advanced text processing and skill extraction
- Skills vector representation and similarity scoring
- Fallback to local skills matching when API unavailable
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Tuple, Set
import logging
import re
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json
from dataclasses import dataclass
from pathlib import Path

logger = logging.getLogger(__name__)

@dataclass
class SkillsConfig:
    """Configuration for skills engine"""
    lightcast_api_key: Optional[str] = None
    lightcast_base_url: str = "https://api.lightcast.io"
    max_skills_per_occupation: int = 50
    min_skill_confidence: float = 0.3
    cache_enabled: bool = True
    fallback_to_local: bool = True

@dataclass
class Skill:
    """Represents a skill with metadata"""
    name: str
    category: str
    confidence: float
    source: str  # 'lightcast', 'local', 'extracted'
    aliases: List[str] = None

class SkillsEngine:
    """Manages skills extraction, analysis, and matching"""
    
    def __init__(self, config: SkillsConfig = None):
        self.config = config or SkillsConfig()
        self._skills_cache = {}
        self._vectorizer = None
        self._skills_matrix = None
        self._local_skills = self._load_local_skills()
        
        # Initialize API client if key provided
        self._api_available = bool(self.config.lightcast_api_key)
        if self._api_available:
            logger.info("Lightcast API integration enabled")
        else:
            logger.info("Lightcast API not available, using local skills matching")
    
    def _load_local_skills(self) -> Dict[str, List[str]]:
        """Load local skills database as fallback"""
        # Common skills organized by category
        local_skills = {
            'technical': [
                'programming', 'data analysis', 'machine learning', 'statistics',
                'mathematics', 'engineering', 'design', 'research', 'analysis',
                'project management', 'database', 'software', 'hardware',
                'networking', 'cybersecurity', 'cloud computing', 'devops'
            ],
            'business': [
                'leadership', 'management', 'strategy', 'marketing', 'sales',
                'finance', 'accounting', 'operations', 'human resources',
                'customer service', 'communication', 'negotiation', 'planning'
            ],
            'soft_skills': [
                'communication', 'teamwork', 'problem solving', 'critical thinking',
                'creativity', 'adaptability', 'time management', 'organization',
                'attention to detail', 'initiative', 'flexibility', 'collaboration'
            ],
            'domain_knowledge': [
                'healthcare', 'education', 'finance', 'technology', 'manufacturing',
                'retail', 'government', 'nonprofit', 'consulting', 'research'
            ]
        }
        return local_skills
    
    def extract_skills_from_text(self, text: str, max_skills: int = None) -> List[Skill]:
        """Extract skills from text using multiple methods"""
        if not text:
            return []
        
        max_skills = max_skills or self.config.max_skills_per_occupation
        extracted_skills = []
        
        # Method 1: Try Lightcast API if available
        if self._api_available:
            api_skills = self._extract_skills_via_api(text, max_skills)
            if api_skills:
                extracted_skills.extend(api_skills)
                logger.info(f"Extracted {len(api_skills)} skills via Lightcast API")
        
        # Method 2: Local skills matching
        if len(extracted_skills) < max_skills and self.config.fallback_to_local:
            local_skills = self._extract_skills_locally(text, max_skills - len(extracted_skills))
            extracted_skills.extend(local_skills)
            logger.info(f"Extracted {len(local_skills)} skills via local matching")
        
        # Method 3: Pattern-based extraction
        if len(extracted_skills) < max_skills:
            pattern_skills = self._extract_skills_by_pattern(text, max_skills - len(extracted_skills))
            extracted_skills.extend(pattern_skills)
            logger.info(f"Extracted {len(pattern_skills)} skills via pattern matching")
        
        # Remove duplicates and sort by confidence
        unique_skills = self._deduplicate_skills(extracted_skills)
        unique_skills.sort(key=lambda x: x.confidence, reverse=True)
        
        return unique_skills[:max_skills]
    
    def _extract_skills_via_api(self, text: str, max_skills: int) -> List[Skill]:
        """Extract skills using Lightcast API"""
        try:
            headers = {
                'Authorization': f'Bearer {self.config.lightcast_api_key}',
                'Content-Type': 'application/json'
            }
            
            # Prepare request payload
            payload = {
                'text': text[:1000],  # Limit text length
                'max_skills': max_skills,
                'min_confidence': self.config.min_skill_confidence
            }
            
            response = requests.post(
                f"{self.config.lightcast_base_url}/skills/extract",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                skills = []
                
                for skill_data in data.get('skills', []):
                    skill = Skill(
                        name=skill_data.get('name', ''),
                        category=skill_data.get('category', 'unknown'),
                        confidence=skill_data.get('confidence', 0.0),
                        source='lightcast',
                        aliases=skill_data.get('aliases', [])
                    )
                    skills.append(skill)
                
                return skills
            else:
                logger.warning(f"Lightcast API returned status {response.status_code}")
                return []
                
        except Exception as e:
            logger.error(f"Error calling Lightcast API: {e}")
            return []
    
    def _extract_skills_locally(self, text: str, max_skills: int) -> List[Skill]:
        """Extract skills using local skills database"""
        text_lower = text.lower()
        extracted_skills = []
        
        for category, skills in self._local_skills.items():
            for skill in skills:
                if skill.lower() in text_lower:
                    # Calculate confidence based on frequency and context
                    confidence = self._calculate_local_skill_confidence(skill, text_lower)
                    
                    if confidence >= self.config.min_skill_confidence:
                        skill_obj = Skill(
                            name=skill,
                            category=category,
                            confidence=confidence,
                            source='local'
                        )
                        extracted_skills.append(skill_obj)
                        
                        if len(extracted_skills) >= max_skills:
                            break
            
            if len(extracted_skills) >= max_skills:
                break
        
        return extracted_skills
    
    def _extract_skills_by_pattern(self, text: str, max_skills: int) -> List[Skill]:
        """Extract skills using pattern matching"""
        patterns = [
            r'\b(?:proficient in|experience with|knowledge of|expertise in)\s+([^,\.]+)',
            r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:development|management|analysis|design|engineering)',
            r'\b(?:skills?|technologies?|tools?|frameworks?|languages?):\s*([^\.]+)',
            r'\b(?:Python|Java|JavaScript|SQL|R|MATLAB|C\+\+|C#|PHP|Ruby|Go|Swift|Kotlin)\b',
            r'\b(?:AWS|Azure|GCP|Docker|Kubernetes|Jenkins|Git|JIRA|Tableau|PowerBI)\b'
        ]
        
        extracted_skills = []
        text_lower = text.lower()
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if len(extracted_skills) >= max_skills:
                    break
                
                skill_name = match.strip()
                if len(skill_name) > 2 and skill_name not in [s.name for s in extracted_skills]:
                    confidence = self._calculate_pattern_skill_confidence(skill_name, text_lower)
                    
                    if confidence >= self.config.min_skill_confidence:
                        skill_obj = Skill(
                            name=skill_name,
                            category='extracted',
                            confidence=confidence,
                            source='pattern'
                        )
                        extracted_skills.append(skill_obj)
        
        return extracted_skills
    
    def _calculate_local_skill_confidence(self, skill: str, text: str) -> float:
        """Calculate confidence for locally matched skills"""
        skill_lower = skill.lower()
        
        # Base confidence
        confidence = 0.5
        
        # Boost for exact matches
        if skill_lower in text:
            confidence += 0.3
        
        # Boost for word boundaries
        if re.search(rf'\b{re.escape(skill_lower)}\b', text):
            confidence += 0.2
        
        # Boost for frequency
        frequency = text.count(skill_lower)
        if frequency > 1:
            confidence += min(0.1 * frequency, 0.2)
        
        return min(confidence, 1.0)
    
    def _calculate_pattern_skill_confidence(self, skill: str, text: str) -> float:
        """Calculate confidence for pattern-matched skills"""
        skill_lower = skill.lower()
        
        # Base confidence
        confidence = 0.4
        
        # Boost for technical terms
        technical_indicators = ['development', 'programming', 'analysis', 'design', 'engineering']
        if any(indicator in skill_lower for indicator in technical_indicators):
            confidence += 0.2
        
        # Boost for frequency
        frequency = text.count(skill_lower)
        if frequency > 0:
            confidence += min(0.1 * frequency, 0.3)
        
        return min(confidence, 1.0)
    
    def _deduplicate_skills(self, skills: List[Skill]) -> List[Skill]:
        """Remove duplicate skills, keeping highest confidence"""
        skill_dict = {}
        
        for skill in skills:
            skill_key = skill.name.lower().strip()
            
            if skill_key not in skill_dict or skill.confidence > skill_dict[skill_key].confidence:
                skill_dict[skill_key] = skill
        
        return list(skill_dict.values())
    
    def create_skills_vector(self, skills: List[Skill]) -> np.ndarray:
        """Create a skills vector for similarity comparison"""
        if not skills:
            return np.array([])
        
        # Create a combined text representation
        skill_texts = []
        for skill in skills:
            # Include skill name and aliases
            skill_text = skill.name
            if skill.aliases:
                skill_text += " " + " ".join(skill.aliases)
            skill_texts.append(skill_text)
        
        # Combine all skill texts
        combined_text = " ".join(skill_texts)
        
        # Create TF-IDF vector
        if self._vectorizer is None:
            self._vectorizer = TfidfVectorizer(
                max_features=1000,
                stop_words='english',
                ngram_range=(1, 2),
                min_df=1
            )
            # Fit on the combined text
            self._vectorizer.fit([combined_text])
        
        # Transform to vector
        vector = self._vectorizer.transform([combined_text])
        return vector.toarray().flatten()
    
    def calculate_skills_similarity(self, skills1: List[Skill], skills2: List[Skill]) -> float:
        """Calculate similarity between two sets of skills"""
        if not skills1 or not skills2:
            return 0.0
        
        # Create skills vectors
        vector1 = self.create_skills_vector(skills1)
        vector2 = self.create_skills_vector(skills2)
        
        if len(vector1) == 0 or len(vector2) == 0:
            return 0.0
        
        # Calculate cosine similarity
        similarity = cosine_similarity([vector1], [vector2])[0][0]
        
        # Boost similarity based on overlapping skill names
        overlap_boost = self._calculate_skill_overlap_boost(skills1, skills2)
        
        # Combine similarity scores
        final_similarity = (similarity + overlap_boost) / 2
        
        return max(0.0, min(1.0, final_similarity))
    
    def _calculate_skill_overlap_boost(self, skills1: List[Skill], skills2: List[Skill]) -> float:
        """Calculate boost based on exact skill name matches"""
        names1 = {skill.name.lower().strip() for skill in skills1}
        names2 = {skill.name.lower().strip() for skill in skills2}
        
        if not names1 or not names2:
            return 0.0
        
        intersection = names1.intersection(names2)
        union = names1.union(names2)
        
        # Jaccard similarity
        jaccard = len(intersection) / len(union) if union else 0.0
        
        # Boost for high-confidence matches
        confidence_boost = 0.0
        for skill1 in skills1:
            for skill2 in skills2:
                if skill1.name.lower().strip() == skill2.name.lower().strip():
                    confidence_boost += (skill1.confidence + skill2.confidence) / 2
        
        confidence_boost = min(confidence_boost / max(len(skills1), len(skills2)), 0.3)
        
        return jaccard + confidence_boost
    
    def get_skills_summary(self, skills: List[Skill]) -> Dict:
        """Get summary statistics for a set of skills"""
        if not skills:
            return {}
        
        categories = {}
        sources = {}
        confidence_scores = []
        
        for skill in skills:
            # Count by category
            categories[skill.category] = categories.get(skill.category, 0) + 1
            
            # Count by source
            sources[skill.source] = sources.get(skill.source, 0) + 1
            
            # Collect confidence scores
            confidence_scores.append(skill.confidence)
        
        return {
            'total_skills': len(skills),
            'categories': categories,
            'sources': sources,
            'avg_confidence': np.mean(confidence_scores) if confidence_scores else 0.0,
            'min_confidence': min(confidence_scores) if confidence_scores else 0.0,
            'max_confidence': max(confidence_scores) if confidence_scores else 0.0
        }
    
    def clear_cache(self):
        """Clear skills cache"""
        self._skills_cache.clear()
        logger.info("Skills cache cleared")
