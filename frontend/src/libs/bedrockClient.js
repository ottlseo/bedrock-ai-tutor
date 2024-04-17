import axios from 'axios';
import { API_URL } from "./cred.js";

const apiEndpoint = API_URL+"/test/business";
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
};