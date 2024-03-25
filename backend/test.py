import requests
import json

url = "http://127.0.0.1:8080/test"

print("Question to AI tutor: ")
input_sentence = input()

headers = {
    "Content-Type": "application/json"
}

request = {
    "prompt": input_sentence
} 
data = json.dumps(request)
response = requests.post(
    url, 
    headers=headers, 
    data=data
    )

print("response: ", response)
print("response.text: ", response.text)