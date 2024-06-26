/** Transcribe Client which enables Language Identification **/

import { TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";
import MicrophoneStream from "microphone-stream";
import { StartStreamTranscriptionCommand } from "@aws-sdk/client-transcribe-streaming";
import { Buffer } from "buffer";
import { REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from "../../../libs/cred.js";

const SAMPLE_RATE = 48000; // Audio sampling rate = 8000(min) ~ 48000(max)
// const CHUNK_SIZE = 100; // ms
// const CHUNK_LENGTH = (CHUNK_SIZE / 1000) * SAMPLE_RATE * 2; // Byte

let microphoneStream = undefined;
let transcribeClient = undefined;

// credentials
const currentCredentials = {
  'accessKeyId': AWS_ACCESS_KEY_ID,
  'secretAccessKey': AWS_SECRET_ACCESS_KEY
};

export const startRecording = async (callback) => {
    if (microphoneStream || transcribeClient) {
      stopRecording();
    }
    createTranscribeClient();
    createMicrophoneStream();
    await startStreaming(callback);
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

const startStreaming = async (callback) => {
  const command = new StartStreamTranscriptionCommand({
    // LanguageCode: "en-US",
    IdentifyLanguage: true,
    LanguageOptions: "en-US,ko-KR",
    MediaEncoding: "pcm",
    MediaSampleRateHertz: SAMPLE_RATE,
    AudioStream: getAudioStream(),
  });
  const speakingStartedTime = new Date(); // local time before sending the chunk to Transcribe client
  const data = await transcribeClient.send(command);
  for await (const event of data.TranscriptResultStream) {
    for (const result of event.TranscriptEvent.Transcript.Results || []) {
      
      if (result.IsPartial === false) {

        // 1) Get LanguageIdentification from response & Calculate final score
        const languageIdentifications = result.LanguageIdentification;
        console.log(languageIdentifications); // print main language's code
          
        if (!languageIdentifications) {
          languageIdentifications = [
            {LanguageCode: 'en-US', Score: 0.0},
            {LanguageCode: 'ko-KR', Score: 0.0}
          ];
        }
        // 2) Get stream from the response
        const alternative = result.Alternatives[0];
        const noOfResults = alternative.Items.length;

        // Calculate a latency from the last chunk
        const { StartTime, EndTime } = alternative.Items.at(-1);
        const resultReceivedTime = new Date();
        console.log(`Transcript: ${alternative.Transcript}`);
        console.log(`A (해당 문장을 말하는 데 걸린 시간): ${EndTime*1000} ms`);
        console.log(`B (발화 시작한 시점으로부터 Transcript를 받아오기까지 걸린 시간): ${resultReceivedTime - speakingStartedTime} ms`);
        console.log(`A-B (Latency): ${(resultReceivedTime - speakingStartedTime) - EndTime*1000} ms`);
        console.log(`=======================`);

        let transcriptionResult = "";
        for (let i = 0; i < noOfResults; i++) {
          transcriptionResult = result.Alternatives[0].Items[i].Content;
          transcriptionResult += " ";
          callback(transcriptionResult, languageIdentifications);
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