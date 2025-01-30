export const appEnv = import.meta.env.VITE_APP_ENV;

export const mockApi = import.meta.env.VITE_APP_MOCK_API === "true";

export const auth0Domain = import.meta.env.VITE_APP_AUTH0_DOMAIN || "";
export const auth0ClientId = import.meta.env.VITE_APP_AUTH0_CLIENT_ID || "";

// TODO I don't think we need those
// export const datadogAppId = import.meta.env.VITE_APP_DATADOG_APP_ID;
// export const datadogToken = import.meta.env.VITE_APP_DATADOG_TOKEN;

export const apiUrl = import.meta.env.VITE_APP_API_URL || "";
export const isSandbox = import.meta.env.VITE_APP_ENV === "sandbox";

export const stripeStartupLink = import.meta.env.VITE_APP_STRIPE_STARTUP_LINK || "";
export const stripeBusinessLink = import.meta.env.VITE_APP_STRIPE_BUSINESS_LINK || "";

export const apiEndpointUrlForDoc = import.meta.env.VITE_APP_API_ENDPOINT_FOR_DOC || "";

function split(str = "") {
  const [a, b] = str.split("_");
  if (!a || !b) throw new Error(`Invalid config: ${str}`);
  return [a, b];
}

// ui
export const icons = {
  vault: "ph:key-bold",
  account: "ph:identification-card-bold",
  wallet: "ph:wallet-bold",
  gasstation: "ph:gas-pump-bold",
  user: "ph:user-bold",
};
