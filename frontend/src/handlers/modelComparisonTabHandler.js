import * as TranscribeClient from "../libs/transcribeClient.js";
import * as BedrockClient from "../libs/bedrockClient.js";
import { HAIKU, HAIKU_PRICE_PER_INPUT_TOKEN, HAIKU_PRICE_PER_OUTPUT_TOKEN,
    SONNET, SONNET_PRICE_PER_INPUT_TOKEN, SONNET_PRICE_PER_OUTPUT_TOKEN,
    MILLION
 } from "../variables.js";
 
let fullText = "";
let haikuResponse = "";
let sonnetResponse = "";

const recordButton = document.getElementById("modelTabRecord");
const transcribedText = document.getElementById("transcribedTextAtModelTab");

const correctedTextByHaiku = document.getElementById("correctedTextByHaiku");
const correctedTextBySonnet = document.getElementById("correctedTextBySonnet");

const priceHaiku = document.getElementById("priceHaiku");
const priceSonnet = document.getElementById("priceSonnet");
const priceHaikuEasier = document.getElementById("priceHaikuEasier");
const priceSonnetEasier = document.getElementById("priceSonnetEasier");

const onTranscriptionDataReceived = (data) => {
    transcribedText.insertAdjacentHTML("beforeend", data);
    fullText += data; // Concat streams to full sentence
  }
  
export const startRecording = async () => {
    recordButton.setAttribute("class", "recordActive");
    try {
      await TranscribeClient.startRecording(onTranscriptionDataReceived);
    } catch(error) {
      alert("An error occurred while recording: " + error.message);
      recordButton.setAttribute("class", "recordInactive");
      TranscribeClient.stopRecording();
    }
};

export const stopRecordingAndSendResult = async () => {
    console.log("Full sentence:", fullText);
    if (fullText.length > 10) {
        console.log("=== Calling Bedrock... ===");
      
        sonnetResponse = await BedrockClient.callApi(fullText, SONNET);
        haikuResponse = await BedrockClient.callApi(fullText, HAIKU);

        /* Getting corrected sentence and price by Haiku */
        let correctedByHaiku = haikuResponse.data.result.content[0].text ?? "no response";
        correctedTextByHaiku.insertAdjacentHTML("beforeend", correctedByHaiku);
        
        let totalpriceHaiku = (
            haikuResponse.data.result.usage.input_tokens * HAIKU_PRICE_PER_INPUT_TOKEN +
            haikuResponse.data.result.usage.output_tokens * HAIKU_PRICE_PER_OUTPUT_TOKEN
        ).toFixed(8);
        
        priceHaiku.insertAdjacentHTML("beforeend", `Total price = $ ${totalpriceHaiku}`); 
        priceHaikuEasier.insertAdjacentHTML("beforeend", `(Total price *1000000 = $ ${totalpriceHaiku*MILLION})`); 
    
        /* Getting corrected sentence and price by Sonnet */
        let correctedBySonnet = sonnetResponse.data.result.content[0].text ?? "no response";
        correctedTextBySonnet.insertAdjacentHTML("beforeend", correctedBySonnet);
        
        let totalpriceSonnet = (
            sonnetResponse.data.result.usage.input_tokens * SONNET_PRICE_PER_INPUT_TOKEN + 
            sonnetResponse.data.result.usage.output_tokens * SONNET_PRICE_PER_OUTPUT_TOKEN
        ).toFixed(6);
        
        priceSonnet.insertAdjacentHTML("beforeend", `Total price = $ ${totalpriceSonnet}`);
        priceSonnetEasier.insertAdjacentHTML("beforeend", `(Total price *1000000 = $ ${totalpriceSonnet*MILLION})`); 
        
    } else {
      alert("너무 짧은 문장에서는 문법 교정의 단서를 찾기 어려워요. 최소 10자 이상의 문장으로 얘기해보세요!");
      console.log("TRY AGAIN");
    }
  };
  
export const resetSetting = () => {
    transcribedText.innerHTML = "";
    correctedTextByHaiku.innerHTML = "";
    correctedTextBySonnet.innerHTML = "";
    priceHaiku.innerHTML = "";
    priceHaikuEasier.innerHTML = "";
    priceSonnet.innerHTML = "";
    priceSonnetEasier.innerHTML = "";
  }