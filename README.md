# Bedrock AI Tutor

<img width="1512" alt="image" src="https://github.com/ottlseo/bedrock-ai-tutor/assets/61778930/a9fed35e-3e25-4811-a359-362c62b3f8f7">

| Claude model comparison mode | Business conversation transition mode | 
| - | - |
| <img width="659" alt="image" src="https://github.com/ottlseo/bedrock-ai-tutor/assets/61778930/b97d3aae-1ec1-4e30-831f-41c17857f6e6"> | <img width="903" alt="image" src="https://github.com/ottlseo/bedrock-ai-tutor/assets/61778930/ae950813-64b7-466b-935a-becc8f06ef2b"> |

# Architecture 
![architecture](https://github.com/ottlseo/bedrock-ai-tutor/assets/61778930/0cd1efeb-dac2-4bc8-b289-55aed69a2be4)

# How to deploy on your environment using AWS CDK
## Prerequisites 
1. ✅ Make sure you have the `cdk` installed in your environment. 
If you don't have cdk, follow the link and install CDK: https://docs.aws.amazon.com/ko_kr/cdk/v2/guide/getting_started.html

```bash    
    # To check if you have AWS CDK
    cdk --version   ## if you don't have cdk -- Follow the link above and install it. 
```
2. ✅ Make sure you have the aws credential information stored in `~.aws/credentials`. 
```bash
    # To check if you have credential info
    vi ~/.aws/credentials

    ## if the file is empty, please add your credentials using the command below.
    aws configure # and enter your REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY. 
```    

## CDK Stack deployment 
### 1. Enable Anthropic Claude model access on the [Amazon Bedrock console](https://console.aws.amazon.com/bedrock)   
- How to add model access: [Amazon Bedrock User Guide](https://docs.aws.amazon.com/ko_kr/bedrock/latest/userguide/model-access.html)
- What to request: Haiku 3.0 and Sonnet 3.0 (+ Sonnet 3.5 if needed)

### 2. Deploy ApiStack
```bash
cdk bootstrap
cdk deploy ApiStack

# After deployment finished, the API Gateway Endpoint will be printed.
```
<img width="922" alt="image" src="https://github.com/ottlseo/bedrock-ai-tutor/assets/61778930/e5625420-169a-4a69-9f5e-30c01862b128">

### 3. Updating the API URL in your frontend code

Copy the API Endpoint that came out as output in step2, find the `INSERT_YOUR_API_GW_ENDPOINT` string in lib/WebStack/fe/index.html and replace it with the copied API URL.

<img width="650" alt="image" src="https://github.com/user-attachments/assets/54bb30f3-0258-4bb5-a1c5-1f534b46ee60">


### 4. Deploy WebStack
```bash
cdk bootstrap
cdk deploy WebStack

# After deployment finished, the Cloudfront URL will be printed.
```
<img width="861" alt="image" src="https://github.com/ottlseo/bedrock-ai-tutor/assets/61778930/80dc3c3b-cc26-4263-b250-715e668b98cc">

