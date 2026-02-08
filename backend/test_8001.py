import urllib.request
import urllib.parse
import json

def test_login():
    url = "http://localhost:8001/auth/login"
    data = urllib.parse.urlencode({
        "username": "abhiram@gmail.com",
        "password": "password123"
    }).encode("utf-8")
    
    req = urllib.request.Request(url, data=data)
    print(f"Testing login on 8001 with {url}...")
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Status: {response.getcode()}")
            print(f"Response: {response.read().decode()}")
    except Exception as e:
        print(f"Failed: {e}")
        if hasattr(e, 'read'):
            print(f"Error body: {e.read().decode()}")

if __name__ == "__main__":
    test_login()
