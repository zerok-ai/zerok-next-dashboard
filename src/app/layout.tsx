"use client";
import Head from "next/head";
import { Provider } from "react-redux";
import store from "redux/store";
import ThemeCustomization from "themes";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@200;300;350;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Provider store={store}>
        <ThemeCustomization>
          <body>{children}</body>
        </ThemeCustomization>
      </Provider>
    </html>
  );
}
