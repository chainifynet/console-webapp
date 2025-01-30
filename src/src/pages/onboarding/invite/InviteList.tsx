import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { InviteListItem } from "../../../components/invite/InviteListItem";
import { Invite } from "../../../hooks/fetch/useOrgInvites";
import useApi from "../../../hooks/useApi";
import { useTokenSilently } from "../../../hooks/useTokenSilently";
import { Dispatch } from "../../../store";

export default function InviteList({ invites }: { invites: Invite[] }) {
  const getAccessTokenSilently = useTokenSilently();
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  const [accepted, setAccepted] = useState("");

  const [onFinish, onFinishState] = useApi(async () => {
    const token = await getAccessTokenSilently({
      cacheMode: "off",
    });
    await dispatch.user.fetchCurrentUser(token);
    navigate("/onboarding/complete", { replace: true });
  });

  if (onFinishState.loading) {
    return <div>Finishing...</div>;
  }

  return (
    <>
      {invites.length > 1 && (
        <p className="text-xl font-bold my-5 text-center">You have been invited to the following organitations</p>
      )}
      {invites.length == 1 && (
        <p className="text-xl font-bold my-5 text-center">You have been invited to the following organitation</p>
      )}

      <table className="table w-full [&_tr.hover:hover_*]:!bg-base-200">
        <tbody>
          {invites.map((invite, i) => (
            <InviteListItem invite={invite} onAccepted={setAccepted} key={i} />
          ))}
        </tbody>
      </table>

      <div className="mb-4"></div>
      <div className="modal-action">
        <button type="button" className="btn btn-primary" disabled={!accepted} onClick={onFinish}>
          Finish
        </button>
      </div>
    </>
  );
}
