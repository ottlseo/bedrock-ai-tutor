import requests
import json

url = "http://127.0.0.1:8080/test"

headers = {
    "Content-Type": "application/json"
}

request = {
    "prompt": "What is your name?"
} 
data = json.dumps(request)
response = requests.post(
    url, 
    headers=headers, 
    data=data
    )

print("response: ", response)
print("response.text: ", response.text)