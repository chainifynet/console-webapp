import { Icon } from "@iconify/react";
import { Logo } from "./Logo";
import { useAuth0 } from "@auth0/auth0-react";
import { getLogoutOptions } from "../../lib/utils/path";

export const Navbar = () => {
  const { logout } = useAuth0();
  return (
    <div
      className="sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur transition-all duration-100 
    bg-base-100 text-base-content shadow-sm"
    >
      <nav className="navbar w-full">
        <div className="flex-1">
          <Logo />
        </div>
        <div className="mr-2">
          <button className="btn text-neutral-content" onClick={() => logout(getLogoutOptions())}>
            Log Out
          </button>
        </div>
      </nav>
    </div>
  );
};
