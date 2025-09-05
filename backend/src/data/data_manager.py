"""
Data Manager for Career Recommendation System

Handles loading, validation, and caching of all CSV datasets including:
- CIP codes and descriptions
- SOC occupation definitions
- CIP-SOC crosswalk mappings
- Employment projections
- OEWS wage and employment data
"""

import pandas as pd
import numpy as np
from pathlib import Path
from typing import Dict, Optional, Tuple, List
import logging
from dataclasses import dataclass
import warnings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class DataConfig:
    """Configuration for data loading and processing"""
    data_dir: str = "data"
    cache_enabled: bool = True
    max_memory_usage: str = "1GB"
    chunk_size: int = 10000

class DataManager:
    """Manages all data loading, validation, and caching operations"""
    
    def __init__(self, config: DataConfig = None):
        self.config = config or DataConfig()
        self.data_dir = Path(self.config.data_dir)
        self._cache = {}
        self._loaded = False
        
        # Validate data directory exists
        if not self.data_dir.exists():
            raise FileNotFoundError(f"Data directory not found: {self.data_dir}")
    
    def load_all_data(self) -> bool:
        """Load all datasets into memory/cache"""
        try:
            logger.info("Starting data loading process...")
            
            # Load core datasets
            self._load_cip_data()
            self._load_soc_data()
            self._load_crosswalk_data()
            self._load_employment_projections()
            self._load_oews_data()
            
            self._loaded = True
            logger.info("All data loaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error loading data: {e}")
            return False
    
    def _load_cip_data(self):
        """Load CIP codes and descriptions"""
        logger.info("Loading CIP data...")
        cip_file = self.data_dir / "CIPCode2020.csv"
        
        if not cip_file.exists():
            raise FileNotFoundError(f"CIP file not found: {cip_file}")
        
        # Load with optimized settings for large file
        self._cache['cip'] = pd.read_csv(
            cip_file,
            dtype={
                'CIPFamily': 'category',
                'CIPCode': 'string',
                'Action': 'category',
                'TextChange': 'category',
                'CIPTitle': 'string',
                'CIPDefinition': 'string'
            },
            usecols=['CIPCode', 'CIPTitle', 'CIPDefinition'],
            na_values=['', 'nan', 'NaN']
        )
        
        # Clean and validate
        self._cache['cip'] = self._cache['cip'].dropna(subset=['CIPCode', 'CIPTitle'])
        self._cache['cip']['CIPCode'] = self._cache['cip']['CIPCode'].astype(str).str.strip()
        
        logger.info(f"Loaded {len(self._cache['cip'])} CIP codes")
    
    def _load_soc_data(self):
        """Load SOC occupation definitions"""
        logger.info("Loading SOC data...")
        soc_file = self.data_dir / "2018 SOC Definitions.csv"
        
        if not soc_file.exists():
            raise FileNotFoundError(f"SOC file not found: {soc_file}")
        
        self._cache['soc'] = pd.read_csv(
            soc_file,
            dtype={
                'SOC Group': 'category',
                'SOC Code': 'string',
                'SOC Title': 'string',
                'SOC Definition': 'string'
            },
            na_values=['', 'nan', 'NaN']
        )
        
        # Clean and validate
        self._cache['soc'] = self._cache['soc'].dropna(subset=['SOC Code', 'SOC Title'])
        self._cache['soc']['SOC Code'] = self._cache['soc']['SOC Code'].astype(str).str.strip()
        
        logger.info(f"Loaded {len(self._cache['soc'])} SOC definitions")
    
    def _load_crosswalk_data(self):
        """Load CIP-SOC crosswalk mappings"""
        logger.info("Loading crosswalk data...")
        crosswalk_file = self.data_dir / "CIP2020_SOC2018_Crosswalk.csv"
        
        if not crosswalk_file.exists():
            raise FileNotFoundError(f"Crosswalk file not found: {crosswalk_file}")
        
        # Load the real crosswalk data
        self._cache['crosswalk'] = pd.read_csv(crosswalk_file)
        
        # Clean and validate
        self._cache['crosswalk'] = self._cache['crosswalk'].dropna(subset=['CIP2020Code', 'SOC2018Code'])
        
        logger.info(f"Loaded {len(self._cache['crosswalk'])} crosswalk mappings")
    
    def _load_employment_projections(self):
        """Load employment projections data"""
        logger.info("Loading employment projections...")
        proj_file = self.data_dir / "Employment Projections.csv"
        
        if not proj_file.exists():
            raise FileNotFoundError(f"Employment projections file not found: {proj_file}")
        
        self._cache['projections'] = pd.read_csv(
            proj_file,
            dtype={
                'Occupation Title': 'string',
                'Occupation Code': 'string',
                'Employment 2023': 'string',
                'Employment 2033': 'string',
                'Employment Change, 2023-2033': 'string',
                'Employment Percent Change, 2023-2033': 'string',
                'Occupational Openings, 2023-2033 Annual Average': 'string',
                'Median Annual Wage 2024': 'string',
                'Typical Entry-Level Education': 'string',
                'Education Code': 'string'
            }
        )
        
        # Clean and convert numeric columns
        numeric_cols = ['Employment 2023', 'Employment 2033', 'Employment Change, 2023-2033', 
                       'Employment Percent Change, 2023-2033', 'Occupational Openings, 2023-2033 Annual Average']
        
        for col in numeric_cols:
            self._cache['projections'][col] = pd.to_numeric(
                self._cache['projections'][col].str.replace(',', '').str.replace('*', ''),
                errors='coerce'
            )
        
        # Clean occupation codes (remove quotes and equals signs)
        self._cache['projections']['Occupation Code'] = (
            self._cache['projections']['Occupation Code']
            .str.replace('="', '')
            .str.replace('"', '')
            .str.strip()
        )
        
        logger.info(f"Loaded {len(self._cache['projections'])} employment projections")
    
    def _load_oews_data(self):
        """Load OEWS wage and employment data (streaming for large file)"""
        logger.info("Loading OEWS data...")
        oews_file = self.data_dir / "OEWS2023.csv"
        
        if not oews_file.exists():
            raise FileNotFoundError(f"OEWS file not found: {oews_file}")
        
        # For large file, we'll load in chunks and process key columns
        # Focus on national data (area_type = 1) and detailed occupations
        chunk_list = []
        
        for chunk in pd.read_csv(
            oews_file,
            chunksize=self.config.chunk_size,
            dtype={
                'AREA': 'string',
                'AREA_TYPE': 'string',  # Read as string first, convert later
                'NAICS': 'string',
                'OCC_CODE': 'string',
                'O_GROUP': 'string',
                'TOT_EMP': 'string',  # Read as string first, convert later
                'A_MEDIAN': 'string',  # Read as string first, convert later
                'H_MEDIAN': 'string'   # Read as string first, convert later
            },
            usecols=['AREA', 'AREA_TYPE', 'NAICS', 'OCC_CODE', 'O_GROUP', 'TOT_EMP', 'A_MEDIAN', 'H_MEDIAN']
        ):
            # Clean and convert numeric columns
            national_chunk = chunk[
                (chunk['AREA_TYPE'] == '1') & 
                (chunk['O_GROUP'] == 'detailed') &
                (chunk['OCC_CODE'].notna())
            ]
            
            if not national_chunk.empty:
                # Convert numeric columns safely
                try:
                    # Create a copy to avoid SettingWithCopyWarning
                    processed_chunk = national_chunk.copy()
                    processed_chunk['AREA_TYPE'] = pd.to_numeric(processed_chunk['AREA_TYPE'], errors='coerce')
                    processed_chunk['TOT_EMP'] = pd.to_numeric(processed_chunk['TOT_EMP'], errors='coerce')
                    processed_chunk['A_MEDIAN'] = pd.to_numeric(processed_chunk['A_MEDIAN'], errors='coerce')
                    processed_chunk['H_MEDIAN'] = pd.to_numeric(processed_chunk['H_MEDIAN'], errors='coerce')
                    
                    # Remove rows with invalid numeric data
                    processed_chunk = processed_chunk.dropna(subset=['TOT_EMP', 'A_MEDIAN'])
                    
                    if not processed_chunk.empty:
                        chunk_list.append(processed_chunk)
                except Exception as e:
                    logger.warning(f"Error processing chunk: {e}")
                    continue
        
        if chunk_list:
            self._cache['oews'] = pd.concat(chunk_list, ignore_index=True)
            logger.info(f"Loaded {len(self._cache['oews'])} OEWS records")
        else:
            logger.warning("No OEWS data loaded")
            self._cache['oews'] = pd.DataFrame()
    
    def get_cip_data(self) -> pd.DataFrame:
        """Get CIP codes and descriptions"""
        if not self._loaded:
            raise RuntimeError("Data not loaded. Call load_all_data() first.")
        return self._cache['cip'].copy()
    
    def get_soc_data(self) -> pd.DataFrame:
        """Get SOC occupation definitions"""
        if not self._loaded:
            raise RuntimeError("Data not loaded. Call load_all_data() first.")
        return self._cache['soc'].copy()
    
    def get_employment_projections(self) -> pd.DataFrame:
        """Get employment projections data"""
        if not self._loaded:
            raise RuntimeError("Data not loaded. Call load_all_data() first.")
        return self._cache['projections'].copy()
    
    def get_oews_data(self) -> pd.DataFrame:
        """Get OEWS wage and employment data"""
        if not self._loaded:
            raise RuntimeError("Data not loaded. Call load_all_data() first.")
        return self._cache['oews'].copy()
    
    def get_crosswalk_data(self) -> pd.DataFrame:
        """Get CIP-SOC crosswalk mappings"""
        if not self._loaded:
            raise RuntimeError("Data not loaded. Call load_all_data() first.")
        return self._cache['crosswalk'].copy()
    
    def validate_data_integrity(self) -> Dict[str, bool]:
        """Validate the integrity of loaded data"""
        validation_results = {}
        
        try:
            # Check CIP data
            cip_data = self.get_cip_data()
            validation_results['cip'] = (
                len(cip_data) > 0 and 
                cip_data['CIPCode'].is_unique and
                cip_data['CIPTitle'].notna().all()
            )
            
            # Check SOC data
            soc_data = self.get_soc_data()
            validation_results['soc'] = (
                len(soc_data) > 0 and
                soc_data['SOC Code'].is_unique and
                soc_data['SOC Title'].notna().all()
            )
            
            # Check employment projections
            proj_data = self.get_employment_projections()
            validation_results['projections'] = (
                len(proj_data) > 0 and
                proj_data['Occupation Code'].notna().all()
            )
            
            # Check OEWS data
            oews_data = self.get_oews_data()
            validation_results['oews'] = (
                len(oews_data) > 0 and
                oews_data['OCC_CODE'].notna().all()
            )
            
        except Exception as e:
            logger.error(f"Data validation error: {e}")
            validation_results['error'] = False
        
        return validation_results
    
    def get_data_summary(self) -> Dict[str, dict]:
        """Get summary statistics for all datasets"""
        if not self._loaded:
            raise RuntimeError("Data not loaded. Call load_all_data() first.")
        
        summary = {}
        
        for dataset_name, data in self._cache.items():
            if isinstance(data, pd.DataFrame):
                summary[dataset_name] = {
                    'rows': len(data),
                    'columns': len(data.columns),
                    'memory_usage_mb': data.memory_usage(deep=True).sum() / 1024 / 1024,
                    'columns': list(data.columns)
                }
        
        return summary
    
    def clear_cache(self):
        """Clear all cached data"""
        self._cache.clear()
        self._loaded = False
        logger.info("Cache cleared")
