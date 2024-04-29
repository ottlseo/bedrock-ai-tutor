import * as TranscribeClient from "../../libs/transcribeClient.js";
import * as BedrockClient from "../../libs/bedrockClient.js";

// language code
export const EN = "en-US"
export const KO = "ko-KR"

// bedrock options
export const HAIKU = "haiku"; 
export const SONNET = "sonnet"; 
export const BUSINESS = "business";
export const CASUAL = "casual";

const recordButton = document.getElementById("record");
const transcribedText = document.getElementById("transcribedText");
const outputByOption1 = document.getElementById("outputByOption1");
const outputByOption2 = document.getElementById("outputByOption2");

let fullText = "";
let casualResponse = "";
let businessResponse = "";

window.onRecordPress = () => {
  if (recordButton.getAttribute("class") === "recordInactive") {
    startRecording();
  } else {
    stopRecording();
  }
};

const resetSetting = () => {
  window.clearTranscription();
  fullText = "";
}
const startRecording = async() => {
  resetSetting();
  recordButton.setAttribute("class", "recordActive");
  try {
    await TranscribeClient.startRecording(onTranscriptionDataReceived);
  } catch(error) {
    alert("An error occurred while recording: " + error.message);
    stopRecording();
  }
};

const onTranscriptionDataReceived = (data) => {
  transcribedText.insertAdjacentHTML("beforeend", data);
  // Concat streams to full sentence
  fullText += data;
}

const stopRecording = async () => {
  recordButton.setAttribute("class", "recordInactive");
  TranscribeClient.stopRecording();
  
  console.log("Full sentence:", fullText);
  if (fullText != "") {
    console.log("=== Calling Bedrock... ===");
    businessResponse = await BedrockClient.callApi(fullText, BUSINESS);
    casualResponse = await BedrockClient.callApi(fullText, CASUAL);

    let casualCorrection = casualResponse.data.result.content[0].text ?? "no response";
    outputByOption1.insertAdjacentHTML("beforeend", casualCorrection);
    console.log("Casual correction: ", casualCorrection);
    
    let businessCorrection = businessResponse.data.result.content[0].text ?? "no response";
    outputByOption2.insertAdjacentHTML("beforeend", businessCorrection);
    console.log("Business correction: ", businessCorrection);
    
  } else {
    console.log("Try again");
  }
};

window.clearTranscription = () => {
  transcribedText.innerHTML = "";
  outputByOption1.innerHTML = "";
  outputByOption2.innerHTML = "";
};