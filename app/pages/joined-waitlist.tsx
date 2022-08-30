import React, { useState } from "react";
import { useRouter } from "next/router";
import Container from "../components/Container";
import Button from "../components/Button";
import Image from "next/image";

import styles from "../styles/JoinWaitlist.module.scss";
import Logo from "../assets/image/Logo.svg";
import Layout from "../components/Layout";

export default function JoinWaitlist() {
  const router = useRouter();

  return (
    <Layout>
      <Container>
        <div className={styles.form}>
          <Image src={Logo} alt="Kards logo" />
          <p className={styles.success}>You have been added to the waitlist!</p>
          <Button onClick={() => router.push("/")} text="Go back" />
        </div>
      </Container>
    </Layout>
  );
}
