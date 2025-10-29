import React, { useState, useEffect } from "react";
import { Copy, Check, AlertCircle } from "lucide-react";
import "./CodeBlock.css";

const CodeBlock = ({ language = "javascript", code = "", text = "" }) => {
  const [copied, setCopied] = useState(false);

  // Use 'code' field first, fallback to 'text' field
  let codeContent = code || text || "";

  // 🔧 FIX: Handle escaped newlines from backend
  if (typeof codeContent === "string") {
    codeContent = codeContent
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\r/g, "\r")
      .trim();
  }

  // 🔍 Enhanced debug logging
  useEffect(() => {
    console.group("📝 CodeBlock Debug Info");
    console.log("Language:", language);
    console.log("Code provided (from props):", !!code);
    console.log("Text provided (from props):", !!text);
    console.log("Code length:", codeContent.length);
    console.log("Is empty:", codeContent === "");
    console.log("First 50 chars:", codeContent.substring(0, 50));
    console.log("Full content:", codeContent);
    console.groupEnd();
  }, [code, text, codeContent, language]);

  const isEmpty = !codeContent || codeContent === "";

  const handleCopy = async () => {
    if (isEmpty) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(codeContent);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = codeContent;
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
      console.error("❌ Failed to copy:", err);
    }
  };

  // 🔴 Empty state
  if (isEmpty) {
    return (
      <div className="code-block-container code-block-empty">
        <div className="code-block-header">
          <span className="code-language">{language.toUpperCase()}</span>
          <span className="code-status-badge">Empty</span>
        </div>
        <div className="code-block-empty-state">
          <AlertCircle size={20} />
          <p>No code content available for this block</p>
          <small>Check that the backend is sending the 'code' or 'text' field with actual content</small>
        </div>
      </div>
    );
  }

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
        <code className="code-block-code">{codeContent}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
