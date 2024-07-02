import axios from 'axios';
import { API_URL } from "./cred.js";

export const callApi = async (prompt, option) => {
    const apiUrl = API_URL + option;
    try {
        const request = {
            "prompt": prompt
        };
        const response = await axios.post(apiUrl, request);
        return response
        
    } catch {
        console.log("error");
    }
};