import React, { useState } from "react";
import { HelpCircle, CheckCircle, XCircle } from 'lucide-react';

const MCQBlock = ({ question, options, answer, explanation }) => {
    const [selected, setSelected] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const isCorrect = (index) => index === answer;
    
    // Convert 0-indexed answer to A, B, C...
    const correctLetter = String.fromCharCode(65 + answer);

    return (
        <div className="border border-blue-200 p-6 rounded-xl bg-white shadow-xl">
            <h4 className="text-xl font-bold mb-4 text-gray-800 flex items-start">
                <HelpCircle className="w-6 h-6 mr-3 text-blue-500 flex-shrink-0 mt-1" />
                {question}
            </h4>
            <div className="space-y-3">
                {options.map((option, index) => {
                    const isSelected = selected === index;
                    const statusClass = isSelected 
                        ? (isCorrect(index) ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500")
                        : "bg-gray-50 hover:bg-gray-100 border-gray-200";

                    return (
                        <div
                            key={index}
                            className={`p-3 rounded-lg border-2 transition duration-200 cursor-pointer flex items-center ${statusClass} ${selected === null ? 'hover:shadow-md' : ''}`}
                            onClick={() => selected === null && setSelected(index)} // Only allow selection once
                        >
                            <span className={`font-semibold mr-3 w-5 text-center ${isSelected ? 'text-white' : 'text-gray-600'} ${isCorrect(index) && isSelected ? 'bg-green-500 p-1 rounded-full' : isSelected ? 'bg-red-500 p-1 rounded-full' : 'border border-gray-400 rounded-full w-5 h-5 flex items-center justify-center text-xs'}`}>
                                {String.fromCharCode(65 + index)}
                            </span>
                            <span className="flex-1 text-gray-800">{option}</span>
                            {isSelected && (
                                isCorrect(index) ? <CheckCircle className="w-5 h-5 text-green-600 ml-2" /> : <XCircle className="w-5 h-5 text-red-600 ml-2" />
                            )}
                        </div>
                    );
                })}
            </div>
            
            {/* Explanation/Feedback */}
            {selected !== null && (
                <div className="mt-6">
                    <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition flex items-center"
                    >
                        {showExplanation ? "Hide Explanation" : "View Explanation"}
                    </button>
                    {showExplanation && (
                        <div className="mt-3 p-4 bg-gray-100 rounded-lg text-sm border-l-4 border-blue-500">
                            <p className="font-bold mb-1 text-blue-800">Correct Answer: {correctLetter}</p>
                            <p className="text-gray-700">{explanation}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MCQBlock;
