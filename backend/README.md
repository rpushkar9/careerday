# CareerMatch Backend

This directory contains the migrated Python backend engines from the original CareerMatch project.

## Structure

- `data/` - Core data files (CSV datasets)
- `engines/` - Core recommendation and scoring engines

## Core Engines

- `recommendation_engine.py` - Main career recommendation logic
- `scoring_engine.py` - Career scoring and ranking algorithms
- `skills_engine.py` - Skills matching and analysis
- `cip_mapper.py` - CIP code mapping utilities
- `data_manager.py` - Data loading and management

## Dependencies

Install Python dependencies:

```bash
pip install -r requirements.txt
```

## Data Files

- SOC Definitions, CIP Codes, Employment Projections
- OEWS salary and growth data
- Crosswalk mappings between different classification systems

## Integration

These engines are designed to be called from Next.js API routes to provide career recommendations to the frontend.

