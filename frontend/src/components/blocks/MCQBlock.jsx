// src/components/blocks/MCQBlock.jsx
import React, { useState } from "react";

const MCQBlock = ({ question, options = [], answer, explanation }) => {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const submit = () => setShowResult(true);

  return (
    <div className="p-3 border rounded">
      <div className="font-semibold mb-2">{question}</div>
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => (
          <label
            key={i}
            className={`p-2 rounded cursor-pointer border ${showResult ? (i === answer ? "bg-green-200" : selected === i ? "bg-red-200" : "") : ""}`}
          >
            <input
              type="radio"
              name={question}
              checked={selected === i}
              onChange={() => setSelected(i)}
              className="mr-2"
            />
            {opt}
          </label>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={submit}>Check</button>
        {showResult && (
          <div className="ml-2">
            {selected === answer ? (
              <div className="text-green-700">Correct ✅</div>
            ) : (
              <div className="text-red-700">Wrong ❌</div>
            )}
            {explanation && <div className="text-sm text-gray-700 mt-1">{explanation}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default MCQBlock;
