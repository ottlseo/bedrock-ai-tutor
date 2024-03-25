from flask import Flask, request, json, jsonify
import boto3
# from bedrock import generate_correction

app = Flask(__name__)

@app.route("/test", methods=['POST'])
def test():
    client = boto3.client("bedrock-runtime", region_name="us-east-1")
    
    data = request.get_json()
    prompt = data["prompt"]
    
    print("Request: ", prompt)
    
    #completion = generate_correction(client, prompt)
    
    body = json.dumps(
        {
            "prompt": "Human: " + prompt + "\n\nAssistant:",
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

    response = {
        "result": completion
    }
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8080)
