import Link from "next/link";
import React from "react";
import { ArrowUpRight } from "lucide-react";

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
        className={`button-primary ${
          className || ""
        }`}
      >
        <span>{children}</span><ArrowUpRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`button-primary ${className || ""}`}>
      <span>{children}</span><ArrowUpRight aria-hidden="true" className="h-4 w-4" />
    </button>
  );
};

export default Button;
