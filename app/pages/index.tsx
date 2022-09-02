import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

import styles from "../styles/Landing.module.scss";
import Layout from "../components/Layout";
import Logo from "../components/Logo";

const Landing: NextPage = () => {
  return (
    <Layout>
      <div className={styles.container}>
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
      </div>
    </Layout>
  );
};

export default Landing;
