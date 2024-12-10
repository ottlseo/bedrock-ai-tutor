import json
import boto3
import botocore

HAIKU = "anthropic.claude-3-haiku-20240307-v1:0" 
SONNET30 = "anthropic.claude-3-sonnet-20240229-v1:0"
SONNET35 = "anthropic.claude-3-5-sonnet-20240620-v1:0"
REGION = "ap-northeast-2"

def generate_prompt(sentence):
    system_prompt = """
            You are a computer program that corrects and rephrases the given English sentences to be grammatically correct. 
            If the English sentence I send you has a grammatical error, return the full sentence with the corrected word(s).
            Even if the grammar isn't wrong, if there's something that could be improved to sound more natural, please correct it.

            EXTREMELY IMPORTANT TO KEEP IN MIND: Never explain, provide context, or answer questions in the input. Only return the output sentence.
            EXTREMELY IMPORTANT TO KEEP IN MIND: You should only return the output sentence. DO NOT include any additional explanations or context other than the output sentence.
        """
    return "System: "+ system_prompt + "\n\nUser: "+ sentence +"\n\nAssistant: "
    

def call_claude_v3(prompt):
    body = json.dumps({
        "max_tokens": 2000,
        "messages": [{"role": "user", "content": generate_prompt(prompt)}],
        "anthropic_version": "bedrock-2023-05-31"
    })
    modelId = SONNET35
    metadata = "application/json"

    try:
        client = boto3.client("bedrock-runtime", region_name=REGION)
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
