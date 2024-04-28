import * as TranscribeClient from "./libs/transcribeClient.js";
import * as BedrockClient from "./libs/bedrockClient.js";

// language code
export const EN = "en-US"
export const KO = "ko-KR"

// bedrock options
export const HAIKU = "haiku"; 
export const SONNET = "sonnet"; 
export const BUSINESS = "business";
export const CASUAL = "casual";

// bedrock model pricing($) per token
const HAIKU_PRICE_PER_INPUT_TOKEN = 0.00000025; // = 0.00025 / 1K
const HAIKU_PRICE_PER_OUTPUT_TOKEN = 0.00000125; // = 0.00125 / 1K
const SONNET_PRICE_PER_INPUT_TOKEN = 0.000003; // = 0.003 / 1K
const SONNET_PRICE_PER_OUTPUT_TOKEN = 0.000015; // = 0.015 / 1K
const MILLION = 1000000;

const recordButton = document.getElementById("record");
const transcribedText = document.getElementById("transcribedText");
const correctedTextByHaiku = document.getElementById("correctedTextByHaiku");
const correctedTextBySonnet = document.getElementById("correctedTextBySonnet");

const priceHaiku = document.getElementById("priceHaiku");
const priceSonnet = document.getElementById("priceSonnet");
const priceHaikuEasier = document.getElementById("priceHaikuEasier");
const priceSonnetEasier = document.getElementById("priceSonnetEasier");

let fullText = "";
let languageScoresResult = {
  EN: 0.0,
  KO: 0.0,
  // Add something
};
let haikuResponse = "";
let sonnetResponse = "";

window.onRecordPress = () => {
  if (recordButton.getAttribute("class") === "recordInactive") {
    startRecording();
  } else {
    stopRecording();
  }
};

const startRecording = async() => {
  window.clearTranscription();
  recordButton.setAttribute("class", "recordActive");
  try {
    await TranscribeClient.startRecording(onTranscriptionDataReceived);
  } catch(error) {
    alert("An error occurred while recording: " + error.message);
    stopRecording();
  }
};

const onTranscriptionDataReceived = (data, languageInfo) => {
  transcribedText.insertAdjacentHTML("beforeend", data);
  // Concat streams to full sentence
  fullText += data;
  // Calculate scores of each languageCode
  languageScoresResult.EN += languageInfo[0]["Score"] 
  languageScoresResult.KO += languageInfo[1]["Score"]
}

const stopRecording = async () => {
  recordButton.setAttribute("class", "recordInactive");
  TranscribeClient.stopRecording();
  
  console.log("Full sentence:", fullText);
  console.log("English score: ",languageScoresResult.EN);
  console.log("Korean score: ", languageScoresResult.KO);

  if (languageScoresResult.EN > languageScoresResult.KO) {
    console.log("=== Calling Bedrock... ===");
    sonnetResponse = await BedrockClient.callApi(fullText, SONNET);
    haikuResponse = await BedrockClient.callApi(fullText, HAIKU);

    let correctedByHaiku = haikuResponse.data.result.content[0].text ?? "no response";
    correctedTextByHaiku.insertAdjacentHTML("beforeend", correctedByHaiku);
    let totalpriceHaiku = (
      haikuResponse.data.result.usage.input_tokens * HAIKU_PRICE_PER_INPUT_TOKEN +
      haikuResponse.data.result.usage.output_tokens * HAIKU_PRICE_PER_OUTPUT_TOKEN
      ).toFixed(8);
    priceHaiku.insertAdjacentHTML("beforeend", `Total price = $ ${totalpriceHaiku}`); 
    priceHaikuEasier.insertAdjacentHTML("beforeend", `(Total price *1000000 = $ ${totalpriceHaiku*MILLION})`); 
    console.log("Corrected by Haiku: ", correctedByHaiku); //
    
    let correctedBySonnet = sonnetResponse.data.result.content[0].text ?? "no response";
    correctedTextBySonnet.insertAdjacentHTML("beforeend", correctedBySonnet);
    let totalpriceSonnet = (
      sonnetResponse.data.result.usage.input_tokens * SONNET_PRICE_PER_INPUT_TOKEN + 
      sonnetResponse.data.result.usage.output_tokens * SONNET_PRICE_PER_OUTPUT_TOKEN
      ).toFixed(6);
    priceSonnet.insertAdjacentHTML("beforeend", `Total price = $ ${totalpriceSonnet}`);
    priceSonnetEasier.insertAdjacentHTML("beforeend", `(Total price *1000000 = $ ${totalpriceSonnet*MILLION})`); 
    console.log("Corrected by Sonnet: ", correctedBySonnet); //
    
  } else if (languageScoresResult.EN < languageScoresResult.KO) {
    alert("Please speak in English!");
  } else {
    console.log("Try again");
  }
};

window.clearTranscription = () => {
  transcribedText.innerHTML = "";
  correctedTextByHaiku.innerHTML = "";
  correctedTextBySonnet.innerHTML = "";
  priceHaiku.innerHTML = "";
  priceHaikuEasier.innerHTML = "";
  priceSonnet.innerHTML = "";
  priceSonnetEasier.innerHTML = "";
};
