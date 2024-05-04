# bedrock-ai-tutor


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
