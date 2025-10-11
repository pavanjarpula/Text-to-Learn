// src/components/blocks/HeadingBlock.jsx
import React from "react";

const HeadingBlock = ({ text, level = 2 }) => {
  const Tag = `h${Math.min(Math.max(level, 1), 6)}`;
  return <Tag className="font-bold text-xl mt-2 mb-1">{text}</Tag>;
};

export default HeadingBlock;
