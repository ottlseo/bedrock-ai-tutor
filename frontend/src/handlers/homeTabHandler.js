import * as TranscribeClient from "../libs/transcribeClient.js";
import * as BedrockClient from "../libs/bedrockClient.js";
import { HAIKU } from "../variables.js";
 
let fullText = "";
let haikuResponse = "";

const recordButton = document.getElementById("homeTabRecord");
const transcribedText = document.getElementById("transcribedText");

const correctedText = document.getElementById("correctedText");

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
    if (fullText != "") {
        console.log("=== Calling Bedrock... ===");
      
        haikuResponse = await BedrockClient.callApi(fullText, HAIKU);
        let correctedByHaiku = haikuResponse.data.result.content[0].text ?? "no response";
        correctedText.insertAdjacentHTML("beforeend", correctedByHaiku);

    } else {
      console.log("Try again");
    }
  };
  
export const resetSetting = () => {
    transcribedText.innerHTML = "";
    correctedText.innerHTML = "";
  }