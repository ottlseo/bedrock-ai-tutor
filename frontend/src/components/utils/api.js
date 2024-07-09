import axios from 'axios';
import { API_URL } from "./apiConfig.js";
import { HAIKU, SONNET, BUSINESS,
    HAIKU_PRICE_PER_INPUT_TOKEN, HAIKU_PRICE_PER_OUTPUT_TOKEN, 
    SONNET_PRICE_PER_INPUT_TOKEN, SONNET_PRICE_PER_OUTPUT_TOKEN } from './variables.js';

const callApi = async (prompt, option) => {
    const apiUrl = API_URL + option;
    try {
        const request = {
            "prompt": prompt
        };
        const response = await axios.post(apiUrl, request);
        const correction = response.data.result.content[0].text ?? "no response";
        const totalPrice = response.data.result.usage.input_tokens * (
            option === SONNET ? SONNET_PRICE_PER_INPUT_TOKEN : HAIKU_PRICE_PER_INPUT_TOKEN
        ) + response.data.result.usage.output_tokens * (
            option === SONNET ? SONNET_PRICE_PER_OUTPUT_TOKEN : HAIKU_PRICE_PER_OUTPUT_TOKEN
        );
        return {
            correction: correction,
            price: totalPrice
        };
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
