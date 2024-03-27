import requests
import json

#url = "http://ec2-52-91-164-61.compute-1.amazonaws.com:8080/test" # "http://172.31.82.232:8080/test" # "http://52.91.164.61:8080/test"
url = "http://3.84.24.30:8080/test"
#url = "http://127.0.0.1:8080/test"

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
