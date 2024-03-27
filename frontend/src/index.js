import * as TranscribeClient from "./libs/transcribeClient.js";
import * as BedrockClient from "./libs/bedrockClient.js";

const recordButton = document.getElementById("record");
const transcribedText = document.getElementById("transcribedText");

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
}

const stopRecording = () => {
  recordButton.setAttribute("class", "recordInactive");
  TranscribeClient.stopRecording();
};

window.clearTranscription = () => {
  transcribedText.innerHTML = "";
};

// snippet-end:[transcribe.JavaScript.streaming.indexv3]
