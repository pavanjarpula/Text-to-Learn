import React from "react";
import { Copy, Check } from 'lucide-react';

const CodeBlock = ({ language, text }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        // Fallback for document.execCommand('copy') in restricted environments
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden font-mono text-sm relative">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-800 text-gray-400">
                <span className="uppercase text-xs font-semibold">{language || 'Code'}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center text-xs font-medium hover:text-white transition duration-150"
                >
                    {copied ? (
                        <>
                            <Check className="w-3 h-3 mr-1 text-green-400" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="w-3 h-3 mr-1" />
                            Copy code
                        </>
                    )}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto text-white whitespace-pre-wrap leading-relaxed">
                <code className="block">{text}</code>
            </pre>
        </div>
    );
};

export default CodeBlock;