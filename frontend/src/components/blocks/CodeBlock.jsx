// src/components/blocks/CodeBlock.jsx
import React from "react";

const CodeBlock = ({ language = "text", text }) => {
  return (
    <div className="rounded border p-3 bg-gray-900 text-green-200 overflow-auto">
      <div className="text-xs text-gray-300 mb-2">Language: {language}</div>
      <pre className="whitespace-pre-wrap"><code>{text}</code></pre>
    </div>
  );
};

export default CodeBlock;
