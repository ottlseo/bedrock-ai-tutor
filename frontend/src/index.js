import * as TranscribeClient from "./libs/transcribeClient.js";
import * as BedrockClient from "./libs/bedrockClient.js";

// language code
export const EN = "en-US"
export const KO = "ko-KR"

const recordButton = document.getElementById("record");
const transcribedText = document.getElementById("transcribedText");
const correctedText = document.getElementById("correctedText");
let fullText = "";
let languageScoresResult = {
  EN: 0.0,
  KO: 0.0,
  // Add something
};
let bedrockResponse = "";

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
    bedrockResponse = await BedrockClient.callApi(fullText);
    correctedText.insertAdjacentHTML("beforeend", JSON.parse(bedrockResponse).data?.result);
  } else {
    alert("=== Please speak in English ===");
  }
  
};

window.clearTranscription = () => {
  transcribedText.innerHTML = "";
};
