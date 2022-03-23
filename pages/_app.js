import "../styles/globals.scss";
import React from "react";
import Head from "next/head";
import Store from "../context/store";
import withData from "../lib/withData";

const MyApp = ({ Component, pageProps }) => {
  MyApp.getInitialProps = async ({ Component, router, ctx }) => {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return {
      pageProps,
    };
  };

  return (
    <Store>
      <Head>
        <title>App Title</title>
        {/* <link href="../public/fonts/Bahnschrift.ttf" rel="stylesheet" /> */}
        <script
          type="module"
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
        ></script>
      </Head>
      <Component {...pageProps} />
    </Store>
  );
};

export default withData(MyApp);
