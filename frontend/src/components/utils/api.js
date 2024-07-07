import axios from 'axios';
import { API_URL } from "./apiConfig.js";

const HAIKU = "haiku";
const SONNET = "sonnet";
const BUSINESS = "business";

const callApi = async (prompt, option) => {
    const apiUrl = API_URL + option;
    try {
        const request = {
            "prompt": prompt
        };
        const response = await axios.post(apiUrl, request);
        return response.data.result.content[0].text ?? "no response";
        
    } catch {
        console.log("error");
    }
};

export const getSonnetCorrection = async (prompt) => {
    const response = await callApi(prompt, SONNET);
    return response;
};

export const getHaikuCorrection = async (prompt) => {
    const response = await callApi(prompt, HAIKU);
    return response;
};

export const getBusinessCorrection = async (prompt) => {
    const response = await callApi(prompt, BUSINESS);
    return response;
};
