import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PaginationControl from "../../../components/PaginationControl";
import { Watermark } from "../../../components/watermark/Watermark";
import { useOrgUsers } from "../../../hooks/fetch/useOrgUsers";
import { Scope, hasScope } from "../../../lib/utils/user";
import { Dispatch } from "../../../store";
import { OrgUserListItem, OrgUserListItemSkeleton } from "./OrgUserListItem";

const loadingSkeletonItems = Array.from({ length: 6 });

export default function OrgUsers() {
  const { data, isLoading, error, size, setSize, isEnd } = useOrgUsers();
  const { user: currentUser } = useAuth0();

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      dispatch.errors.set(error.message);
    }
  }, [error]);

  if (error) {
    return <Watermark text="Organization users could not be loaded" />;
  }

  if (isLoading || !data?.length || data?.length < size) {
    return <Loading />;
  }

  if (!data[size - 1]?.users?.length) {
    return <Watermark text="No organitation users" />;
  }

  return (
    <div>
      <h1 className="text-xl font-bold opacity-40 mb-5">Tenant Settings</h1>
      <button className="btn mb-5" onClick={() => navigate("#invite", { replace: true })}>
        Invite User
      </button>
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Organization Users</th>
              <th>Status</th>
              <th>Role</th>
              {hasScope(Scope.DeleteOrgUsers, currentUser) && <th></th>}
            </tr>
          </thead>
          <tbody>
            {/* show only current page */}
            {data[size - 1].users.map((user, i) => (
              <OrgUserListItem orgUser={user} key={user.userId} currentUser={currentUser} />
            ))}
          </tbody>
        </table>
      </div>

      <PaginationControl
        page={size}
        setPage={setSize}
        isLast={isEnd}
        currentPageItemCount={data[size - 1].users.length}
      />
    </div>
  );
}

function Loading() {
  return (
    <div className="container mt-10">
      {loadingSkeletonItems.map((_, i) => (
        <OrgUserListItemSkeleton key={i} />
      ))}
    </div>
  );
}
