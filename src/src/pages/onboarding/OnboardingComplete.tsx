import { useNavigate } from "react-router-dom";

export const OnboardingComplete = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <div className="my-10">
        <h1 className="text-3xl font-bold text-center">🎉 Welcome 🎉</h1>

        <h1 className="text-xl font-bold text-center mt-5">You can now access Chainify</h1>
      </div>
      <button
        className="btn btn-primary"
        onClick={() => {
          navigate("/vaults");
        }}
      >
        Home
      </button>
    </Wrapper>
  );
};

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card bg-base-100 shadow-xl w-full max-w-3xl">
        <div className="card-body">
          <ul className="steps">
            <li className="step step-primary">Register</li>
            <li className="step step-primary">Verify Email</li>
            <li className="step step-primary">Configure MFA</li>
            <li className="step step-primary">User Profile</li>
            <li className="step step-primary ">Set Up Tenant</li>
            <li data-content="✓" className="step step-primary step-success">
              Complete
            </li>
          </ul>
          {children}
        </div>
      </div>
    </div>
  );
}
