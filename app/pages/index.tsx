import type { NextPage } from "next";
import Link from "next/link";

import styles from "../styles/Landing.module.scss";
import Layout from "../components/Layout";
import Logo from "../components/Logo";
import { toast } from 'react-toastify'

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

          <button onClick={() => {
             toast.error('Something went wrong!')
          }}>
            click me 
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Landing;
