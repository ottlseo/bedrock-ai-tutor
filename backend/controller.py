from flask import Flask, request, json, jsonify
import boto3
import logging
from flask_cors import CORS

# from bedrock import generate_correction

app = Flask(__name__)
CORS(app)

pre_prompt = "Please correct the following sentence grammatically and provide only the corrected sentence as the output, without any explanation - "
pre_prompt_business = "If I provide an incorrect English sentence, please correct it grammatically and modify the vocabulary to make it suitable for business conversation. Provide only the corrected sentence as the output, without any explanation - "
pre_prompt_casual = "If I provide an incorrect English sentence, please correct it grammatically and modify the vocabulary to make it natural and suitable for casual conversation. Provide only the corrected sentence as the output, without any explanation - "

@app.route("/test", methods=['POST'])
def test():
    client = boto3.client("bedrock-runtime", region_name="us-east-1")
    
    data = request.get_json()
    prompt = data["prompt"]
    
    print("Request: ", prompt)
    
    #completion = generate_correction(client, prompt)
    
    body = json.dumps(
        {
            "prompt": "Human: " + pre_prompt + prompt + "\n\nAssistant:",
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

@app.route("/test/business", methods=['POST'])
def test_business():
    client = boto3.client("bedrock-runtime", region_name="us-east-1")
    
    data = request.get_json()
    prompt = data["prompt"]
    
    print("Request: ", prompt)
    
    #completion = generate_correction(client, prompt)
    
    body = json.dumps(
        {
            "prompt": "Human: " + pre_prompt_business + prompt + "\n\nAssistant:",
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

@app.route("/test/casual", methods=['POST'])
def test_casual():
    client = boto3.client("bedrock-runtime", region_name="us-east-1")
    
    data = request.get_json()
    prompt = data["prompt"]
    
    print("Request: ", prompt)
    
    #completion = generate_correction(client, prompt)
    
    body = json.dumps(
        {
            "prompt": "Human: " + pre_prompt_casual + prompt + "\n\nAssistant:",
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
    app.run(debug=True, host='0.0.0.0', port=8080)
