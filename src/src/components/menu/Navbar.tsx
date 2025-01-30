import { useAuth0 } from "@auth0/auth0-react";
import { Icon } from "@iconify/react";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLogoutOptions } from "../../lib/utils/path";
import { getInitials } from "../../lib/utils/string";
import { getCurrentOrgData } from "../../lib/utils/user";
import { Dispatch, RootState } from "../../store";
import { Logo } from "./Logo";
import { Search } from "./Search";
import ThemeToggle from "./ThemeToggle";

export const Navbar = () => {
  const { user, logout } = useAuth0();
  const currentUser = useSelector((state: RootState) => state.user);
  const name = currentUser?.user?.firstname
    ? `${currentUser?.user?.firstname} ${currentUser?.user?.lastname}`
    : user?.name;
  const tenant = useMemo(() => getCurrentOrgData(currentUser), [currentUser?.orgId]);

  const dispatch = useDispatch<Dispatch>();
  const initials = getInitials(name);
  return (
    <div
      className="sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100 
    bg-base-100 text-base-content shadow-sm"
    >
      <nav className="navbar w-full">
        <div className="flex-1">
          <label
            htmlFor="sidemenu-drawer"
            className="btn drawer-button btn-ghost lg:hidden mr-1"
            onClick={() => dispatch.drawer.setOpen(true)}
          >
            <Icon icon="ph:list-bold" width={20} />
          </label>
          <Logo hideOnLargeScreen={true} />
          <Search hideOnLargeScreen={false} />
        </div>

        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end pr-6">
            <label tabIndex={0} className="btn btn-ghost btn-square avatar">
              <div className="avatar placeholder">
                <div className="bg-neutral-focus text-neutral-content rounded-box w-11">
                  <span>{initials}</span>
                </div>
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box min-w-[13rem]"
            >
              <li className="pointer-events-none ">
                <strong>{name}</strong>
                <h3>{user?.email}</h3>
                <div className="badge badge-outline badge-lg self-center">{tenant}</div>
              </li>
              <div className="content-center my-6">
                <ThemeToggle />
              </div>
              <li>
                <button className="btn btn-primary text-neutral-content" onClick={() => logout(getLogoutOptions())}>
                  <Icon icon="ph:sign-out-bold" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
