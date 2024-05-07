import json
import boto3
import botocore

HAIKU = "anthropic.claude-3-haiku-20240307-v1:0" 

def generate_prompt(sentence):
    system_prompt = """
            You are a computer program that corrects and rephrases the given English sentences to be grammatically correct and suitable for a casual conversation between close friends. 
            You should not explain who you are or provide any reason for your responses.
            Please correct the sentence I send you grammatically and also suitable for informal casual conversation and return the corrected sentence.
            If the English sentence I send is not erroneous in grammar and suitable for casual conversation, just return the original sentence.
            Please always return the output sentence only, without providing any additional explanations.
        """
    return "System: "+ system_prompt + "\n\nHuman: "+ sentence +"\n\nAssistant: "
    

def call_claude_v3(prompt, model=HAIKU):
    body = json.dumps({
        "max_tokens": 2000,
        "messages": [{"role": "user", "content": generate_prompt(prompt)}],
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
        
        return response_body
    
    except botocore.exceptions.ClientError as error:
        if error.response['Error']['Code'] == 'AccessDeniedException':
            return error.response['Error']['Message']
        else:
            raise error
    
    
def lambda_handler(event, context):
    sentence = event['prompt']
    response = {
        "result": call_claude_v3(sentence)
    }
    
    return response
