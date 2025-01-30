import React from "react";
import { Icon } from "@iconify/react";
import { useClipboard } from "../hooks/useClipboard";

interface CopyTextFieldProps {
  value: string;
}

const CopyTextField: React.FC<CopyTextFieldProps> = ({ value }) => {
  const [justCopied, doCopy] = useClipboard();

  return (
    <div className="bg-base-300 inline-block rounded p-1">
      <div className="flex items-center space-x-2">
        <span className="mr-1 font-mono font-bold text-base">{value}</span>
        <button className="btn btn-xs btn-ghost" onClick={() => doCopy(value)}>
          <div
            className="tooltip tooltip-bottom normal-case text-sm"
            data-tip={justCopied ? "Copied" : "Copy to clipboard"}
          >
            <Icon icon={justCopied ? "ph:check-circle-bold" : "ph:copy-simple-bold"} className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default CopyTextField;
