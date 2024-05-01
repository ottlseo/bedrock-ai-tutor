import * as TranscribeClient from "../../libs/transcribeClient.js";
// language code
export const EN = "en-US"
export const KO = "ko-KR"

const recordButton = document.getElementById("record");
const transcribedText = document.getElementById("transcribedText");

let fullText = "";

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
};

window.clearTranscription = () => {
  transcribedText.innerHTML = "";
};