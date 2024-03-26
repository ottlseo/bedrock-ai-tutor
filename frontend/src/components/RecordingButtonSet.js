import { useState } from "react";

import {
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand,
} from "@aws-sdk/client-transcribe-streaming";
import MicrophoneStream from "microphone-stream";
import { Buffer } from "buffer";

window.Buffer = Buffer;
// window.process = {
//   env: {
//     ACCESS_KEY_ID: 'ASIAYS2NVD7TEF2FRXFI',
//     SECRET_ACCESS_KEY: 'VEoUK1i/6bZ+e/5d8YEL5MoYe3U8snZ7wmEHm89F'
//   }
// } 

const RecordingButtonSet = () => {
  const region = "us-east-1";
  const accessKeyId = "ASIAYS2NVD7TEF2FRXFI";
  const secretAccessKey = "VEoUK1i/6bZ+e/5d8YEL5MoYe3U8snZ7wmEHm89F";

  let microphoneStream = undefined;
  let transcribeClient = undefined;
  const language = "en-US";
  const SAMPLE_RATE = 44100;
  
  const [transcription, setTranscription] = useState("");
  
  const createMicrophoneStream = async () => {
    microphoneStream = new MicrophoneStream();
    microphoneStream.setStream(
      await window.navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      })
    );
  };
  
  const createTranscribeClient = () => {
    transcribeClient = new TranscribeStreamingClient({
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
  };
  
  const encodePCMChunk = (chunk) => {
    const input = MicrophoneStream.toRaw(chunk);
    let offset = 0;
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return Buffer.from(buffer);
  };
  
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
  
  const startStreaming = async (language, callback) => {
    const command = new StartStreamTranscriptionCommand({
      LanguageCode: language,
      MediaEncoding: "pcm",
      MediaSampleRateHertz: SAMPLE_RATE,
      AudioStream: getAudioStream(),
    });
    const data = await transcribeClient.send(command);
    for await (const event of data.TranscriptResultStream) {
      const results = event.TranscriptEvent.Transcript.Results;
      if (results.length && !results[0]?.IsPartial) {
        const newTranscript = results[0].Alternatives[0].Transcript;
        console.log(newTranscript);
        callback(newTranscript + " ");
      }
    }
  };
  
  const startRecording = async (callback) => {
    if (!region || !accessKeyId || !secretAccessKey) {
      alert("Set AWS env variables first.");
      return false;
    }
  
    if (microphoneStream || transcribeClient) {
      stopRecording();
    }
    createTranscribeClient();
    createMicrophoneStream();
    await startStreaming(language, callback);
  };
  
  const stopRecording = () => {
    if (microphoneStream) {
      microphoneStream.stop();
      microphoneStream.destroy();
      microphoneStream = undefined;
    }
  };

  return (
    <div>
      <button onClick={async () => {
        await startRecording((text) => {
          console.log("STARTED");
          console.log(text);
          setTranscription(text); // need fix
        });
      }}>
      START BUTTON
      </button>
      
      <button onClick={() => {
        console.log("STOPPED");
        stopRecording();
        setTranscription("");
      }}>
      STOP BUTTON
      </button>
      
      <div>{transcription}</div>
    </div>
  );
}
export default RecordingButtonSet;