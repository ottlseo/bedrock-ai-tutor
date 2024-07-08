import React, { useState } from 'react';
import '../../App.css';
import { Radio, Space } from 'antd';
import Chats from '../Chats';
import { isEnglishSentence } from '../utils/validateInput';
import { getSonnetCorrection, getHaikuCorrection } from '../utils/api';

const HomeTab = () => {
    const [userMessage, setUserMessage] = useState('');
    const [haikuTutorMessage, setHaikuTutorMessage] = useState('');
    const [sonnetTutorMessage, setSonnetTutorMessage] = useState('');
    const [tutorGuideMessage, setTutorGuideMessage] = useState('');

    const [modelOption, setModelOption] = useState('both');
    const handleModelChange = (event) => {
        setModelOption(event.target.value);
    };

    const handleTutorMessageChange = async () => {
        if (modelOption === 'both') {
            const haikuResponse = await getHaikuCorrection(userMessage);
            const sonnetResponse = await getSonnetCorrection(userMessage);
            console.log(haikuResponse);
            console.log(sonnetResponse);

            setHaikuTutorMessage(haikuResponse);
            setSonnetTutorMessage(sonnetResponse);

        } else if (modelOption === 'haiku') {
            const haikuResponse = await getHaikuCorrection(userMessage);
            console.log(haikuResponse);
            setHaikuTutorMessage(haikuResponse);
        } else {
            const sonnetResponse = await getSonnetCorrection(userMessage);
            console.log(sonnetResponse);
            setSonnetTutorMessage(sonnetResponse);
        }
    };

    const handleUserMessageChange = (event) => {
        setUserMessage(event.target.value);
    };
    const handleSendMessage = async () => {
        if (!isEnglishSentence(userMessage)) {
            setHaikuTutorMessage('');
            setSonnetTutorMessage('');
            setTutorGuideMessage("문장은 영어로 입력해주세요.");
        // }
        } else if (userMessage.length < 10) {
            setHaikuTutorMessage('');
            setSonnetTutorMessage('');
            setTutorGuideMessage(`너무 짧은 문장에서는 문법 교정의 단서를 찾기가 어려워요.\n10자 이상의 문장으로 시작해보세요!`);
        } else {
            setTutorGuideMessage("이렇게 말해보면 어떨까요?");
            handleTutorMessageChange(); // async?
        }
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div>
            <div className="description">
                <strong>Bedrock AI Tutor</strong>는 문법적으로 틀린 영어 문장 발화 시 올바른 문장으로 교정해주는 서비스입니다.
                <br />
                문법 교정에서 더 나아가, 비즈니스 상황이나 캐주얼한 대화에서 사용하기에 적합한 문장으로 변경해주는 기능을&nbsp;
                <strong className="tabredirect">
                    비즈니스 영어 교정(↗)
                </strong> 탭에서 제공하고 있습니다.
                <br /><br />
                이 데모는 Amazon Transcribe 서비스와 Amazon Bedrock에서 지원하는 Foundation Model 중 ANTROPIC의 Claude Haiku(3.0), Sonnet(3.5) 모델을 사용했으며, <br />
                별도의 모델 개선 작업 없이 Claude 모델에 대한 여러 번의 Prompt Engineering 작업을 통해 구현되었습니다.
                <br /><br />
                <strong className="tabredirect">
                    HOW TO BUILD(↗)
                </strong> 탭에서 해당 데모의 아키텍처와 모델에 사용된 프롬프트를 확인하실 수 있습니다.
                <div className='horizontal'>
                    <div className='menu1'>
                    <Radio.Group 
                        onChange={handleModelChange}
                        defaultValue="both"
                        >
                        <Space direction="vertical">
                            <Radio value="haiku">
                                Haiku 3.0 모델로 이용하기
                            </Radio>
                            <Radio value="sonnet">
                                Sonnet 3.5 모델로 이용하기
                            </Radio>
                            <Radio value="both">
                                비교 모드
                            </Radio>
                        </Space>
                    </Radio.Group>
                    </div>
                    <div className='menu2'>
                    {modelOption === 'both' && (
                        <Chats
                            userMessage={userMessage}
                            tutorMessage={haikuTutorMessage}
                            tutorMessage2={sonnetTutorMessage}
                            tutorGuideMessage={tutorGuideMessage}
                            handleUserMessageChange={handleUserMessageChange}
                            handleSendMessage={handleSendMessage}
                            handleKeyDown={handleKeyDown}
                        />
                    )}
                    {modelOption === 'sonnet' && (
                        <Chats
                            userMessage={userMessage}
                            tutorMessage2={sonnetTutorMessage}
                            tutorGuideMessage={tutorGuideMessage}
                            handleUserMessageChange={handleUserMessageChange}
                            handleSendMessage={handleSendMessage}
                            handleKeyDown={handleKeyDown}
                        />
                    )}
                    {modelOption === 'haiku' && (
                        <Chats
                            userMessage={userMessage}
                            tutorMessage={haikuTutorMessage}
                            tutorGuideMessage={tutorGuideMessage}
                            handleUserMessageChange={handleUserMessageChange}
                            handleSendMessage={handleSendMessage}
                            handleKeyDown={handleKeyDown}
                        />
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeTab;
