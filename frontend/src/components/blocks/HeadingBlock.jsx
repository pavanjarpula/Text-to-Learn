import React from "react";
import "./HeadingBlock.css";

const HeadingBlock = ({ text, level = 2 }) => {
  const HeadingTag = `h${Math.min(Math.max(level, 1), 6)}`;

  return (
    <HeadingTag className="heading-block">
      {text}
    </HeadingTag>
  );
};

export default HeadingBlock;
