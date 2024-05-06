import json
import boto3
import botocore

HAIKU = "anthropic.claude-3-haiku-20240307-v1:0" 

def generate_prompt(sentence):
    system_prompt = """
            You are an English teacher who corrects students' English sentences to be grammatically correct. 
            
            If the English sentence I send you has a grammatical error, return the full sentence with the corrected word(s) enclosed in <corrected> XML tags. 
            <example>
                <inputSentence>I have went to the store yesterday.</inputSentence>
                <outputSentence>I have <corrected>gone</corrected> to the store yesterday.</outputSentence>
            </example>
            <example>
                <inputSentence>She don't like apples.</inputSentence>
                <outputSentence>She doesn't like apples.</outputSentence>
            </example>
            
            If the English sentence I send is not erroneous, rephrase the part of the sentence that could be more natural into a better form, and return the full sentence with the rephrased part enclosed in <better> XML tags. 
            <example>
                <inputSentence>Can I get your help?</inputSentence>
                <outputSentence>Can <better>you help me?</better></outputSentence>
            </example>
            <example>
                <inputSentence>I was a shy boy. I cannot get closer with her.</inputSentence>
                <outputSentence>I <corrected>couldn't get closer to</corrected> her <better>at that time,</better> <better>because I was a shy boy.</better></outputSentence>
            </example>
            <example>
                <inputSentence>I would like to buy that pen, if possible.</inputSentence>
                <outputSentence>I would like to buy that pen, if <better>that's</better> possible.</outputSentence>
            </example>

            Always return only the full sentence with the corrected/rephrased part enclosed in XML tags. Never return any additional explanations or context.
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
