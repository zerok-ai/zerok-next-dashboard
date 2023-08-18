import "styles/normalize.scss";
import "simplebar/dist/simplebar.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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

import { type NextPage } from "next";
import type { AppProps } from "next/app";
import { type ReactElement, type ReactNode } from "react";
// third-party
import { Provider } from "react-redux";
import store from "redux/store";
import ThemeCustomization from "themes";

// types
type LayoutProps = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface Props {
  Component: LayoutProps;
  pageProps: any;
}

const App = ({ Component, pageProps }: AppProps & Props) => {
  const getLayout = Component.getLayout ?? ((page: any) => page);
  return (
    <Provider store={store}>
      <ThemeCustomization>
        {getLayout(<Component {...pageProps} />)}
      </ThemeCustomization>
    </Provider>
  );
};

export default App;
