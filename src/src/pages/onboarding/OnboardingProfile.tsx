import { useAuth0 } from "@auth0/auth0-react";
import { Icon } from "@iconify/react";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { OnboardingStage } from "../../../types/types";
import useApi from "../../hooks/useApi";
import * as userApi from "../../lib/api/user";
import { getOnboardingStage } from "../../lib/utils/user";
import { Dispatch, RootState } from "../../store";
import { Navbar } from "./NavBar";
import { useTokenSilently } from "../../hooks/useTokenSilently";

interface FormData {
  firstname: string;
  lastname: string;
}

export const OnboardingProfile = () => {
  const { user } = useAuth0();
  const getAccessTokenSilently = useTokenSilently();

  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  const { loading } = useSelector((rootState: RootState) => rootState.loading.models.user);

  const [doSend, state] = useApi(async (data: FormData) => {
    // force refresh token
    const token = await getAccessTokenSilently({
      cacheMode: "off",
    });
    return userApi.postUserOnboarding(token, data.firstname, data.lastname).then(async (res) => {
      // force refresh token after step
      const token = await getAccessTokenSilently({
        cacheMode: "off",
      });
      await dispatch.user.fetchCurrentUser(token);
      navigate("/onboarding/org", { replace: true });
      return res;
    });
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
    },
  });

  if (state.error) {
    return (
      <Wrapper>
        <div className="alert alert-error shadow-lg justify-center mt-6">
          <div>
            <Icon icon="ph:x-circle-bold" />
            <span>Failed onboarding</span>
          </div>
        </div>
        <div className="text-error mt-6">{state.error.message}</div>
      </Wrapper>
    );
  }

  if (getOnboardingStage(user) !== OnboardingStage.PROFILE) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card bg-base-100 shadow-xl w-full max-w-3xl">
          <div className="card-body">
            <div className="alert alert-warning shadow-lg justify-center mt-6">
              <div>
                <Icon icon="ph:x-circle-bold" />
                <span>Already onboarded</span>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={() => navigate("/")}>
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Wrapper>
      <form className="form-control w-full mt-4 mb-4 flex flex-col " onSubmit={handleSubmit((data) => doSend(data))}>
        <div>
          <label className="label">
            <span className="label-text">Fist Name</span>
          </label>
          <input
            {...register("firstname", {
              required: "First Name is required",
              minLength: { value: 2, message: "Min length is 2 characters" },
              maxLength: { value: 100, message: "Max length is 100 characters" },
            })}
            type="text"
            disabled={state.loading || loading}
            className={classNames("input input-bordered w-full", {
              "input-error": Boolean(errors?.firstname),
            })}
          />
          <label className="label">
            <span className="label-text-alt">&nbsp;</span>
            {errors?.firstname && <span className="label-text-alt text-error">{errors?.firstname?.message}</span>}
          </label>
        </div>

        <div>
          <label className="label">
            <span className="label-text">Last Name</span>
          </label>
          <input
            {...register("lastname", {
              required: "Last Name is required",
              minLength: { value: 2, message: "Min length is 2 characters" },
              maxLength: { value: 100, message: "Max length is 100 characters" },
            })}
            type="text"
            disabled={state.loading || loading}
            className={classNames("input input-bordered w-full", {
              "input-error": Boolean(errors?.lastname),
            })}
          />
          <label className="label">
            <span className="label-text-alt">&nbsp;</span>
            {errors?.lastname && <span className="label-text-alt text-error">{errors?.lastname?.message}</span>}
          </label>
        </div>

        <div className="mb-4"></div>
        <div className="modal-action">
          <button type="submit" className={classNames("btn btn-primary", { loading: state.loading || loading })}>
            Submit
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="card bg-base-100 shadow-xl w-full max-w-3xl">
          <div className="card-body">
            <ul className="steps">
              <li className="step step-primary">Register</li>
              <li className="step step-primary">Verify Email</li>
              <li className="step step-primary">Configure MFA</li>
              <li className="step step-primary step-success">User Profile</li>
              <li className="step">Set Up Tenant</li>
              <li data-content="✓" className="step">
                Complete
              </li>
            </ul>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
