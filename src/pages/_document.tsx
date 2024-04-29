import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* BASIC */}
        <meta name="application-name" content="EZFind" />
        <meta name="description" content="VCS Inventory Tool" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EZFind" />

        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        <meta name="theme-color" content="#000000" />
        {/* APPLE TOUCH ICON */}
        <link rel="apple-touch-icon" href="/icons/icon.png" />
        {/* MANIFEST */}
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
