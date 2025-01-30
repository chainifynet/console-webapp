import { Icon } from "@iconify/react";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import { Invite } from "../../hooks/fetch/useOrgInvites";
import useApi from "../../hooks/useApi";
import { useTokenSilently } from "../../hooks/useTokenSilently";
import * as userApi from "../../lib/api/user";
import { Dispatch } from "../../store";

export function InviteListItem({ invite, onAccepted }: { invite: Invite; onAccepted: (orgId: string) => void }) {
  const getAccessTokenSilently = useTokenSilently();
  const dispatch = useDispatch<Dispatch>();

  const [doAcceptInvite, state] = useApi(async (orgId: string) => {
    const token = await getAccessTokenSilently();
    return userApi
      .acceptInvite(token, { orgId })
      .then((res) => {
        onAccepted(orgId);
        return res;
      })
      .catch((err) => {
        dispatch.errors.set(err?.message);
        throw err;
      });
  });

  return (
    <tr>
      <td className="text-right">{invite.tenant}</td>
      <td className="text-left">
        {state.value ? (
          <div className="badge badge-success badge-lg gap-2">
            <Icon icon="ph:check-circle-bold" />
            Accepted
          </div>
        ) : (
          <button
            className={classNames("btn btn-sm", { loading: state.loading })}
            onClick={() => doAcceptInvite(invite.orgId)}
          >
            Accept Invite
          </button>
        )}
      </td>
    </tr>
  );
}
