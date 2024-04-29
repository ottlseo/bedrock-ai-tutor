
import { TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";
import MicrophoneStream from "microphone-stream";
import { StartStreamTranscriptionCommand } from "@aws-sdk/client-transcribe-streaming";
import { Buffer } from "buffer";
import { REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from "./cred.js";

const SAMPLE_RATE = 44100;
let microphoneStream = undefined;
let transcribeClient = undefined;

// credentials
const currentCredentials = {
  'accessKeyId': AWS_ACCESS_KEY_ID,
  'secretAccessKey': AWS_SECRET_ACCESS_KEY
};

export const startRecording = async (callback, isLanguageIdentifyOn = false) => {
    if (microphoneStream || transcribeClient) {
      stopRecording();
    }
    createTranscribeClient();
    createMicrophoneStream();
    if (isLanguageIdentifyOn) {
      await startStreaming(callback, true);
    } else {
      await startStreaming(callback);
    }
};

export const stopRecording = () => {
  if (microphoneStream) {
    microphoneStream.stop();
    microphoneStream.destroy();
    microphoneStream = undefined;
  }
  if (transcribeClient) {
    transcribeClient.destroy();
    transcribeClient = undefined;
  }
};

const createTranscribeClient = () => {
  transcribeClient = new TranscribeStreamingClient({
    region: REGION,
    credentials: currentCredentials
  });
}

const createMicrophoneStream = async () => {
  microphoneStream = new MicrophoneStream.default();
  microphoneStream.setStream(
    await window.navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    })
  );
}

const startStreaming = async (callback, isLanguageIdentifyOn = false) => {
  const languageIdentifications = [];
  const command = isLanguageIdentifyOn ? 
    new StartStreamTranscriptionCommand({
      IdentifyLanguage: true,
      LanguageOptions: "en-US,ko-KR",
      MediaEncoding: "pcm",
      MediaSampleRateHertz: SAMPLE_RATE,
      AudioStream: getAudioStream(),
    }) : 
    new StartStreamTranscriptionCommand({
      LanguageCode: "en-US",
      MediaEncoding: "pcm",
      MediaSampleRateHertz: SAMPLE_RATE,
      AudioStream: getAudioStream(),
    });
  
  const data = await transcribeClient.send(command);
  for await (const event of data.TranscriptResultStream) {
    for (const result of event.TranscriptEvent.Transcript.Results || []) {
      
      if (result.IsPartial === false) {

        // Get LanguageIdentification from response & Calculate final score
        if (isLanguageIdentifyOn) {
          languageIdentifications = result.LanguageIdentification;
          console.log(languageIdentifications); // print main language's code
            
          if (!languageIdentifications) {
            languageIdentifications = [
              {LanguageCode: 'en-US', Score: 0.0},
              {LanguageCode: 'ko-KR', Score: 0.0}
            ];
          }
        }
        // Get stream from the response
        const noOfResults = result.Alternatives[0].Items.length;
        let transcriptionResult = "";
        for (let i = 0; i < noOfResults; i++) {
          transcriptionResult = result.Alternatives[0].Items[i].Content;
          console.log(transcriptionResult);
          transcriptionResult += " ";

          if (isLanguageIdentifyOn) {
            callback(transcriptionResult, languageIdentifications);
          } else {
            callback(transcriptionResult);
          }
        }
      }
    }
  }
}

const getAudioStream = async function* () {
  for await (const chunk of microphoneStream) {
    if (chunk.length <= SAMPLE_RATE) {
      yield {
        AudioEvent: {
          AudioChunk: encodePCMChunk(chunk),
        },
      };
    }
  }
};

const encodePCMChunk = (chunk) => {
  const input = MicrophoneStream.default.toRaw(chunk);
  let offset = 0;
  const buffer = new ArrayBuffer(input.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return Buffer.from(buffer);
};