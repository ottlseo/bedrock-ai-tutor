import React from 'react';
import styled from 'styled-components';
import botIcon1 from '../assets/bot1.png';
import botIcon2 from '../assets/bot2.png';

const TutorBubble = styled.div`
  background-color: ${props => props.ui === 'blue' ? '#60aef7' : '#81c147'};
  color: white;
  padding: 1rem;
  border-radius: 24px 24px 24px 0;
  margin-bottom: 1rem;
  max-width: 75%;
  font-size: 1rem;
  color: black;
  width: 70%;
  height: 10rem;
  min-height: 16rem;
  display: flex;
  align-items: flex-start;
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
  width: 50px;
  height: 50px;
  margin-right: 1rem;
  align-self: flex-end;
`;

const TutorChat = ({guideMessage, message, ui='blue'}) => {
    return (
        <TutorBubble ui={ui}>
            <BotIcon src={ui === "blue" ? botIcon2 : botIcon1} alt="Bot Image" /> 
            { guideMessage ?
                <TutorGuideText>
                    {guideMessage}
                </TutorGuideText> 
                : <></> 
            }
            {message}
        </TutorBubble>
    );
}

export default TutorChat;
