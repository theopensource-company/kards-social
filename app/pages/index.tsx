import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

import Button from "../components/Button";

import LogoVector from "../assets/image/Logo.svg";
import styles from "../styles/Landing.module.scss";

const Landing: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className="image-frame">
          <Image src={LogoVector} alt="The Kards logo" />
        </div>

        <h1>Opening up soon</h1>
        <span>You can reserve your spot soon</span>
        {/* <Link href="/signup">
          <a>Reserve your spot now</a>
        </Link> */}

        <p>
          Kards is an open social media platform, free from abusive data
          harvesting and damaging algorithms.
        </p>
      </div>
    </div>
  );
};

export default Landing;
