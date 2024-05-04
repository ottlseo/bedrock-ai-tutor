import * as TranscribeClient from "./libs/transcribeClient.js";
import * as AssignRoleHandler from './handlers/assignRoleHandler.js';
import * as CompareModelHandler from './handlers/compareModelHandler.js';

window.onRecordPressAtModelTab = () => {
  const recordButton = document.getElementById("modelTabRecord");
  
  if (recordButton.getAttribute("class") === "recordInactive") {
    CompareModelHandler.resetSetting();
    CompareModelHandler.startRecording();
  } else {
    recordButton.setAttribute("class", "recordInactive");
    TranscribeClient.stopRecording();
    CompareModelHandler.stopRecordingAndSendResult();
  }
};

window.onRecordPressAtRoleTab = () => {
  const recordButton = document.getElementById("roleTabRecord");
  
  if (recordButton.getAttribute("class") === "recordInactive") {
    AssignRoleHandler.resetSetting();
    AssignRoleHandler.startRecording();
  } else {
    recordButton.setAttribute("class", "recordInactive");
    TranscribeClient.stopRecording();
    AssignRoleHandler.stopRecordingAndSendResult();
  }
  };
  
