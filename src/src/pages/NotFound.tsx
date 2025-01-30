import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-6">¯\_(ツ)_/¯</h2>
          <p className="text-xl text-center mb-6">Oops! The page you're looking for doesn't exist.</p>
          <div className="flex justify-center">
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              <Icon icon="ph:arrow-left-bold" className="mr-1" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
