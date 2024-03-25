import { useEffect, useState } from 'react'
import './App.css';

import { TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";

import LiveTranscriptions from './components/LiveTranscriptions';


const App = () => {
  const [currentCredentials, setCurrentCredentials] = useState({
		accessKeyId: "",
		authenticated: false,
		expiration: undefined,
		identityId: "",
		secretAccessKey: "",
		sessionToken: ""
	});
	const [transcriptionClient, setTranscriptionClient] = useState(null);
	const [transcribeStatus, setTranscribeStatus] = useState(false);
	const [transcript, setTranscript] = useState();
	const [lines, setLines] = useState([]);
	const [currentLine, setCurrentLine] = useState([]);
	const [mediaRecorder, setMediaRecorder] = useState();
	
  return (
    <div className="App">
      <LiveTranscriptions
										currentCredentials={currentCredentials}
										mediaRecorder={mediaRecorder}
										setMediaRecorder={setMediaRecorder}
										setTranscriptionClient={setTranscriptionClient}
										transcriptionClient={transcriptionClient}
										transcribeStatus={transcribeStatus}
										setTranscript={setTranscript}
									/>
    </div>
  );
}

export default App;
