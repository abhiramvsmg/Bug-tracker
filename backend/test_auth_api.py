import urllib.request
import urllib.parse
import json

def test_login():
    url = "http://localhost:8000/auth/login"
    data = urllib.parse.urlencode({
        "username": "abhiram@gmail.com",
        "password": "password123"
    }).encode("utf-8")
    
    req = urllib.request.Request(url, data=data)
    print("Testing login with URL-encoded form data...")
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Status: {response.getcode()}")
            print(f"Response: {response.read().decode()}")
    except Exception as e:
        print(f"Failed: {e}")
        if hasattr(e, 'read'):
            print(f"Error body: {e.read().decode()}")

def test_register():
    url = "http://localhost:8000/auth/register"
    data = json.dumps({
        "email": f"test_reg_{import_os().urandom(2).hex()}@example.com",
        "password": "password123",
        "full_name": "Test User"
    }).encode("utf-8")
    
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    print("\nTesting registration with JSON...")
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Status: {response.getcode()}")
            print(f"Response: {response.read().decode()}")
    except Exception as e:
        print(f"Failed: {e}")
        if hasattr(e, 'read'):
            print(f"Error body: {e.read().decode()}")

def import_os():
    import os
    return os

if __name__ == "__main__":
    test_login()
    test_register()
