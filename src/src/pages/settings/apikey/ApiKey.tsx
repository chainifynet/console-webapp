import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Watermark } from "../../../components/watermark/Watermark";
import { useApiKeys } from "../../../hooks/fetch/useApiKeys";
import { Scope, hasScope } from "../../../lib/utils/user";
import { Dispatch } from "../../../store";
import { ApiKeyListItem, ApiKeyListItemSkeleton } from "./ApiKeyListItem";
import { Icon } from "@iconify/react";
import { useClipboard } from "../../../hooks/useClipboard";
import { apiEndpointUrlForDoc } from "../../../constants";

const loadingSkeletonItems = Array.from({ length: 6 });

export function ApiKey() {
  const { data, isLoading, error } = useApiKeys();
  const { user: currentUser } = useAuth0();

  const [justCopied, doCopy] = useClipboard();
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      dispatch.errors.set(error.message);
    }
  }, [error]);

  if (error) {
    return <Watermark text="Api keys could not be loaded" />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <h1 className="text-xl font-bold opacity-40 mb-5">Api Keys</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 mb-4">
        <div>
          <button className="btn mb-5" onClick={() => navigate("#createapikey", { replace: true })}>
            Create Api Key
          </button>
        </div>
        <div className="w-fit">
          {apiEndpointUrlForDoc && (
            <div className="flex justify-between space-x-2 label-text mb-1">
              <div>API Endpoint</div>
              <div className="px-2 bg-base-300 rounded-lg flex space-x-2 items-center justify-between">
                <button className="font-mono text-sm" onClick={() => doCopy(apiEndpointUrlForDoc)}>
                  <div
                    className="tooltip tooltip-bottom normal-case text-sm"
                    data-tip={justCopied ? "Copied" : "Copy to clipboard"}
                  >
                    {apiEndpointUrlForDoc}
                  </div>
                </button>
              </div>
            </div>
          )}

          <a href="https://chainify.net/docs" target="_blank" className="flex label-text space-x-1 mt-2">
            <span>API Docs</span>
            <Icon icon="ph:arrow-square-out-bold" />
          </a>
        </div>
      </div>

      {data?.length > 0 ? (
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Key</th>
                <th>Expiration</th>
                <th>Permissions</th>
                <th>White Listed IPs</th>
                {hasScope(Scope.WriteOrgApiKey, currentUser) && <th></th>}
              </tr>
            </thead>
            <tbody>
              {/* show only current page */}
              {data.map((apiKey, i) => (
                <ApiKeyListItem apiKey={apiKey} key={apiKey.apiKeyId} currentUser={currentUser} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Watermark text="No api keys" />
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="container mt-10">
      {loadingSkeletonItems.map((_, i) => (
        <ApiKeyListItemSkeleton key={i} />
      ))}
    </div>
  );
}
