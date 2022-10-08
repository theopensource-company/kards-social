import React from "react";
import { useRouter } from "next/router";
import Button from "../components/Button";

import styles from "../styles/JoinWaitlist.module.scss";
import Logo from "../components/Logo";
import LayoutContentMiddle from "../components/Layout/ContentMiddle";

export default function JoinWaitlist() {
  const router = useRouter();

  return (
    <LayoutContentMiddle robots="noindex, follow">
      <div className={styles.form}>
        <Logo />
        <p className={styles.success}>You have been added to the waitlist!</p>
        <Button onClick={() => router.push("/")} text="Go back" />
      </div>
    </LayoutContentMiddle>
  );
}
