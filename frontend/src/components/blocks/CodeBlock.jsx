import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import "./CodeBlock.css";

const CodeBlock = ({ language = "code", text = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Use modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-secure contexts
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="code-block-container">
      <div className="code-block-header">
        <span className="code-language">{language.toUpperCase()}</span>
        <button
          onClick={handleCopy}
          className="code-copy-btn"
          title="Copy code"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check size={16} className="icon" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={16} className="icon" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="code-block-pre">
        <code className="code-block-code">{text}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;