import React from 'react';
import styled from 'styled-components';
import TutorChat from './TutorChat';

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

const SONNET_UI="green";
const HAIKU_UI="blue";

const Chats = ({
    userMessage,
    tutorMessage='',
    tutorMessage2='',
    tutorGuideMessage='',
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
                {
                  tutorMessage && tutorMessage2 ?
                    <>    
                      <TutorChat 
                        guideMessage={tutorGuideMessage}
                        message={tutorMessage}
                        ui={HAIKU_UI}
                      />
                      <TutorChat 
                        guideMessage={tutorGuideMessage}
                        message={tutorMessage2}
                        ui={SONNET_UI}
                      />
                    </>
                    : tutorMessage ? 
                      <>
                        <TutorChat 
                          guideMessage={tutorGuideMessage}
                          message={tutorMessage}
                          ui={HAIKU_UI}
                        />
                      </> 
                      : tutorMessage2 ? 
                      <>
                        <TutorChat 
                          guideMessage={tutorGuideMessage}
                          message={tutorMessage2}
                          ui={SONNET_UI}
                        />
                      </> 
                      : <></>
                }
            </BubbleContainer>
        </ChatContainer>
    );
}

export default Chats;