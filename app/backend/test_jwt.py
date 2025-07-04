#!/usr/bin/env python3
"""
Simple JWT test script to verify token generation and validation
"""

import requests
import json
import uuid

BASE_URL = "http://localhost:5000"

def test_jwt_flow():
    """Test the complete JWT flow"""
    print("🧪 Testing JWT Authentication Flow")
    print("=" * 50)
    
    # Generate unique username
    unique_id = str(uuid.uuid4())[:8]
    username = f"testuser_{unique_id}"
    email = f"test_{unique_id}@example.com"
    
    # 1. Test signup
    print(f"\n1. Testing signup with username: {username}...")
    signup_data = {
        "username": username,
        "email": email,
        "password": "password123"
    }
    
    try:
        signup_response = requests.post(f"{BASE_URL}/api/signup", json=signup_data)
        print(f"Signup Status: {signup_response.status_code}")
        print(f"Signup Response: {signup_response.json()}")
    except Exception as e:
        print(f"Signup Error: {e}")
        return
    
    # 2. Test login
    print(f"\n2. Testing login with username: {username}...")
    login_data = {
        "username": username,
        "password": "password123"
    }
    
    try:
        login_response = requests.post(f"{BASE_URL}/api/login", json=login_data)
        print(f"Login Status: {login_response.status_code}")
        print(f"Login Response: {login_response.json()}")
        
        if login_response.status_code == 200:
            token = login_response.json().get('token')
            if token:
                print(f"✅ Token received: {token[:50]}...")
            else:
                print("❌ No token in response")
                return
        else:
            print("❌ Login failed")
            return
            
    except Exception as e:
        print(f"Login Error: {e}")
        return
    
    # 3. Test profile access with token
    print("\n3. Testing profile access...")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        profile_response = requests.get(f"{BASE_URL}/api/profile", headers=headers)
        print(f"Profile Status: {profile_response.status_code}")
        print(f"Profile Response: {profile_response.json()}")
        
        if profile_response.status_code == 200:
            print("✅ Profile access successful!")
        else:
            print("❌ Profile access failed")
            
    except Exception as e:
        print(f"Profile Error: {e}")
    
    # 4. Test profile update
    print("\n4. Testing profile update...")
    update_data = {
        "name": "John Doe",
        "bio": "Test bio",
        "location": "Test City",
        "title": "Software Engineer",
        "skills": ["Python", "Flask", "React"]
    }
    
    try:
        update_response = requests.put(f"{BASE_URL}/api/profile", json=update_data, headers=headers)
        print(f"Update Status: {update_response.status_code}")
        print(f"Update Response: {update_response.json()}")
        
        if update_response.status_code == 200:
            print("✅ Profile update successful!")
        else:
            print("❌ Profile update failed")
            
    except Exception as e:
        print(f"Update Error: {e}")
    
    # 5. Test without token
    print("\n5. Testing access without token...")
    try:
        no_token_response = requests.get(f"{BASE_URL}/api/profile")
        print(f"No Token Status: {no_token_response.status_code}")
        print(f"No Token Response: {no_token_response.json()}")
        
        if no_token_response.status_code == 401:
            print("✅ Properly rejected request without token")
        else:
            print("❌ Should have rejected request without token")
            
    except Exception as e:
        print(f"No Token Error: {e}")

if __name__ == "__main__":
    test_jwt_flow() 