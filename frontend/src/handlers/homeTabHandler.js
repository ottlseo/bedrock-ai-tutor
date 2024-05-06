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
    if (fullText.length > 10) {
        console.log("=== Calling Bedrock... ===");
      
        haikuResponse = await BedrockClient.callApi(fullText, HAIKU);
        let correctedByHaiku = haikuResponse.data.result.content[0].text ?? "no response";
        correctedText.insertAdjacentHTML("beforeend", correctedByHaiku);

    } else {
      alert("너무 짧은 문장에서는 문법 교정의 단서를 찾기 어려워요. 최소 10자 이상의 문장으로 얘기해보세요!");
      console.log("TRY AGAIN");
    }
  };
  
export const resetSetting = () => {
    transcribedText.innerHTML = "";
    correctedText.innerHTML = "";
  }