import React, { useState } from 'react';
import '../../App.css';
import ArchitectureImage from '../../assets/architecture.png';
import { haikuPrompt, sonnetPrompt } from '../utils/getPrompts';
import CodeBlock from '../CodeBlock';

const HowToBuildTab = () => {

    return (
        <div class="more-info-tab">
            <div class="wrapper">
                <div class="headerText">
                    <h2 class="sectionLabel">Source code</h2>
                </div>
                <div id="code-redirect">
                    <a href="https://github.com/ottlseo/bedrock-ai-tutor" target='_blank'>
                        Github[↗]
                    </a>
                </div>
            </div>
            <div class="wrapper">
                <div id="arch-redirect" class="headerText">
                    <h2 class="sectionLabel">Architecture</h2>
                </div>
                <img src={ArchitectureImage} width="70%" />
            </div>
            <div class="wrapper">
                <div id="prompt-redirect" class="headerText">
                    <h2 class="sectionLabel">사용된 Prompt</h2>
                </div>
                <h4>Haiku 3.0</h4>
                <CodeBlock code={haikuPrompt} />
                <h4>Sonnet 3.0</h4>
                <CodeBlock code={sonnetPrompt} />
            </div>
        </div>
    )
};

export default HowToBuildTab;
