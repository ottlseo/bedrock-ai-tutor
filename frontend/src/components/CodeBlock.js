import React, { useState } from 'react';
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

const CodeBlock = ({code}) => {
    return (
        <Editor
            value={code}
            padding={10}
            highlight={(code) => highlight(code, languages.js)}
            style={{
                width: '60%',
                // height: "20rem",
                // overflowY: true,
                fontFamily: "monospace",
                fontSize: '.8rem',
                border: "1px solid black",
                borderRadius: "15px",
                margin: '2rem 8rem',
                padding: '1rem',
                backgroundColor: '#eee',
                color: "rgb(63, 63, 63)"
            }}
        />
    );
}

export default CodeBlock;
