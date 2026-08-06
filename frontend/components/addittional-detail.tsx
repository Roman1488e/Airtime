"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AdditionalDetailsProps {
  title: string;
  content: string;
}

const AdditionalDetail = ({ title, content }: AdditionalDetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white divide-y rounded-lg shadow-sm border overflow-hidden transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 md:p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-left">{title}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[1000px] opacity-100 " : "max-h-0 opacity-0"
        }`}
      >
        <div
          className="p-4 md:p-6 pt-0 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default AdditionalDetail;
