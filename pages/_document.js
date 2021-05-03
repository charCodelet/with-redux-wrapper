import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <link rel="icon" href="data:,"/>
          <script src="ti-calculator/TI-30MV_HTML5_EMULATOR-2.0.0.65-prd/js/ti30mv-min.js"></script>
          <script src="ti-calculator/TI-108_HTML5_EMULATOR-2.0.0.65-prd/js/ti108-min.js"></script>
          <link rel="stylesheet" type="text/css" href="ti-calculator/TI-108_HTML5_EMULATOR-2.0.0.65-prd/css/ti108-min.css" />
          <link rel="stylesheet" type="text/css" href="ti-calculator/TI-30MV_HTML5_EMULATOR-2.0.0.65-prd/css/ti30mv-min.css" />     
          <script src="https://www.wiris.net/demo/editor/editor" /> 
          <body>
            <Main/>
            <NextScript /> 
          </body>
        </Head>
      </Html>
    )
  }
}

export default MyDocument;
