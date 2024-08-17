import React, { useState } from 'react';
import Chats from '../Chats';
import { isEnglishSentence } from '../utils/validateInput';
import { getBusinessCorrection, getCasualCorrection } from '../utils/api';

const BusinessGuideTab = () => {
    const [userMessage, setUserMessage] = useState('');
    const [tutorMessage, setTutorMessage] = useState('');

    const [tutorGuideMessage, setTutorGuideMessage] = useState('');
    const [businessCorrectionMessage, setBusinessCorrectionMessage] = useState('');
    const [casualCorrectionMessage, setCasualCorrectionMessage] = useState('');
    
    const [correctionOption, setCorrectionOption] = useState('both');
    const handleModelChange = (event) => {
        setCorrectionOption(event.target.value);
    };

    const handleTutorMessageChange = async () => {
        if (correctionOption === 'both') {
            const businessResponse = await getBusinessCorrection(userMessage);
            const casualResponse = await getCasualCorrection(userMessage);
            console.log(businessResponse);
            console.log(casualResponse);
            setBusinessCorrectionMessage(businessResponse?.correction ?? "");
            setCasualCorrectionMessage(casualResponse?.correction ?? "");

        } else if (correctionOption === 'business') {
            const businessResponse = await getBusinessCorrection(userMessage);
            console.log(businessResponse);
            setBusinessCorrectionMessage(businessResponse?.correction ?? "");

        } else {
            const casualResponse = await getCasualCorrection(userMessage);
            console.log(casualResponse);
            setCasualCorrectionMessage(casualResponse?.correction ?? "");
        }
    };

    const handleUserMessageChange = (event) => {
        setUserMessage(event.target.value);
    };
    const handleSendMessage = async () => {
        if (!isEnglishSentence(userMessage)) {
            setTutorMessage('');
            setTutorGuideMessage("문장은 영어로 입력해주세요.");
        // }
        } else if (userMessage.length < 10) {
            setTutorMessage('');
            setTutorGuideMessage(`너무 짧은 문장에서는 문법 교정의 단서를 찾기가 어려워요.\n10자 이상의 문장으로 시작해보세요!`);
        } else {
            setTutorGuideMessage("이렇게 말해보면 어떨까요?");
            handleTutorMessageChange();
        }
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };
    return (
        <div>
            <div class="description">
              친한 친구끼리 하는 일상 대화나, 혹은 회사와 같은 비즈니스 상황에서 사용해야 하는 표현이 영어에서도 각기 다르게 존재합니다. <br/>
              이 섹션의 데모는 Input으로 들어온 문장에 대해 틀린 문법 교정은 물론, <strong>Casual한 대화</strong> 및 <strong>Business 상황에 사용하기 적합</strong>한 각각의 문장으로 바꾸어줍니다. <br/><br/>
              해당 데모에는 Claude 3.5 Sonnet 모델이 사용되었습니다. 
            </div> 
            <div>
                <div className='custom-radio-group'>
                    <label>
                        <input 
                            type="radio" 
                            className='custom-radio'
                            value='business'
                            checked={correctionOption === 'business'}
                            onChange={handleModelChange}
                        /> 비즈니스 상황에 적합한 문장 보기 <br/>
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            className='custom-radio'
                            value='casual'
                            checked={correctionOption === 'casual'}
                            onChange={handleModelChange}
                        /> 일상 대화에 적합한 문장 보기 <br/>
                    </label>
                    <label>
                        <input 
                            type='radio'
                            className='custom-radio'
                            value="both"
                            defaultChecked
                            checked={correctionOption === "both"}
                            onChange={handleModelChange}
                        /> 비교 모드 <br/>
                    </label>
                </div>
                <div>
                {correctionOption === 'both' && (
                    <Chats
                        userMessage={userMessage}
                        tutorMessage={businessCorrectionMessage}
                        tutorMessage2={casualCorrectionMessage}
                        tutorGuideMessage={tutorGuideMessage}
                        handleUserMessageChange={handleUserMessageChange}
                        handleSendMessage={handleSendMessage}
                        handleKeyDown={handleKeyDown}
                    />
                )}
                {correctionOption === 'casual' && (
                    <Chats
                        userMessage={userMessage}
                        tutorMessage2={casualCorrectionMessage}
                        tutorGuideMessage={tutorGuideMessage}
                        handleUserMessageChange={handleUserMessageChange}
                        handleSendMessage={handleSendMessage}
                        handleKeyDown={handleKeyDown}
                    />
                )}
                {correctionOption === 'business' && (
                    <Chats
                        userMessage={userMessage}
                        tutorMessage={businessCorrectionMessage}
                        tutorGuideMessage={tutorGuideMessage}
                        handleUserMessageChange={handleUserMessageChange}
                        handleSendMessage={handleSendMessage}
                        handleKeyDown={handleKeyDown}
                    />
                )}
                </div>
            </div>
        </div>
    )
};

export default BusinessGuideTab;