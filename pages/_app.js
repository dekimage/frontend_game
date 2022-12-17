import "../styles/globals.scss";
import React from "react";
import Head from "next/head";
import Store from "../context/store";
import withData from "../lib/withData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        <title>Actionise</title>
        {/* <link href="../public/fonts/Bahnschrift.ttf" rel="stylesheet" /> */}
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Teko:wght@400;500&display=swap');
        </style>
        <script
          type="module"
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
        ></script>
      </Head>
      <Component {...pageProps} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
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
    </Store>
  );
};

export default withData(MyApp);
