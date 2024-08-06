import Document, { Html, Head, Main, NextScript } from "next/document";

const TITLE = "BARK | NFT Staking Platform";
const DESCRIPTION =
  "Discover the BARK CNFT Staking Platform. Engage with Solana Web3 and programs, and enjoy a seamless staking experience with our Solana-powered frontend.";
const SITE_URL = "https://cnft-staking.barkprotocol.net";
const IMAGE_URL = `${SITE_URL}/images/og.png`;
const FAVICON_URL = `${SITE_URL}/favicon.ico`;

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content={DESCRIPTION} />
          <meta name="robots" content="index, follow" />

          {/* Open Graph Meta Tags */}
          <meta property="og:url" content={SITE_URL} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={TITLE} />
          <meta property="og:description" content={DESCRIPTION} />
          <meta property="og:image" content={IMAGE_URL} />
          <meta property="og:image:alt" content={TITLE} />
          <meta property="og:site_name" content="BARK CNFT Staking Platform" />

          {/* Twitter Card Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@bark_protocol" />
          <meta name="twitter:url" content={SITE_URL} />
          <meta name="twitter:title" content={TITLE} />
          <meta name="twitter:description" content={DESCRIPTION} />
          <meta name="twitter:image" content={IMAGE_URL} />
          <meta name="twitter:image:alt" content={TITLE} />

          {/* Additional Meta Tags */}
          <meta name="author" content="BARK Protocol" />
          <meta name="keywords" content="Solana, CNFT, BARK, NFT, staking, Web3, blockchain" />

          {/* Favicon */}
          <link rel="icon" href={FAVICON_URL} type="image/x-icon" />

          {/* Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: TITLE,
                url: SITE_URL,
                description: DESCRIPTION,
                sameAs: "https://twitter.com/bark_protocol",
                logo: IMAGE_URL,
              }),
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
