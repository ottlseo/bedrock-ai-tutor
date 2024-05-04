import * as TranscribeClient from "../libs/transcribeClient.js";
import * as BedrockClient from "../libs/bedrockClient.js";
import { BUSINESS, CASUAL } from "../variables.js";

let fullText = "";
let businessResponse = "";
let casualResponse = "";

const recordButton = document.getElementById("roleTabRecord");
const transcribedText = document.getElementById("transcribedTextAtRoleTab");
const outputByOption1 = document.getElementById("outputByOption1");
const outputByOption2 = document.getElementById("outputByOption2");

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
      
      businessResponse = await BedrockClient.callApi(fullText, BUSINESS);
      casualResponse = await BedrockClient.callApi(fullText, CASUAL);
  
      let casualCorrection = casualResponse.data.result.content[0].text ?? "no response";
      outputByOption1.insertAdjacentHTML("beforeend", casualCorrection);
      
      let businessCorrection = businessResponse.data.result.content[0].text ?? "no response";
      outputByOption2.insertAdjacentHTML("beforeend", businessCorrection);
    } else {
      console.log("Try again");
    }
  };
  
export const resetSetting = () => {
    transcribedText.innerHTML = "";
    outputByOption1.innerHTML = "";
    outputByOption2.innerHTML = "";
  }