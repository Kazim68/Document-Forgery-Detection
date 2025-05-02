import requests

for i in range(10):
    response = requests.post("https://shy-kathy-kazim68-5d662330.koyeb.app/api/auth/login", json={
        "email": f"abdurrehmankazim68@gmail.com",
        "password": "test123"
    })
    print(i, response)
