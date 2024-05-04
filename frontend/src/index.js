import * as TranscribeClient from "./libs/transcribeClient.js";
import * as RoleTabHandler from './handlers/roleTabHandler.js';
import * as ModelComparisonTabHandler from './handlers/modelComparisonTabHandler.js';
import * as HomeTabHandler from './handlers/homeTabHandler.js';
import { getCurrentPrompt } from "./handlers/moreInfoTabHandler.js";

// Set default Tab when loading page
const defaultTab = document.getElementById("defaultOpen");

window.onload = () => {
  openTab(null, 'homeTab');
  defaultTab.className += " active";
}

// Handle changing tabs
window.openTab = (event, tabName) => {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  if (event) {
    event.currentTarget.className += " active"; 
  }
}

// Handle Home tab
window.onRecordPressAtHomeTab = () => {
  const recordButton = document.getElementById("homeTabRecord");
  
  if (recordButton.getAttribute("class") === "recordInactive") {
    HomeTabHandler.resetSetting();
    HomeTabHandler.startRecording();
  } else {
    recordButton.setAttribute("class", "recordInactive");
    TranscribeClient.stopRecording();
    HomeTabHandler.stopRecordingAndSendResult();
  }
}

// Handle Model comparison tab 
window.onRecordPressAtModelTab = () => {
  const recordButton = document.getElementById("modelTabRecord");
  
  if (recordButton.getAttribute("class") === "recordInactive") {
    ModelComparisonTabHandler.resetSetting();
    ModelComparisonTabHandler.startRecording();
  } else {
    recordButton.setAttribute("class", "recordInactive");
    TranscribeClient.stopRecording();
    ModelComparisonTabHandler.stopRecordingAndSendResult();
  }
};

// Handle Business/Casual tab 
window.onRecordPressAtRoleTab = () => {
  const recordButton = document.getElementById("roleTabRecord");
  
  if (recordButton.getAttribute("class") === "recordInactive") {
    RoleTabHandler.resetSetting();
    RoleTabHandler.startRecording();
  } else {
    recordButton.setAttribute("class", "recordInactive");
    TranscribeClient.stopRecording();
    RoleTabHandler.stopRecordingAndSendResult();
  }
  };

// Show current prompt in More Info tab
const promptBox = document.getElementById("promptBox");
promptBox.innerHTML = getCurrentPrompt();
  