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

system_prompt_1 = "System: Please correct the given sentence grammatically" 
system_prompt_2 = ". Provide the corrected sentence in <corrected> XML tags without any explanation."
system_prompt_business = "and make it suitable for business conversation"
system_prompt_casual = "and make it natural and suitable for casual conversation"

def generate_prompt(sentence, option=None):
    system_prompt = system_prompt_1
    if option == BUSINESS:
        system_prompt += system_prompt_business
    elif option == CASUAL:
        system_prompt += system_prompt_casual
    else: 
        pass
    system_prompt += system_prompt_2
    
    return system_prompt+ "\n\nHuman: "+ sentence +"\n\nAssistant: <corrected>"

@app.route("/haiku", methods=['POST'])
def haiku():

    data = request.get_json()
    prompt = generate_prompt(data["prompt"])

    body = json.dumps({
        "max_tokens": 2000,
        "messages": [{"role": "user", "content": prompt}],
        "anthropic_version": "bedrock-2023-05-31"
    })
    modelId = "anthropic.claude-3-haiku-20240307-v1:0" #"anthropic.claude-3-sonnet-20240229-v1:0"
    metadata = "application/json"

    try:
        client = boto3.client("bedrock-runtime", region_name="us-east-1")
    
        response = client.invoke_model(
            body=body, modelId=modelId, accept=metadata, contentType=metadata
        )
        response_body = json.loads(response.get("body").read())
        completion = response_body["completion"].strip()
        response = jsonify({
            "result": completion
        })
        response.headers["Access-Control-Allow-Origin"] = "*" # fix CORS error
        
        return response
    
    except botocore.exceptions.ClientError as error:
        if error.response['Error']['Code'] == 'AccessDeniedException':
            print(error.response['Error']['Message'])
        else:
            raise error

@app.route("/test", methods=['POST'])
def test():
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
    #completion = generate_correction(client, input_sentence)
    
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
    #completion = generate_correction(client, input_sentence)
    
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
