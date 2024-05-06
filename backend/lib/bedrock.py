from backend.variables import BUSINESS_CONVERSATION, CASUAL_CONVERSATION, NORMAL_CONVERSATION_USING_HAIKU, HAIKU
import json
import boto3

def generate_system_prompt(option=None):
    if option == BUSINESS_CONVERSATION:
        return """
            You are an English teacher who corrects students' English sentences to be suitable for business conversations. 
            Please correct the sentence I send you grammatically and also rephrase it to polite and concise English expressions that are commonly used in business situations with same meaning and return the corrected sentence.
            If the English sentence I send is not erroneous in grammar and suitable for formal conversation, just return the original sentence.
            Please always return the output sentence only, without providing any additional explanations.
        """
            # <example>
            #     <inputSentence>Can you help me?</inputSentence>
            #     <outputSentence>Could you please assist me with this?</outputSentence>
            # </example>
            # <example>
            #     <inputSentence>What's up?</inputSentence>
            #     <outputSentence>How have you been?</outputSentence>
            # </example>
            # <example>
            #     <inputSentence>Thank you for coming here.</inputSentence>
            #     <outputSentence>I appreciate your attendance and participation.</outputSentence>
            # </example>
            
    elif option == CASUAL_CONVERSATION:
        return """
            You're an English teacher who naturally rephrases a student's sentence to make it more suitable for a casual conversation between close friends. 
            Please correct the sentence I send you grammatically and also suitable for informal casual conversation and return the corrected sentence.
            If the English sentence I send is not erroneous in grammar and suitable for casual conversation, just return the original sentence.
            Please always return the output sentence only, without providing any additional explanations.
        """
    elif option == NORMAL_CONVERSATION_USING_HAIKU:
        return """
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
    else: 
        return """
            You are an English teacher who corrects students' English sentences to be grammatically correct. 
            If the English sentence I send you has a grammatical error, return the full sentence with the corrected word(s) enclosed in <corrected> XML tags.
            If the English sentence I send is not erroneous, rephrase the part of the sentence that could be more natural into a better form, and return the full sentence with the rephrased part enclosed in <better> XML tags.
            Always return only the full sentence with the corrected/rephrased part enclosed in XML tags, without providing any additional explanations.
        """

def generate_prompt(sentence, option=None):
    system_prompt = generate_system_prompt(option=option)
    return "System: "+ system_prompt + "\n\nHuman: "+ sentence +"\n\nAssistant: "

def call_claude_v3(prompt, model=HAIKU):
    body = json.dumps({
        "max_tokens": 2000,
        "messages": [{"role": "user", "content": prompt}],
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
        response = jsonify({
            "result": response_body
        })
        response.headers["Access-Control-Allow-Origin"] = "*" # fix CORS error
        return response
    
    except botocore.exceptions.ClientError as error:
        if error.response['Error']['Code'] == 'AccessDeniedException':
            return error.response['Error']['Message']
        else:
            raise error
