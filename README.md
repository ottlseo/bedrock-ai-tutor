# Bedrock AI Tutor
| Architecture | 
| - |
| ![architecture](https://github.com/ottlseo/bedrock-ai-tutor/assets/61778930/0cd1efeb-dac2-4bc8-b289-55aed69a2be4) | 

| Business/Casual conversation recommendation | Claude 3.0 model comparison | 
| - | - |
| <img width="805" alt="image" src="https://github.com/ottlseo/bedrock-ai-tutor/assets/61778930/b9e98136-ea14-4f68-b260-c5b0f01ee3ab"> | <img width="841" alt="image" src="https://github.com/ottlseo/bedrock-ai-tutor/assets/61778930/63def459-73fa-499c-9642-04b1cd184970"> |

![image](https://github.com/ottlseo/bedrock-ai-tutor/assets/61778930/022af68c-b925-4c93-9f24-fb6ea7453413)

## Deploy Backend locally
0. Enable Anthropic Claude v3 model access on the [Amazon Bedrock console](https://console.aws.amazon.com/bedrock).   
    ( How to add model access: [Amazon Bedrock User Guide](https://docs.aws.amazon.com/ko_kr/bedrock/latest/userguide/model-access.html) )

1. Run the command below to install package and run apis locally.
    ```bash
    cd backend
    pip3 install -r requirements.txt 
    python3 controller.py
    ```
2. Then your api server is available at `http://localhost:8081` 

## Deploy Frontend locally
1. Add `cred.js` file in `/frontend/src/libs` directory.
    ```js
    export const REGION = "ENTER_YOUR_REGION";
    export const AWS_ACCESS_KEY_ID = "ENTER_YOUR_KEY";
    export const AWS_SECRET_ACCESS_KEY = "ENTER_YOUR_KEY";
    export const API_URL = "http://localhost:8081";
    ```
2. Enter `/frontend` directory and Run command below.
    ```bash
    npm i
    npm run build

    cd src
    python3 -m http.server 7000
    ```
3. Then your local app is available at `http://localhost:7000` 
