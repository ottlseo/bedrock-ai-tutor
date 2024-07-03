import React, { useState } from 'react';
const BusinessGuideTab = () => {

    return (
        <div>
            <div class="description">
              친한 친구끼리 하는 일상 대화나, 혹은 회사와 같은 비즈니스 상황에서 사용해야 하는 표현이 영어에서도 각기 다르게 존재합니다. <br/>
              이 섹션의 데모는 Input으로 들어온 문장에 대해 틀린 문법 교정은 물론, <strong>Casual한 대화</strong> 및 <strong>Business 상황에 사용하기 적합</strong>한 각각의 문장으로 바꾸어줍니다. <br/><br/>
              해당 데모에는 Claude 3.5 Sonnet 모델이 사용되었습니다. 
            </div> 
        </div>
    )
};

export default BusinessGuideTab;