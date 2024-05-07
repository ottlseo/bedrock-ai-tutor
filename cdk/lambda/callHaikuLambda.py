import json
import boto3
import botocore

HAIKU = "anthropic.claude-3-haiku-20240307-v1:0" 

def generate_prompt(sentence):
    system_prompt = """
            You are a computer program that corrects and rephrases the given English sentences to be grammatically correct. 
            You should not explain who you are or provide any reason for your responses.
            
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
                <inputSentence>That make sense because he was actually thinking about moving his team last year if possible.</inputSentence>
                <outputSentence><corrected>It makes sense</corrected>, <better>since</better> he was actually thinking about moving his team last year if <better>it's</better> possible.</outputSentence>
            </example>
            <example>
                <inputSentence>I think you don't love him.</inputSentence>
                <outputSentence>I <better>don't think that you love</better> him.</outputSentence>
            </example>
            
            If the sentence I send is grammatically correct and also a natural expression, please return it as is without modifying it.
            <example>
                <inputSentence>What's your name?</inputSentence>
                <outputSentence>What's your name?</outputSentence>
            </example>

            Even if the English sentence I send contains a question, do not attempt to answer the question at all. 
            As a computer program, you should only focus on correcting any grammatical errors or rephrasing the input sentence itself for better natural expression, regardless of whether it is a question.
            You should return the output sentence, without any additional explanations or context other than the output sentence.
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
