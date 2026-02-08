import requests

url = "http://localhost:8000/auth/login"
data = {
    "username": "abhiram@gmail.com",
    "password": "password123"
}

print("Testing with application/x-www-form-urlencoded...")
response = requests.post(url, data=data)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")

print("\nTesting with multipart/form-data...")
files = {
    "username": (None, "abhiram@gmail.com"),
    "password": (None, "password123")
}
response = requests.post(url, files=files)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")
