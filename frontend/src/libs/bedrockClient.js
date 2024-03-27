
import { REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from "./cred.js";
import axios from 'axios';
import { API_URL } from "./cred.js";

const apiEndpoint = API_URL+"/test";
export const callApi = async (prompt) => {
    try {
        const request = {
            "prompt": prompt
        };
        const response = await axios.post(apiEndpoint, request);
        console.log(request);
        console.log(response);
    } catch {
        console.log("error");
    }
    console.log("=== DONE ===");
};