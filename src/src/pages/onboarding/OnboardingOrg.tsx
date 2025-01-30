import { Icon } from "@iconify/react";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { OnboardingStage } from "../../../types/types";
import { useOrgInvites } from "../../hooks/fetch/useOrgInvites";
import useApi from "../../hooks/useApi";
import { useTokenSilently } from "../../hooks/useTokenSilently";
import * as userApi from "../../lib/api/user";
import { Dispatch, RootState } from "../../store";
import { Navbar } from "./NavBar";
import InviteList from "./invite/InviteList";

interface FormData {
  name: string;
  tenant: string;
}

export const OnboardingOrg = () => {
  const getAccessTokenSilently = useTokenSilently();

  const { loading } = useSelector((rootState: RootState) => rootState.loading.models.user);
  const currentUser = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();
  const { data: invites, isLoading } = useOrgInvites();

  const [doCreateOrg, state] = useApi(async (data: FormData) => {
    const token = await getAccessTokenSilently({
      cacheMode: "off",
    });
    return userApi.postOrgOnboarding(token, data.name, data.tenant).then(async (res) => {
      const token = await getAccessTokenSilently({
        cacheMode: "off",
        authorizationParams: {
          switchOrgId: state?.value?.orgId,
        },
      });
      await dispatch.user.fetchCurrentUser(token);
      navigate("/onboarding/complete", { replace: true });
      return res;
    });
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      tenant: "",
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

  if (currentUser?.user.onboardingStage !== OnboardingStage.TENANT_SETUP) {
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

  if (isLoading || state.loading) {
    <Wrapper>
      <LoadingSkeleton />
    </Wrapper>;
  }

  if (invites?.length) {
    return (
      <Wrapper>
        <InviteList invites={invites} />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <form
        className="form-control w-full mt-4 mb-4 flex flex-col "
        onSubmit={handleSubmit((data) => doCreateOrg(data))}
      >
        <div>
          <label className="label">
            <span className="label-text">Company Name</span>
          </label>
          <input
            {...register("name", {
              required: "First Name is required",
              minLength: { value: 2, message: "Min length is 2 characters" },
              maxLength: { value: 100, message: "Max length is 100 characters" },
            })}
            type="text"
            disabled={state.loading || loading}
            className={classNames("input input-bordered w-full", {
              "input-error": Boolean(errors?.name),
            })}
          />
          <label className="label">
            <span className="label-text-alt">&nbsp;</span>
            {errors?.name && <span className="label-text-alt text-error">{errors?.name?.message}</span>}
          </label>
        </div>

        <div>
          <label className="label">
            <span className="label-text">Tenant</span>
          </label>
          <input
            {...register("tenant", {
              required: "Last Name is required",
              minLength: { value: 3, message: "Min length is 2 characters" },
              maxLength: { value: 50, message: "Max length is 100 characters" },
              pattern: {
                value: /^(?!.*?--)[a-z0-9-]+[^A-Z\\_\\.\\W]{1}$/,
                message: "Only lowercase letters, digits, and single hyphens allowed",
              },
            })}
            type="text"
            disabled={state.loading || loading}
            className={classNames("input input-bordered w-full", {
              "input-error": Boolean(errors?.tenant),
            })}
          />
          <label className="label">
            <span className="label-text-alt">&nbsp;</span>
            {errors?.tenant && <span className="label-text-alt text-error">{errors?.tenant?.message}</span>}
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
              <li className="step step-primary">User Profile</li>
              <li className="step step-primary step-success">Set Up Tenant</li>
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

const itemStyle = "bg-base-content bg-opacity-10 rounded-full animate-pulse";
export const LoadingSkeleton = () => {
  return (
    <div className="w-full flex mb-10">
      <div className="w-full">
        <div className={`h-4 mb-2 ${itemStyle}`}></div>
        <div className={`h-4 ${itemStyle}`}></div>
      </div>
    </div>
  );
};
