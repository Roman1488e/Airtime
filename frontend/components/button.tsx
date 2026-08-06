import Link from "next/link";
import React from "react";

interface ButtonProps {
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  href,
  children,
  className,
}) => {
  if (href) {
    return (
      <Link
        href={href}
        className={`inline-flex h-10 items-center justify-center rounded-md bg-[#383084] px-8 relative overflow-hidden text-sm font-medium text-white btn z-10 border border-[#383084] ${
          className || ""
        }`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`btn ${className || ""}`}>
      {children}
    </button>
  );
};

export default Button;
