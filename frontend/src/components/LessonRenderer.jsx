// src/components/LessonRenderer.jsx
import React from "react";
import HeadingBlock from "./blocks/HeadingBlock";
import ParagraphBlock from "./blocks/ParagraphBlock";
import CodeBlock from "./blocks/CodeBlock";
import VideoBlock from "./blocks/VideoBlock";
import MCQBlock from "./blocks/MCQBlock";

const blockMap = {
  heading: HeadingBlock,
  paragraph: ParagraphBlock,
  code: CodeBlock,
  video: VideoBlock,
  mcq: MCQBlock,
};

const LessonRenderer = ({ content = [] }) => {
  return (
    <div className="lesson-renderer space-y-4">
      {content.map((block, idx) => {
        const BlockComp = blockMap[block.type] || (() => <pre>{JSON.stringify(block)}</pre>);
        return <BlockComp key={idx} {...block} />;
      })}
    </div>
  );
};

export default LessonRenderer;
