import "@/styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";

import Head from "next/head";
import React, { useState } from "react";
import Store from "@/context/store";
import { pageview } from "@/utils/ga";
import { useEffect } from "react";
import { useRouter } from "next/router";
import withData from "@/lib/withData";
import TestLab from "@/components/TestLab";

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

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const router = useRouter();
  // GOOGLE ANALYTICS SETUP
  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
    };

    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <Store>
      <Head>
        <title>Actionise</title>
        <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>

        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;700&family=Teko:wght@400;500&display=swap');
        </style>
        <script
          type="module"
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
        ></script>
        <script
          src="https://assets.calendly.com/assets/external/widget.js"
          type="text/javascript"
          async
        ></script>
      </Head>
      {/* <TestLab /> */}
      <Component {...pageProps} />
      {isClient && (
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          className="toastBig"
          bodyClassName="toast"
        />
      )}
    </Store>
  );
};

export default withData(MyApp);
