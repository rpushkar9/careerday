#!/usr/bin/env python3
"""
Clean API Runner for CareerMatch
Captures all output and only returns JSON to stdout
"""

import sys
import json
import io
import contextlib
from pathlib import Path

# Add the engines directory to Python path
engines_dir = Path(__file__).parent / "engines"
sys.path.append(str(engines_dir))

def main():
    """Main entry point that captures all output and only returns JSON"""
    try:
        # Debug: Write to stderr to see what's happening
        sys.stderr.write("Starting API runner...\n")
        
        # Create string buffers to capture all output
        stdout_buffer = io.StringIO()
        stderr_buffer = io.StringIO()
        
        # Capture all output using context managers
        with contextlib.redirect_stdout(stdout_buffer), contextlib.redirect_stderr(stderr_buffer):
            # Import and run the actual API wrapper
            sys.stderr.write("Importing CareerAPIWrapper...\n")
            from api_wrapper import CareerAPIWrapper
            
            # Read input from stdin
            sys.stderr.write("Reading stdin...\n")
            input_data = sys.stdin.read()
            sys.stderr.write(f"Input data: {input_data}\n")
            request_data = json.loads(input_data)
            
            # Initialize wrapper
            sys.stderr.write("Initializing wrapper...\n")
            wrapper = CareerAPIWrapper()
            
            # Get recommendations
            sys.stderr.write("Getting recommendations...\n")
            recommendations = wrapper.get_career_recommendations(
                major=request_data.get('major', ''),
                cip_code=request_data.get('cip_code', ''),
                interests=request_data.get('interests', []),
                skills=request_data.get('skills', []),
                university=request_data.get('university', ''),
                top_n=request_data.get('top_n', 3)
            )
            
            sys.stderr.write(f"Got {len(recommendations)} recommendations\n")
        
        # Now return only the JSON response to stdout
        json.dump(recommendations, sys.stdout)
        
    except Exception as e:
        # Return error as JSON with more details
        import traceback
        sys.stderr.write(f"Error: {e}\n")
        sys.stderr.write(f"Traceback: {traceback.format_exc()}\n")
        error_response = {
            "error": "Failed to generate career recommendations",
            "details": str(e),
            "traceback": traceback.format_exc()
        }
        json.dump(error_response, sys.stdout)

if __name__ == "__main__":
    main()
