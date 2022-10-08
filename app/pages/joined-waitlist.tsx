import React from "react";
import { useRouter } from "next/router";
import Container from "../components/Container";
import Button from "../components/Button";

import styles from "../styles/JoinWaitlist.module.scss";
import Layout from "../components/Layout";
import Logo from "../components/Logo";

export default function JoinWaitlist() {
  const router = useRouter();

  return (
    <Layout robots="noindex, follow">
      <Container>
        <div className={styles.form}>
          <Logo />
          <p className={styles.success}>You have been added to the waitlist!</p>
          <Button onClick={() => router.push("/")} text="Go back" />
        </div>
      </Container>
    </Layout>
  );
}
