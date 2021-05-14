import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <title>NextJS With React Redux</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href="data:,"/>
          <script src="ti-calculator/TI-30MV_HTML5_EMULATOR-2.0.0.65-prd/js/ti30mv-min.js"></script>
          <script src="ti-calculator/TI-108_HTML5_EMULATOR-2.0.0.65-prd/js/ti108-min.js"></script>
          <link rel="stylesheet" type="text/css" href="ti-calculator/TI-108_HTML5_EMULATOR-2.0.0.65-prd/css/ti108-min.css" />
          <link rel="stylesheet" type="text/css" href="ti-calculator/TI-30MV_HTML5_EMULATOR-2.0.0.65-prd/css/ti30mv-min.css" />     
          <script src="editor.js" /> 
          <link href="/statics/styles.css" rel="stylesheet" />
          <link href="/katex/styles.css" rel="stylesheet"/>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.13.5/dist/katex.min.css" integrity="sha384-L+Gq2Cso/Y2x8fX4wausgiZT8z0QPZz7OqPuz4YqAycQJyrJT9NRLpjFBD6zlOia" crossOrigin="anonymous"/>
          <script defer src="https://cdn.jsdelivr.net/npm/katex@0.13.5/dist/katex.min.js" integrity="sha384-z64WtjpyrKFsxox9eI4SI8eM9toXdoYeWb5Qh+8PO+eG54Bv9BZqf9xNhlcLf/sA" crossOrigin="anonymous"></script>
          <script defer src="https://cdn.jsdelivr.net/npm/katex@0.13.5/dist/contrib/auto-render.min.js" integrity="sha384-vZTG03m+2yp6N6BNi5iM4rW4oIwk5DfcNdFfxkk9ZWpDriOkXX8voJBFrAO7MpVl" crossOrigin="anonymous" onLoad="renderMathInElement(document.body);"></script>  
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
