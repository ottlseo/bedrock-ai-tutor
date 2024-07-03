import React, { useState } from 'react';
import ChatMessage from '../chat/ChatMessage';
const HomeTab = () => {

    return (
        <div>
            <div class="description">
                <strong>Bedrock AI Tutor</strong>는 문법적으로 틀린 영어 문장 발화 시 올바른 문장으로 교정해주는 서비스입니다. 
                <br/>
                문법 교정에서 더 나아가, 비즈니스 상황이나 캐주얼한 대화에서 사용하기에 적합한 문장으로 변경해주는 기능을&nbsp;
                <strong class="tabredirect">
                    비즈니스 영어 교정(↗)
                </strong> 탭에서 제공하고 있습니다.
                <br/><br/>
                이 데모는 Amazon Transcribe 서비스와 Amazon Bedrock에서 지원하는 Foundation Model 중 ANTROPIC의 Claude Haiku(3.0), Sonnet(3.5) 모델을 사용했으며, <br/>
                별도의 모델 개선 작업 없이 Claude 모델에 대한 여러 번의 Prompt Engineering 작업을 통해 구현되었습니다. 
                <br/><br/>
                <strong class="tabredirect">
                    HOW TO BUILD(↗)
                </strong> 탭에서 해당 데모의 아키텍처와 모델에 사용된 프롬프트를 확인하실 수 있습니다. 
            </div>
            <ChatMessage message="Hello bot!" is_user={true} />
        </div>
    )
};

export default HomeTab;