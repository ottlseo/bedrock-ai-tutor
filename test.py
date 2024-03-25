import requests
import json

url = "http://127.0.0.1:8080/test"

headers = {
    "Content-Type": "application/json"
}

request = {
    "name": "yoonseo",
    "age": 25
} 
data = json.dumps(request)
response = requests.post(
    url, 
    headers=headers, 
    data=data
    )

print("response: ", response)
print("response.text: ", response.text)