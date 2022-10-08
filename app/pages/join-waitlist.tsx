import React, { useState } from "react";
import { useRouter } from "next/router";
import Container from "../components/Container";
import Button from "../components/Button";
import ArrowBack from "../components/icon/ArrowBack";
import { toast } from "react-toastify";

import styles from "../styles/JoinWaitlist.module.scss";
import axios from "axios";
import Layout from "../components/Layout";
import Logo from "../components/Logo";
import { Form } from "../components/Form";
import { FormInputField } from "../components/Form/InputField";
import { TForm } from "../constants/Types";

export default function JoinWaitlist() {
  const router = useRouter();
  const [working, setWorking] = useState(false);

  const submitForm: TForm["onSubmit"] = async ({ values, faulty }) => {
    if (faulty.name) toast.error("Please enter your full name");
    if (faulty.email) toast.error("Please enter a valid email");
    if (Object.keys(faulty).length > 0) return;

    setWorking(true);
    try {
      const result: any = await axios.post(
        `${location.origin}/api/waitlist/join`,
        {
          name: values.name,
          email: values.email,
          origin: location.origin,
        }
      );

      if (!result.data)
        return toast.error(
          "Something went wrong, please try again later or contact hi@kards.social"
        );
      if (result.data?.success) {
        toast.success("Check you inbox and spam for a verification email!");
      } else {
        toast.error(`${result.data?.message} (${result.data?.error})`);
      }
    } catch (e) {
      toast.error("An error occured while performing the request.");
    }

    setWorking(false);
  };

  const inputName = new FormInputField({
    name: "name",
    placeholder: "Full Name",
    isValid: (value) =>
      /^[A-ZÀ-ÖØ-öø-ÿ]+ [A-ZÀ-ÖØ-öø-ÿ][A-ZÀ-ÖØ-öø-ÿ ]*$/i.test(value),
  });

  const inputEmail = new FormInputField({
    name: "email",
    placeholder: "Email",
    isValid: (value) =>
      /^[A-ZÀ-ÖØ-öø-ÿ0-9._%+-]+@[A-ZÀ-ÖØ-öø-ÿ0-9.-]+\.[A-Z]{2,}$/i.test(value),
  });

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
        <Form
          className={styles.form}
          inputs={[inputName, inputEmail]}
          onSubmit={submitForm}
        >
          <Logo />
          <div className={styles.inputs}>
            <inputName.render />
            <inputEmail.render />
          </div>
          <Button text="Join waitlist" loading={working} />
        </Form>
      </Container>
    </Layout>
  );
}
