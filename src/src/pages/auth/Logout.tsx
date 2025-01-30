import { useAuth0 } from "@auth0/auth0-react";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Err = {
  EMAIL_NOT_VERIFIED: "email_not_verified",
};

export const Logout = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const errDesc = queryParams.get("error_description");

  useEffect(() => {
    if (errDesc === Err.EMAIL_NOT_VERIFIED) {
      // do not redirect
      return;
    }
    const timeout = setTimeout(() => {
      navigate("/");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [isAuthenticated, errDesc]);

  if (errDesc === Err.EMAIL_NOT_VERIFIED) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <div className="flex justify-center pt-4">
          <img src="/logo.svg" alt="Logo" className="object-contain" style={{ height: "70%" }} />
        </div>
        <div className="flex-grow"></div>
        <div className="flex items-center justify-center">
          <div className="card w-full max-w-md">
            <h2 className="text-3xl font-bold text-center mb-6">🙌 You are nearly onboard</h2>
            <p className="text-xl text-center mb-6">Please verify your email before logging in.</p>
          </div>
        </div>
        <div className="flex-grow"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-6">Logged out</h2>
          <p className="text-xl text-center mb-6">You'll be redirected to login page.</p>
          <div className="flex justify-center">
            <button className="btn" onClick={() => navigate("/")}>
              <Icon icon="ph:house-bold" className="mr-1" />
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
