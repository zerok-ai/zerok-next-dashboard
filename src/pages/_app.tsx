import "styles/normalize.scss";
import "simplebar/dist/simplebar.css";
// apex-chart
import "styles/apex-chart.scss";
import "styles/react-table.scss";
// react-flow
import "reactflow/dist/style.css";
import "styles/react-flow.scss";
// custom styles
import "styles/globals.scss";
import "styles/utils.scss";
import "styles/tables.scss";
import "styles/mui-overrides.scss"

import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";
import { createFlagsmithInstance } from "flagsmith/isomorphic";
import { FlagsmithProvider } from "flagsmith/react";
import { type IState } from "flagsmith/types";
import { type NextPage } from "next";
import type { AppProps } from "next/app";
import { type ReactElement, useRef } from "react";
// third-party
import { Provider } from "react-redux";
import store from "redux/store";
import ThemeCustomization from "themes";
import { DEFAULT_FLAGSMITH_ID } from "utils/flags/constants";

// types
type LayoutProps = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement;
};

interface Props {
  Component: LayoutProps;
  pageProps: any;
  flagsmithState: IState;
}

const App = ({ Component, pageProps, flagsmithState }: AppProps & Props) => {
  const flagsmithRef = useRef(createFlagsmithInstance());
  const getLayout = Component.getLayout ?? ((page: any) => page);
  return (
    <KindeProvider>
      <Provider store={store}>
        <FlagsmithProvider
          flagsmith={flagsmithRef.current}
          serverState={flagsmithState}
        >
          <ThemeCustomization>
            {getLayout(<Component {...pageProps} />)}
          </ThemeCustomization>
        </FlagsmithProvider>
      </Provider>
    </KindeProvider>
  );
};

App.getInitialProps = async () => {
  const flagsmithSSR = createFlagsmithInstance();
  await flagsmithSSR.init({
    // fetches flags on the server
    environmentID: process.env.NEXT_PUBLIC_FLAGSMITH_ID || DEFAULT_FLAGSMITH_ID,
    cacheFlags: false, // optionaly specify the identity of the user to get their specific flags
  });

  return { flagsmithState: flagsmithSSR.getState() };
};

export default App;
