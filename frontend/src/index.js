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

const recordButton = document.getElementById("record");
const transcribedText = document.getElementById("transcribedText");
const correctedTextByHaiku = document.getElementById("correctedTextByHaiku");
const correctedTextBySonnet = document.getElementById("correctedTextBySonnet");
const priceCallingHaiku = document.getElementById("priceCallingHaiku");
const priceCallingSonnet = document.getElementById("priceCallingSonnet");

let fullText = "";
let languageScoresResult = {
  EN: 0.0,
  KO: 0.0,
  // Add something
};
let haikuResponse = "";

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
    console.log("=== Calling Bedrock... ===")
    haikuResponse = await BedrockClient.callApi(fullText, HAIKU);
    sonnetResponse = await BedrockClient.callApi(fullText, SONNET);

    let correctedByHaiku = haikuResponse.data.result.content.text ?? "";
    correctedTextByHaiku.insertAdjacentHTML("beforeend", correctedByHaiku);
    let totalPriceCallingHaiku = 
          haikuResponse.data.usage.input_tokens * HAIKU_PRICE_PER_INPUT_TOKEN 
          + haikuResponse.data.usage.output_tokens * HAIKU_PRICE_PER_OUTPUT_TOKEN;
    priceCallingHaiku.insertAdjacentHTML("beforeend", totalPriceCallingHaiku);
    
    let correctedBySonnet = sonnetResponse.data.result.content.text ?? "";
    correctedTextBySonnet.insertAdjacentHTML("beforeend", correctedBySonnet);
    let totalPriceCallingSonnet =
          sonnetResponse.data.usage.input_tokens * SONNET_PRICE_PER_INPUT_TOKEN 
          + sonnetResponse.data.usage.output_tokens * SONNET_PRICE_PER_OUTPUT_TOKEN;
    priceCallingSonnet.insertAdjacentHTML("beforeend", totalPriceCallingSonnet);
    
  } else {
    alert("Please speak in English!");
  }
};

window.clearTranscription = () => {
  transcribedText.innerHTML = "";
  correctedTextByHaiku.innerHTML = "";
};
