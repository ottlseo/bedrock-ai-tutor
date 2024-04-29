from flask import Flask, request, json, jsonify
import boto3
import botocore
import logging
from flask_cors import CORS
# from bedrock import generate_correction

app = Flask(__name__)
CORS(app)

BUSINESS = 'business'
CASUAL = 'casual'

HAIKU = "anthropic.claude-3-haiku-20240307-v1:0" 
SONNET = "anthropic.claude-3-sonnet-20240229-v1:0"

def generate_system_prompt(option=None):
    if option == BUSINESS:
        assigning_role_prompt = "You are an English teacher who corrects students' English sentences to be suitable for business conversations. "
        additional_prompt = "or is not suitable for business conversation"
    elif option == CASUAL:
        assigning_role_prompt = "You are an English teacher who corrects students' English sentences to be comfortable and natural for everyday casual conversations. "
        additional_prompt = "or is not natural for casual conversation"
    else: 
        assigning_role_prompt = "You are an English teacher who corrects students' English sentences to be grammatically correct. "
        additional_prompt = ""

    return assigning_role_prompt + """
        If the English sentence I send you has a grammatical error {}, please correct it grammatically and also suitable for a {} conversation and return the corrected sentence.
        If the English sentence I send is not erroneous, just rephrase it that could be more natural into a better form if needed, and return the corrected sentence.
        Please always return the output sentence only, without providing any additional explanations.
        """.format(additional_prompt, option)

def generate_prompt(sentence, option=None):
    system_prompt = generate_system_prompt(option=option)
    return "System: "+ system_prompt + "\n\nHuman: "+ sentence +"\n\nAssistant: "

def call_claude_v3(prompt, model=HAIKU):
    body = json.dumps({
        "max_tokens": 2000,
        "messages": [{"role": "user", "content": prompt}],
        "anthropic_version": "bedrock-2023-05-31"
    })
    modelId = model
    metadata = "application/json"

    try:
        client = boto3.client("bedrock-runtime", region_name="us-east-1")
        response = client.invoke_model(
            body=body, modelId=modelId, accept=metadata, contentType=metadata
        )
        response_body = json.loads(response.get("body").read())
        response = jsonify({
            "result": response_body
        })
        response.headers["Access-Control-Allow-Origin"] = "*" # fix CORS error
        return response
    
    except botocore.exceptions.ClientError as error:
        if error.response['Error']['Code'] == 'AccessDeniedException':
            return error.response['Error']['Message']
        else:
            raise error

@app.route("/haiku", methods=['POST'])
def haiku():
    data = request.get_json()
    response = call_claude_v3(
        model=HAIKU,
        prompt=generate_prompt(data["prompt"])
        )
    return response

@app.route("/sonnet", methods=['POST'])
def sonnet():
    data = request.get_json()
    response = call_claude_v3(
        model=SONNET,
        prompt=generate_prompt(data["prompt"])
        )
    return response

@app.route("/business", methods=['POST'])
def business():
    data = request.get_json()
    response = call_claude_v3(
        model=SONNET,
        prompt=generate_prompt(data["prompt"], option=BUSINESS)
        )
    return response

@app.route("/casual", methods=['POST'])
def casual():
    data = request.get_json()
    response = call_claude_v3(
        model=SONNET,
        prompt=generate_prompt(data["prompt"], option=CASUAL)
        )
    return response

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8081)
