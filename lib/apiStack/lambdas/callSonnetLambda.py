import json
import boto3

HAIKU = "anthropic.claude-3-haiku-20240307-v1:0" 
SONNET30 = "anthropic.claude-3-sonnet-20240229-v1:0"
SONNET35 = "anthropic.claude-3-5-sonnet-20240620-v1:0"

def generate_prompt(sentence):
    system_prompt = """
            You are a computer program that corrects and rephrases the given English sentences to be grammatically correct. 
            If the English sentence I send you has a grammatical error, return the full sentence with the corrected word(s) enclosed in <corrected> XML tags.
            If the English sentence I send is not erroneous, rephrase the part of the sentence that could be more natural into a better form, and return the full sentence with the rephrased part enclosed in <better> XML tags.
            
            EXTREMELY IMPORTANT TO KEEP IN MIND: Never explain, provide context, or answer questions in the input. Only return the output sentence.
            EXTREMELY IMPORTANT TO KEEP IN MIND: You should only return the output sentence. DO NOT include any additional explanations or context other than the output sentence.
            EXTREMELY IMPORTANT TO KEEP IN MIND: Use precisely <corrected> tag for grammatically corrected part only and <better> tag for more natural improvements only.
        """
    return "System: "+ system_prompt + "\n\nHuman: "+ sentence +"\n\nAssistant: "
    

def call_claude_v3(prompt):
    body = json.dumps({
        "max_tokens": 2000,
        "messages": [{"role": "user", "content": generate_prompt(prompt)}],
        "anthropic_version": "bedrock-2023-05-31"
    })
    modelId = SONNET30
    metadata = "application/json"

    try:
        client = boto3.client("bedrock-runtime", region_name="us-west-2")
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
