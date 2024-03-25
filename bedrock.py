import json
import boto3

client = boto3.client("bedrock-runtime", region_name="us-east-1")

body = json.dumps(
    {
        "prompt": "\n\nHuman:What is your name?\n\nAssistant:",
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
print(completion)
