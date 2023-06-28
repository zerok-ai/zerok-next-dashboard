import "styles/normalize.scss";
import "simplebar/dist/simplebar.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// apex-chart
import "styles/apex-chart.scss";
import "styles/react-table.scss";


import type { AppProps } from "next/app";

// third-party
import { Provider } from "react-redux";

import { store } from "store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
