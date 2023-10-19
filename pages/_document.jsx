import Document, { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&amp;display=swap"
            rel="stylesheet"
          />
          <link rel="icon" type="image/png" sizes="16x16" href="/images/lpu.png"></link>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
        <script src={`/jquery.min.js`}></script>
        <script src={`/bootstrap.bundle.min.js`}></script>
        <script src={`/waves.js`}></script>
        <script src={`/sidebarmenu.js`}></script>
        <script src={`/custom.js`}></script>
        <script src={`/chartist.min.js`}></script>
        <script src={`/chartist-plugin-tooltip.min.js`}></script>
      </Html>
    );
  }
}

export default MyDocument;
