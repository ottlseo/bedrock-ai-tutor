import { useEffect, useState } from 'react'

import {
	BrowserRouter as Router,
	Routes,
	Route
} from "react-router-dom";

import {
	ContentLayout,
	Header,
	SpaceBetween,
	Button,
	Container,
} from '@cloudscape-design/components';
import '@cloudscape-design/global-styles/index.css';

import './App.css'
import { Transcript, CredentialsDataType } from './types';
import LiveTranscriptions from './components/LiveTranscriptions';

import '@aws-amplify/ui-react/styles.css';
import { TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";

const accessKeyId = import.meta.env.ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.SECRET_ACCESS_KEY;
const region = "us-east-1";

function App() {
	const currentCredentials: CredentialsDataType = {
		accessKeyId: accessKeyId,
		secretAccessKey: secretAccessKey
	};
	
	const [transcriptionClient, setTranscriptionClient] = useState<TranscribeStreamingClient | null>(null);
	const [transcribeStatus, setTranscribeStatus] = useState<boolean>(false);
	const [transcript, setTranscript] = useState<Transcript>();
	const [lines, setLines] = useState<Transcript[]>([]);
	const [currentLine, setCurrentLine] = useState<Transcript[]>([]);
	const [mediaRecorder, setMediaRecorder] = useState<AudioWorkletNode>();

	useEffect(() => {
		if (transcript) {
			setTranscript(transcript);
			if (transcript.partial) {
				setCurrentLine([transcript]);
			} else {
				setLines([...lines, transcript]);
				setCurrentLine([]);
			}
		}
	}, [transcript])
	
	const formFields = {
		signUp: {
			email: {
				order: 1,
				isRequired: true,
			},
			name: {
				order: 2,
				isRequired: true,
			},
			password: {
				order: 3,
			},
			confirm_password: {
				order: 4,
			},
		},
	};

	const handleTranscribe = async () => {
		setTranscribeStatus(!transcribeStatus);
		if (transcribeStatus) {
			console.log("Stopping transcription")
		} else {
			console.log("Starting transcription")
		}
		return transcribeStatus;
	};

	return (
		<Router>
				<>
						<Routes>
							<Route path="/" element={<>
									<ContentLayout
										header={
											<SpaceBetween size="m">
												<Header
													variant="h1"
													description="Demo of live transcriptions"
													actions={
														<SpaceBetween direction="horizontal" size="m">															
															<Button variant='primary' onClick={handleTranscribe}>
																{ transcribeStatus ? "Stop Transcription" : "Start Transcription" } 
															</Button>

														</SpaceBetween>
													}
												>
													Amazon Transcribe Live Transcriptions
												</Header>
											</SpaceBetween>
										}
									>
										<Container
													header={
														<Header
															variant="h2"
														>
															Transcriptions
														</Header>
													}
											>
												<SpaceBetween size='xs'>
													<div style={{height: '663px'}} className={"transcriptionContainer"}>
														{lines.map((line, index) => {
																return (
																	<div key={index}>
																		<strong>Channel {line.channel}</strong>: {line.text}
																		<br/>
																	</div>
																)
															})
														}
														{currentLine.length > 0 && 
															currentLine.map((line, index) => {
																return (
																	<div key={index}>
																		<strong>Channel {line.channel}</strong>: {line.text}
																		<br/>
																	</div>
																)
															})
														}
													</div>
												</SpaceBetween>
										</Container>

									</ContentLayout>
									<LiveTranscriptions
										currentCredentials={currentCredentials}
										mediaRecorder={mediaRecorder}
										setMediaRecorder={setMediaRecorder}
										setTranscriptionClient={setTranscriptionClient}
										transcriptionClient={transcriptionClient}
										transcribeStatus={transcribeStatus}
										setTranscript={setTranscript}
									/>
								</>
							}/>
						</Routes>
					</>
				
		</Router>
	);
}

export default App;