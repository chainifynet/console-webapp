import { Icon } from "@iconify/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiKey } from "../../../../types/types";
import { useClipboard } from "../../../hooks/useClipboard";

const mainPath = "/settings/apikeys";

export function ViewApiKey({ apiKey }: Props) {
  const navigate = useNavigate();
  const [showSecret, setShowSecret] = useState(false);

  const [justCopied, doCopy] = useClipboard();

  return (
    <div>
      <h3 className="font-bold text-lg mb-8 text-success">
        API Key created: <span className="font-mono">{apiKey.name}</span>
      </h3>

      <div className="alert alert-info mb-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span className="text-sm font-bold">
          This key cannot be retrieved again, if you forget the secret you will need to create another key
        </span>
      </div>

      <div className="flex flex-col space-y-4">
        <div>
          <label className="font-bold opacity-60">API Key ID</label>
          <div className="">
            <div className="py-1 mt-1 px-2 bg-base-300 rounded-lg flex space-x-2 items-center justify-between">
              <button
                className="font-mono text-sm"
                onClick={() => {
                  if (apiKey.apiKeyId) {
                    doCopy(apiKey.apiKeyId);
                  }
                }}
              >
                <div
                  className="tooltip tooltip-bottom normal-case text-sm"
                  data-tip={justCopied ? "Copied" : "Copy to clipboard"}
                >
                  {apiKey.apiKeyId}
                </div>
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="font-bold opacity-60">API Key Secret</label>
          <div className="py-1 mt-1 px-2 bg-base-300 rounded-lg flex space-x-2 items-center justify-between">
            <button
              className="font-mono text-sm"
              onClick={() => {
                if (apiKey.secret) {
                  doCopy(apiKey.secret);
                }
              }}
            >
              <div
                className="tooltip tooltip-bottom normal-case text-sm"
                data-tip={justCopied ? "Copied" : "Copy to clipboard"}
              >
                {showSecret ? <>{apiKey.secret}</> : <>cf_********_***</>}
              </div>
            </button>

            <button className="ml-2" onClick={() => setShowSecret(!showSecret)}>
              <Icon icon={showSecret ? "ph:eye-slash-fill" : "ph:eye-fill"} className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="modal-action">
        <button className="btn btn-primary" onClick={() => navigate(mainPath)}>
          I Saved The API Key
        </button>
      </div>
    </div>
  );
}

interface Props {
  apiKey: ApiKey;
  title: string;
}
