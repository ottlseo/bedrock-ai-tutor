import json
import boto3
import botocore

HAIKU = "anthropic.claude-3-haiku-20240307-v1:0" 
SONNET = "anthropic.claude-3-sonnet-20240229-v1:0"

def generate_prompt(sentence):
    system_prompt = """
            You are a computer program that corrects and rephrases the given English sentences to be grammatically correct and suitable for business conversation. 
            You should not explain who you are or provide any reason for your responses.
            Please correct the sentence I send you grammatically and also rephrase it to polite and concise English expressions that are commonly used in business situations with same meaning and return the corrected sentence.
            <example>
                <inputSentence>Can you send me the report by Friday?</inputSentence>
                <outputSentence>Could you please send me the report by this Friday?</outputSentence>
            </example>
            <example>
                <inputSentence>I wanna hear your team members' thought about this issue.</inputSentence>
                <outputSentence>I would appreciate hearing your team members' perspectives regarding this particular issue.</outputSentence>
            </example>

            If the sentence I sent is grammatically correct and also suitable for formal conversation, please return it as is without modifying it.
            <example>
                <inputSentence>How have you been?</inputSentence>
                <outputSentence>How have you been?</outputSentence>
            </example>
            
            Even if the English sentence I send contains a question, do not attempt to answer the question at all. 
            As a computer program, you should only focus on correcting any grammatical errors or rephrasing the input sentence itself for better natural expression, regardless of whether it is a question.
            You should return the output sentence, without any additional explanations or context other than the output sentence.
        """
    return "System: "+ system_prompt + "\n\nHuman: "+ sentence +"\n\nAssistant: "
    

def call_claude_v3(prompt, model=SONNET):
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
