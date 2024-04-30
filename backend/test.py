import requests
import json

url = "http://13.124.14.197:8081/business"

print("Question to AI tutor: ")
input_sentence = input()

request = json.dumps({
    "prompt": input_sentence
})

response = requests.post(
    url, 
    headers={ "Content-Type": "application/json" }, 
    data=request
    )

print("response: ", response)
print("response.text: ", response.text)
