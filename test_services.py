#!/usr/bin/env python3
"""
🚨 SnapNEarn Services Test
Quick test to verify all services are working
"""

import sys
import os

def test_imports():
    """Test if all required packages are available"""
    print("🔍 Testing Python imports...")
    
    try:
        import flask
        print("✅ Flask imported successfully")
    except ImportError as e:
        print(f"❌ Flask import failed: {e}")
        return False
    
    try:
        import flask_cors
        print("✅ Flask-CORS imported successfully")
    except ImportError as e:
        print(f"❌ Flask-CORS import failed: {e}")
        return False
    
    try:
        import cv2
        print("✅ OpenCV imported successfully")
    except ImportError as e:
        print(f"❌ OpenCV import failed: {e}")
        return False
    
    try:
        import numpy
        print("✅ NumPy imported successfully")
    except ImportError as e:
        print(f"❌ NumPy import failed: {e}")
        return False
    
    try:
        import requests
        print("✅ Requests imported successfully")
    except ImportError as e:
        print(f"❌ Requests import failed: {e}")
        return False
    
    return True

def test_flask_server():
    """Test basic Flask server"""
    print("\n🚀 Testing Flask server...")
    
    try:
        from flask import Flask, jsonify
        from flask_cors import CORS
        
        app = Flask(__name__)
        CORS(app)
        
        @app.route('/health')
        def health():
            return jsonify({
                'status': 'healthy',
                'service': 'SnapNEarn Backend',
                'version': '1.0.0'
            })
        
        @app.route('/test')
        def test():
            return jsonify({
                'message': 'SnapNEarn backend is working!',
                'features': [
                    'Helmet Detection',
                    'Video Analysis', 
                    'Number Plate Recognition',
                    'Multi-violation Detection'
                ]
            })
        
        print("✅ Flask server configured successfully")
        print("🌐 Starting server on http://localhost:5001")
        
        app.run(host='0.0.0.0', port=5001, debug=True)
        
    except Exception as e:
        print(f"❌ Flask server failed: {e}")
        return False

def main():
    """Main test function"""
    print("🚨 SnapNEarn Services Test")
    print("=" * 50)
    
    # Test imports
    if not test_imports():
        print("\n❌ Import tests failed. Please install missing packages.")
        sys.exit(1)
    
    print("\n✅ All imports successful!")
    
    # Test Flask server
    test_flask_server()

if __name__ == "__main__":
    main()
