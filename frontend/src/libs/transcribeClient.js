
import { TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";
import MicrophoneStream from "microphone-stream";
import { StartStreamTranscriptionCommand } from "@aws-sdk/client-transcribe-streaming";
import { Buffer } from "buffer";
import { REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from "./cred.js";

// const SAMPLE_RATE = 9600; // 48000; // 24000; // 16000;
const CHUNK_SIZE = 100; // 청크 크기 (ms)
const SAMPLE_RATE = 48000; // 오디오 샘플링 레이트
const CHUNK_LENGTH = (CHUNK_SIZE / 1000) * SAMPLE_RATE * 2; // 청크 길이 (바이트)
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
        const noOfResults = result.Alternatives[0].Items.length;
        let transcriptionResult = "";
        for (let i = 0; i < noOfResults; i++) {
          transcriptionResult = result.Alternatives[0].Items[i].Content;
          console.log(transcriptionResult);
          transcriptionResult += " ";
          callback(transcriptionResult, languageIdentifications);
        }
      }
      
    }
  }
}

const getAudioStream = async function* () {
  let buffer = Buffer.alloc(0); // 버퍼 초기화

  for await (const chunk of microphoneStream) {
    buffer = Buffer.concat([buffer, chunk]); // 청크를 버퍼에 추가

    while (buffer.length >= CHUNK_LENGTH) {
      const audioChunk = buffer.slice(0, CHUNK_LENGTH); // 청크 길이만큼 버퍼에서 잘라내기
      buffer = buffer.slice(CHUNK_LENGTH); // 버퍼에서 청크 길이만큼 제거

      yield {
        AudioEvent: {
          AudioChunk: encodePCMChunk(audioChunk),
        },
      };
    }
  }
    // if (chunk.length <= SAMPLE_RATE) {
    //   yield {
    //     AudioEvent: {
    //       AudioChunk: encodePCMChunk(chunk),
    //     },
    //   };
    // }
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
