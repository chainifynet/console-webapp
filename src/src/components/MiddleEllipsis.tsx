import React from "react";

interface EllipsisProps {
  text: string;
}

export const MiddleEllipsis: React.FC<EllipsisProps> = ({ text }) => {
  if (!text || !text.length) return <span></span>;
  const mid = Math.floor(text.length / 2);

  const ending = Math.min(mid, 5);
  return (
    <span className="flex items-center font-mono">
      <span className="whitespace-nowrap overflow-hidden  max-w-[5rem] truncate">{text}</span>
      <span className="whitespace-nowrap overflow-hidden max-w-[4rem] select-none" style={{ direction: "rtl" }}>
        {text.substring(text.length - ending)}
      </span>
    </span>
  );
};
