import React from "react";
import HeadingBlock from "./blocks/HeadingBlock";
import ParagraphBlock from "./blocks/ParagraphBlock";
import CodeBlock from "./blocks/CodeBlock";
import VideoBlock from "./blocks/VideoBlock";
import MCQBlock from "./blocks/MCQBlock";
import { Goal } from 'lucide-react'; // Icon for objectives

const blockMap = {
  heading: HeadingBlock,
  paragraph: ParagraphBlock,
  code: CodeBlock,
  video: VideoBlock,
  mcq: MCQBlock,
};

// LessonRenderer now accepts objectives as a prop
const LessonRenderer = ({ objectives = [], content = [] }) => {
  return (
    <div className="max-w-4xl mx-auto py-8">
        
        {/* Objectives Section (Styled as a key takeaway box) */}
        {objectives.length > 0 && (
            <div className="mb-10 p-6 bg-blue-50 border-t-4 border-blue-500 rounded-lg shadow-inner">
                <h2 className="text-2xl font-bold mb-3 text-blue-800 flex items-center">
                    <Goal className="w-6 h-6 mr-3 text-blue-500" />
                    Lesson Objectives
                </h2>
                <ul className="list-disc ml-6 text-gray-700 space-y-2">
                    {objectives.map((obj, idx) => (
                        <li key={idx} className="text-base">{obj}</li>
                    ))}
                </ul>
            </div>
        )}

        {/* Content Rendering */}
        <div className="lesson-content space-y-10">
            {content.map((block, idx) => {
                const BlockComp = blockMap[block.type] || (() => <pre className="p-4 bg-red-50 text-red-700 rounded">Invalid Block Type: {JSON.stringify(block)}</pre>);
                return <BlockComp key={idx} {...block} />;
            })}
        </div>
    </div>
  );
};

export default LessonRenderer;
