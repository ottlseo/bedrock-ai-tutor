import React, { useState } from 'react';
import styled from 'styled-components';
import botIcon1 from '../assets/bot1.png';
import botIcon2 from '../assets/bot2.png';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
`;

const BubbleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
`;

const UserBubble = styled.div`
  background-color: #e0e0e0;
  padding: 1.2rem;
  border-radius: 24px 24px 0 24px;
  margin-bottom: 1rem;
  align-self: flex-end;
  max-width: 75%;
  font-size: 1rem;
  width: 70%;
  min-height: 13rem;
  position: relative;
  display: flex;
  flex-direction: column;

  textarea {
    flex: 1;
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 16px;
    resize: none;
  }

  button {
    align-self: flex-end;
    background-color: white;
    color: #0084ff;
    border: none;
    border-radius: 4px;
    padding: .5rem 1rem;
    margin-top: .5rem;
    cursor: pointer;
  }
`;

const TutorBubble = styled.div`
  background-color: #60aef7;
  padding: 1rem;
  border-radius: 24px 24px 24px 0;
  margin-bottom: 1rem;
  max-width: 75%;
  font-size: 1rem;
  color: black;
  width: 70%;
  height: 10rem;
  min-height: 16rem;
  display: flex; /* 이미지와 텍스트를 가로로 정렬하기 위해 추가 */
  align-items: flex-end; /* 아래 기준선에 맞춤 */
`;

const TutorGuideText = styled.div`
    color: white;
    margin: 0 2rem 1rem 2rem;
    font-size: .87rem;
    font-weight: 700;
    padding-bottom: .5rem;
    border-bottom: 1.5px solid white;
`;

const BotIcon = styled.img`
  width: 50px; /* 이미지 크기 조절 */
  height: 50px;
  margin-right: 1rem; /* TutorBubble과의 간격 */
  align-self: flex-end; /* 아래 기준선에 맞춤 */
`;

const Chat = ({
    userMessage,
    tutorMessage,
    tutorGuideMessage,
    handleUserMessageChange,
    handleSendMessage,
    handleKeyDown
}) => {
    return (
        <ChatContainer>
            <BubbleContainer>
                <UserBubble>
                    <textarea
                        value={userMessage}
                        onChange={handleUserMessageChange}
                        placeholder="영어 문장을 입력해보세요."
                        onKeyDown={handleKeyDown}
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </UserBubble>
                <TutorBubble>
                    <BotIcon src={botIcon2} alt="Bot Image" /> 
                    { tutorGuideMessage 
                        ? <TutorGuideText>
                                {tutorGuideMessage}
                            </TutorGuideText> 
                        : <></> 
                    }
                    {tutorMessage}
                </TutorBubble>
            </BubbleContainer>
        </ChatContainer>
    );
}

export default Chat;