import { Auth0Provider, type AppState } from "@auth0/auth0-react";
import { useNavigate } from "react-router";
import "./App.css";
import { Auth0 } from "./components/auth0/Auth0";
import { MainItems } from "./components/menu/MainItems";
import { Menu } from "./components/menu/Menu";
import { SettingItems } from "./components/menu/SettingItems";
import MainModal from "./components/modal/MainModal";
import { Toast } from "./components/toast/Toast";
import { appEnv, auth0ClientId, auth0Domain } from "./constants";
import usePrices from "./hooks/usePrices";
import { sessionStorageCache } from "./lib/cache/sessionstorage";

const auth0Audience = `https://console-api.${appEnv}.chainify.net/v1/`;

const scope = "openid profile email read:user";

function App(props: Props) {
  const { children, showSettings = false, showMenu = true } = props;

  const navigate = useNavigate();

  const onRedirectCallback = (appState?: AppState) => {
    if (appState?.targetUrl) {
      navigate(appState.targetUrl);
    }
  };
  return (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: auth0Audience,
        scope,
      }}
      onRedirectCallback={onRedirectCallback}
      cache={sessionStorageCache}
    >
      <Auth0>
        {showMenu ? (
          <>
            <div className="App">
              <Menu items={showSettings ? <SettingItems /> : <MainItems />}>
                <Rates />
                <div className="container max-w-full px-4 pt-4 pr-8">{children}</div>
                <footer className="footer footer-center p-4 text-base-content">
                  <div>{/* <p className="font-mono">&nbsp;</p> */}</div>
                </footer>
              </Menu>
              <Toast />
            </div>
          </>
        ) : (
          <>{children}</>
        )}
      </Auth0>
      <MainModal />
    </Auth0Provider>
  );
}

export default App;

type Props = {
  children: React.ReactNode;
  /** wether to show navbar and menu: default is true */
  showMenu?: boolean;
  /** wether to show setting menu: default is false */
  showSettings?: boolean;
};

function Rates() {
  // updates the prices in the redux store every 5 mins
  usePrices();
  return <></>;
}
