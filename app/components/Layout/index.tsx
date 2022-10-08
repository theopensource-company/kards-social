import React from "react";
import Head from "next/head";

import { Color } from "../../constants/Colors";
import { TPageLayout } from "../../constants/Types";

export default function Layout({
  title,
  description,
  robots,
  children,
}: TPageLayout) {
  return (
    <>
      <Head>
        <title>{title ? `${title} - Kards` : "Kards: Socially Social"}</title>

        <link
          rel="manifest"
          href="/app.webmanifest"
          type="application/manifest+json"
        />

        <meta name="application-name" content="Kards" />
        <meta name="theme-color" content={Color.Tint} />

        <link rel="apple-touch-icon" href="/images/icon_192x192.png" />

        <meta name="charset" content="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1"
        />
        <meta name="robots" content={robots ?? "index, follow"} />

        <meta
          name="title"
          content={title ? `${title} - Kards` : "Kards: Socially Social"}
        />

        <meta
          name="og:title"
          content={title ? `${title} - Kards` : "Kards: Socially Social"}
        />
        <meta name="og:type" content="website" />
        <meta name="og:url" content="https://kards.social/" />
        <meta
          name="og:image"
          itemProp="image primaryImageOfPage"
          content="https://kards.social/Logo.png"
        />
        <meta
          name="og:site_name"
          content={title ? `${title} - Kards` : "Kards: Socially Social"}
        />

        <meta
          name="twitter:title"
          content={title ? `${title} - Kards` : "Kards: Socially Social"}
        />
        <meta name="twitter:card" content="summary" />

        <meta
          name="description"
          content={
            description ??
            "Kards is an open social media platform, free from abusive data harvesting and damaging algorithms. Join the waitlist now!"
          }
        />
        <meta
          name="og:description"
          content={
            description ??
            "Kards is an open social media platform, free from abusive data harvesting and damaging algorithms. Join the waitlist now!"
          }
        />
        <meta
          name="twitter:description"
          content={
            description ??
            "Kards is an open social media platform, free from abusive data harvesting and damaging algorithms. Join the waitlist now!"
          }
        />
      </Head>
      <div id="app-container">{children}</div>
      <footer>
        &copy; {`${new Date().getFullYear()} `}
        <a href="https://theopensource.company">The Open Source Company</a>, All
        Rights Reserved.
      </footer>
    </>
  );
}
