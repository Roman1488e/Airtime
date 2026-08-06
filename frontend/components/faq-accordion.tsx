"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FaqAccordionProps {
  question: string;
  answer: string;
}

export default function FaqAccordion({ question, answer }: FaqAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 md:p-6 flex justify-between items-center text-left"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-medium">{question}</h3>
        <span className="ml-4 flex-shrink-0 text-gray-500">
          {isOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 md:p-6 pt-0 border-t border-gray-100">
          {answer.includes("<") ? (
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          ) : (
            <p className="text-gray-700">{answer}</p>
          )}
        </div>
      </div>
    </div>
  );
}
