"use client";

import type React from "react";

import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export default function MobileMenuButton({
  isOpen,
  onClick,
  className,
}: MobileMenuButtonProps) {
  return (
    <button
      className={cn(
        "text-gray-800 hover:text-[#383084] transition-colors duration-200 p-2",
        className
      )}
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <X className="h-6 w-6" aria-hidden="true" />
      ) : (
        <Menu className="h-6 w-6" aria-hidden="true" />
      )}
    </button>
  );
}
