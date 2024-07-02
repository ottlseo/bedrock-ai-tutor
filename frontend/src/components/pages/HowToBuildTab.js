import React, { useState } from 'react';
import '../../App.css';
import ArchitectureImage from '../../assets/architecture.png';
import { haikuPrompt, sonnetPrompt } from '../static/Prompt';
import CodeBlock from '../CodeBlock';

const HowToBuildTab = () => {

    return (
        <div>
            <div id="headerText">
                <div class="sectionLabel more-info-tab">Source code</div>
            </div>
            <div class="">
            <a href="https://github.com/ottlseo/bedrock-ai-tutor" target='_blank'>
                Github[↗]
            </a>
            </div>

            <div id="headerText">
                <div class="sectionLabel more-info-tab">Architecture</div>
            </div>
            <div class="architecture-img">
                <img src={ArchitectureImage} />
            </div>

            <div id="headerText">
                <div class="sectionLabel more-info-tab">사용된 Prompt</div>
            </div>
            <div>
                <CodeBlock code={haikuPrompt} />
            </div>
            <div>
                <CodeBlock code={sonnetPrompt} />
            </div>
        </div>
    )
};

export default HowToBuildTab;
