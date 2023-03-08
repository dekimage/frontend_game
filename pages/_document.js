import Document, { Head, Html, Main, NextScript } from "next/document";

const GA_CODE = "G-5JYJD7KRSF";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_CODE}`}
          /> */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-5JYJD7KRSF"
          ></script>

          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5JYJD7KRSF');
            `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
