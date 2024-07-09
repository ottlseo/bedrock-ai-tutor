import React from 'react';
import styled from 'styled-components';
import botIcon1 from '../assets/bot1.png';
import botIcon2 from '../assets/bot2.png';
import { MILLION } from './utils/variables';

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
  height: auto;
  min-height: 16rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const TutorGuideText = styled.div`
  color: white;
  font-size: .87rem;
  font-weight: 700;
  padding-bottom: .5rem;
  border-bottom: 1.5px solid white;
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
`;

const BotIcon = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 1rem;
  align-self: flex-end;
`;

const TutorMessageWrapper = styled.div`
  text-align: center;
`;

const PriceLabelWrapper = styled.div`
  color: white;
  align-self: flex-start; 
  margin-top: auto; 
  padding: 1rem;
  font-size: .87rem;
`;

const Emphasized = styled.strong`
  color: rgb(236, 50, 50);
  text-decoration: underlined;
`;

const TutorChat = ({guideMessage, message, price=0.0, ui='blue'}) => {
    return (
        <TutorBubble ui={ui}>
            <BotIcon src={ui === "blue" ? botIcon2 : botIcon1} alt="Bot Image" /> 
            { guideMessage ?
                <TutorGuideText>
                    {guideMessage}
                </TutorGuideText> 
                : <></> 
            }
            <TutorMessageWrapper>
                {message}
            </TutorMessageWrapper>
            
            { price > 0.0 ? 
                <PriceLabelWrapper>
                    <div>👉 Total price for this call = <strong>${price}</strong></div>
                    <div>👉 Total price x 1 MILLION = <Emphasized>${price*MILLION}</Emphasized></div>
                </PriceLabelWrapper>
                : <></>
            }
        </TutorBubble>
    );
}

export default TutorChat;
