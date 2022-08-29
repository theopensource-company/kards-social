import React, { useState } from "react";
import { useRouter } from "next/router";
import Container from "../components/Container";
import InputField from "../components/InputField";
import Button from "../components/Button";
import ArrowBack from "../components/icon/ArrowBack";
import Image from "next/image";

import styles from "../styles/JoinWaitlist.module.scss";
import Logo from "../assets/image/Logo.svg";
import axios from "axios";
import Link from "next/link";
import Layout from "../components/Layout";

export default function JoinWaitlist() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameLabel, setNameLabel] = useState("");
  const [emailLabel, setEmailLabel] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    setNameLabel("");
    setEmailLabel("");
    let valid = true;
    if (!/^[A-ZÀ-ÖØ-öø-ÿ]+ [A-ZÀ-ÖØ-öø-ÿ][A-ZÀ-ÖØ-öø-ÿ ]*$/i.test(name)) {
      valid = false;
      setNameLabel("Please enter your full name");
    }

    if (
      !/^[A-ZÀ-ÖØ-öø-ÿ0-9._%+-]+@[A-ZÀ-ÖØ-öø-ÿ0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {
      valid = false;
      setEmailLabel("Please enter a valid email");
    }

    if (valid) {
      const result: any = await axios.post(
        `${location.origin}/api/join-waitlist`,
        {
          name,
          email,
          origin: location.origin,
        }
      );

      if (!result.data)
        return alert(
          "Something went wrong, please try again later or contact hi@kards.social"
        );
      if (result.data?.success) {
        setSuccess(true);
      } else {
        alert(`${result.data?.message} (${result.data?.error})`);
      }
    }
  };

  return (
    <Layout>
      <div className={styles.back}>
        <Button
          text="Back"
          icon={<ArrowBack />}
          size="Small"
          onClick={() => router.push("/")}
        />
      </div>
      <Container className={styles.container}>
        <div className={styles.form}>
          <Image src={Logo} alt="Kards logo" />
          <div className={styles.inputs}>
            <InputField
              value={name}
              label={nameLabel}
              setValue={setName}
              placeholder="Full Name"
            />
            <InputField
              value={email}
              label={emailLabel}
              setValue={setEmail}
              placeholder="Email"
              type="Email"
            />
          </div>
          {success && (
            <p className={styles.success}>
              Check your email! (
              <Link href="/">
                <a>back</a>
              </Link>
              )
            </p>
          )}
          <Button onClick={submit} text="Join waitlist" />
        </div>
      </Container>
    </Layout>
  );
}
