#!/usr/bin/env python3
"""
Test script for helmet detection backend
"""

import requests
import json
import base64
from PIL import Image
import io

def test_backend():
    """Test the helmet detection backend"""
    
    # Test health endpoint
    try:
        response = requests.get('http://localhost:5001/health')
        print(f"Health check: {response.status_code}")
        if response.status_code == 200:
            print("✅ Backend is running!")
        else:
            print("❌ Backend not responding")
            return
    except Exception as e:
        print(f"❌ Backend connection failed: {e}")
        return
    
    # Create a test image
    try:
        # Create a simple test image
        img = Image.new('RGB', (300, 200), color='blue')
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG')
        img_data = base64.b64encode(buffer.getvalue()).decode()
        
        # Test helmet detection
        test_data = {
            'image': f'data:image/jpeg;base64,{img_data}',
            'location': {'latitude': 12.9716, 'longitude': 77.5946}
        }
        
        response = requests.post('http://localhost:5001/detect/helmet', 
                               json=test_data,
                               headers={'Content-Type': 'application/json'})
        
        print(f"Helmet detection test: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print("✅ Helmet detection working!")
            print(f"Result: {json.dumps(result, indent=2)}")
        else:
            print(f"❌ Helmet detection failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    test_backend()
