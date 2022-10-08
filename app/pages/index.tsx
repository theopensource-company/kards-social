import React from "react";
import type { NextPage } from "next";
import Link from "next/link";

import styles from "../styles/Landing.module.scss";
import Layout from "../components/Layout";
import Logo from "../components/Logo";
import Container from "../components/Container";

const Landing: NextPage = () => {
  return (
    <Layout>
      <Container>
        <div className={styles.content}>
          <div className="image-frame">
            <Logo />
          </div>

          <h1>Opening up soon</h1>
          <span>
            <Link href="/join-waitlist">
              <a>Reserve your spot now</a>
            </Link>
          </span>

          <p>
            Kards is an open social media platform, free from abusive data
            harvesting and damaging algorithms.
          </p>
        </div>
      </Container>
    </Layout>
  );
};

export default Landing;
