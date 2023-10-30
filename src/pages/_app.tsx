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

import { type NextPage } from "next";
import type { AppProps } from "next/app";
import { type ReactElement, useEffect } from "react";
// third-party
import { Provider } from "react-redux";
import { fetchAllFlags } from "redux/flags";
import store from "redux/store";
import ThemeCustomization from "themes";

// types
type LayoutProps = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement;
};

interface Props {
  Component: LayoutProps;
  pageProps: any;
}

const App = ({ Component, pageProps }: AppProps & Props) => {
  const getLayout = Component.getLayout ?? ((page: any) => page);
  useEffect(() => {
    store.dispatch(fetchAllFlags());
  }, []);
  return (
    <Provider store={store}>
      <ThemeCustomization>
        {getLayout(<Component {...pageProps} />)}
      </ThemeCustomization>
    </Provider>
  );
};

export default App;
