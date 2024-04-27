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
        additional_prompt = "and make it suitable for business conversation"
    elif option == CASUAL:
        assigning_role_prompt = "You are an English teacher who corrects students' English sentences to be comfortable and natural for everyday casual conversations. "
        additional_prompt = "and make it natural and suitable for casual conversation"
    else: 
        assigning_role_prompt = "You are an English teacher who corrects students' English sentences to be grammatically correct. "
        additional_prompt = ""
        
    return assigning_role_prompt + """
        If the English sentence I send you has a grammatical error, correct the grammar {} and return the corrected sentence enclosed in <corrected> XML tags. 
        If the English sentence I send is not erroneous, rephrase it into a better (more natural) sentence with the same meaning and return it enclosed in <orig> XML tags. 
        Always just send the corrected sentence without any additional explanation.
        """.format(additional_prompt)

def generate_prompt(sentence, option=None):
    system_prompt = generate_system_prompt(option=option)
    return "System: "+ system_prompt + "\n\nHuman: "+ sentence +"\n\nAssistant: "

@app.route("/haiku", methods=['POST'])
def haiku():

    data = request.get_json()
    prompt = generate_prompt(data["prompt"])

    body = json.dumps({
        "max_tokens": 2000,
        "messages": [{"role": "user", "content": prompt}],
        "anthropic_version": "bedrock-2023-05-31"
    })
    modelId = HAIKU
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
            print(error.response['Error']['Message'])
        else:
            raise error

@app.route("/sonnet", methods=['POST'])
def sonnet():

    data = request.get_json()
    prompt = generate_prompt(data["prompt"])

    body = json.dumps({
        "max_tokens": 2000,
        "messages": [{"role": "user", "content": prompt}],
        "anthropic_version": "bedrock-2023-05-31"
    })
    modelId = SONNET
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
            print(error.response['Error']['Message'])
        else:
            raise error

@app.route("/claude_v2", methods=['POST'])
def claude_v2():
    client = boto3.client("bedrock-runtime", region_name="us-east-1")
    
    data = request.get_json()
    prompt = data["prompt"]
    #completion = generate_correction(client, prompt)
    
    body = json.dumps(
        {
            "prompt": generate_prompt(prompt),
            "max_tokens_to_sample": 200,
        }
    ).encode()
    
    response = client.invoke_model(
        body=body,
        modelId="anthropic.claude-v2",
        accept="application/json",
        contentType="application/json",
    )
    
    response_body = json.loads(response["body"].read())
    completion = response_body["completion"].strip()

    response = jsonify({
        "result": completion
    })
    response.headers["Access-Control-Allow-Origin"] = "*" # fix CORS error
    
    return response

@app.route("/business", methods=['POST'])
def business():
    client = boto3.client("bedrock-runtime", region_name="us-east-1")
    
    data = request.get_json()
    input_sentence = data["prompt"]
    body = json.dumps(
        {
            "prompt": generate_prompt(input_sentence, option=BUSINESS),
            "max_tokens_to_sample": 200,
        }
    ).encode()
    
    response = client.invoke_model(
        body=body,
        modelId="anthropic.claude-v2",
        accept="application/json",
        contentType="application/json",
    )
    
    response_body = json.loads(response["body"].read())
    completion = response_body["completion"].strip()

    response = jsonify({
        "result": completion
    })
    response.headers["Access-Control-Allow-Origin"] = "*" # fix CORS error
    
    return response

@app.route("/casual", methods=['POST'])
def casual():
    client = boto3.client("bedrock-runtime", region_name="us-east-1")
    
    data = request.get_json()
    input_sentence = data["prompt"]
    body = json.dumps(
        {
            "prompt": generate_prompt(input_sentence, option=CASUAL),
            "max_tokens_to_sample": 200,
        }
    ).encode()
    
    response = client.invoke_model(
        body=body,
        modelId="anthropic.claude-v2",
        accept="application/json",
        contentType="application/json",
    )
    
    response_body = json.loads(response["body"].read())
    completion = response_body["completion"].strip()

    response = jsonify({
        "result": completion
    })
    response.headers["Access-Control-Allow-Origin"] = "*" # fix CORS error
    
    return response

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8081)
