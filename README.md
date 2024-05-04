# bedrock-ai-tutor


## Deploy Backend locally
TBD

## Deploy Frontend locally
1. Add `cred.js` file in `/frontend/src/libs` directory.
    ```js
    export const REGION =
    export const AWS_ACCESS_KEY_ID = 
    export const AWS_SECRET_ACCESS_KEY = 
    export const API_URL = 
    ```
2. Enter `/frontend` directory and Run command below.
    ```bash
    npm i
    npm run build

    cd src
    python3 -m http.server 7000
    ```
3. Then your local app is available at `http://localhost:7000` 
