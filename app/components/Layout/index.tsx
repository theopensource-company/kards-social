import React from "react";
import Head from "next/head";
import { ReactNode } from "react";

type Props = {
  title?: string;
  description?: string;
  robots?: string;
  children: ReactNode;
};

export default function Layout({
  title,
  description,
  robots,
  children,
}: Props) {
  return (
    <>
      <Head>
        <title>{title ? `${title} - Kards` : "Kards: Socially Social"}</title>

        <meta name="charset" content="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1"
        />
        <meta name="robots" content={robots ?? "index, follow"} />

        <meta name="title" content={title ?? "Kards"} />

        <meta name="og:title" content={title ?? "Kards"} />
        <meta name="og:type" content="website" />
        <meta name="og:url" content="https://kards.social/" />
        <meta
          name="og:image"
          itemProp="image primaryImageOfPage"
          content="https://kards.social/Logo.png"
        />
        <meta name="og:site_name" content={title ?? "Kards"} />

        <meta name="twitter:title" content={title ?? "Kards"} />
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
    </>
  );
}
