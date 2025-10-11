// src/components/blocks/ParagraphBlock.jsx
import React from "react";

const ParagraphBlock = ({ text }) => {
  return <p className="leading-relaxed text-base whitespace-pre-wrap">{text}</p>;
};

export default ParagraphBlock;
