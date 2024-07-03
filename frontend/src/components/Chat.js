import React, { useState } from 'react';
import styled from 'styled-components';

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
  margin-bottom: 16px;
  align-self: flex-end;
  max-width: 70%;
  font-size: 1rem;
  width: 70%;
  min-height: 15rem;
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
    padding: 8px 16px;
    margin-top: 8px;
    cursor: pointer;
  }
`;

const TutorBubble = styled.div`
  background-color: #60aef7;
  padding: 16px;
  border-radius: 24px 24px 24px 0;
  margin-bottom: 1rem;
  max-width: 70%;
  font-size: 1rem;
  color: black;
  width: 70%;
  height: 10rem;
  min-height: 20rem;
`;
const TutorGuideText = styled.div`
    color: white;
    margin: 0 2rem 1rem 2rem;
    font-size: 1.1rem;
    padding-bottom: .5rem;
    border-bottom: 1.5px solid white;
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