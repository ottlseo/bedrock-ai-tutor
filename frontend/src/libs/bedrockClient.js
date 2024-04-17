import axios from 'axios';
import { API_URL } from "./cred.js";

const apiEndpoint = API_URL+"/business";
export const callApi = async (prompt) => {
    try {
        const request = {
            "prompt": prompt
        };
        const response = await axios.post(apiEndpoint, request);
        return response
        // console.log(request);
        // console.log(response);
    } catch {
        console.log("error");
    }
};