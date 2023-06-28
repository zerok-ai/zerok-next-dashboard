import "styles/normalize.scss";
import "simplebar/dist/simplebar.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// apex-chart
import "styles/apex-chart.scss";
import "styles/react-table.scss";

// custom styles
import "styles/globals.scss";
import "styles/utils.scss"

import ThemeCustomization from "themes";
import type { AppProps } from "next/app";

// third-party
import { Provider } from "react-redux";

import { store } from "store";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";

// types
type LayoutProps = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface Props {
  Component: LayoutProps;
  pageProps: any;
}

export default function App({ Component, pageProps }: AppProps & Props) {
  const getLayout = Component.getLayout ?? ((page: any) => page);
  return (
    <Provider store={store}>
      <ThemeCustomization>
        {getLayout(<Component {...pageProps} />)}
      </ThemeCustomization>
    </Provider>
  );
}
