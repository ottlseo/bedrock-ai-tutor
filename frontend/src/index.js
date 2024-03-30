import * as TranscribeClient from "./libs/transcribeClient.js";
import * as BedrockClient from "./libs/bedrockClient.js";

const recordButton = document.getElementById("record");
const transcribedText = document.getElementById("transcribedText");
const correctedText = document.getElementById("correctedText");
let fullText = "";
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

const onTranscriptionDataReceived = (data) => {
  transcribedText.insertAdjacentHTML("beforeend", data);
  fullText += data;
}

const stopRecording = async () => {
  recordButton.setAttribute("class", "recordInactive");
  TranscribeClient.stopRecording();
  console.log("Full sentence:", fullText); // 
  bedrockResponse = await BedrockClient.callApi(fullText);
  correctedText.insertAdjacentHTML("beforeend", JSON.parse(bedrockResponse).data?.result);
};

window.clearTranscription = () => {
  transcribedText.innerHTML = "";
};
