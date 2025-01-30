import { useAuth0 } from "@auth0/auth0-react";
import { Scope, hasScope } from "../../lib/utils/user";

export default function WithPermission({ children, scope }: { children: React.ReactNode; scope: Scope }) {
  const { user } = useAuth0();
  if (!hasScope(scope, user)) return <div></div>;

  return <>{children}</>;
}
