import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "../../components/Button";
import ArrowBack from "../../components/icon/ArrowBack";
import { toast } from "react-toastify";

import styles from "../../styles/JoinWaitlist.module.scss";
import axios from "axios";
import Logo from "../../components/Logo";
import { Form } from "../../components/Form";
import { FormInputField } from "../../components/Form/InputField";
import { TApiResponse, TForm } from "../../constants/Types";
import LayoutContentMiddle from "../../components/Layout/ContentMiddle";

export default function Signin() {
  const router = useRouter();
  const [working, setWorking] = useState(false);

  useEffect(() => {
    try {
      axios
        .get<TApiResponse>(`${location.origin}/api/user/me`)
        .then((result) => {
          if (result.data?.success) {
            router.push('/account');
          }
        }).catch(e=>{});
    } catch (e) {
      toast.error("An error occured while performing the request.");
    }
  }, []);

  const submitForm: TForm["onSubmit"] = async ({ values, faulty }) => {
    if (faulty.identifier) toast.error("Please enter your username or email");
    if (faulty.password) toast.error("Please enter your password");
    if (Object.keys(faulty).length > 0) return;

    setWorking(true);
    axios.post<TApiResponse>(
      `${location.origin}/api/user/signin`,
      {
        identifier: values.identifier,
        password: values.password,
      }
    ).then(result => {
      if (result.data.success) {
        router.push("/account");
      } else {
        toast.error(`${result.data.message} (${result.data.error})`);
      }
    }).catch(error => {
      if (error.response.status == 401) {
        toast.error("The username/email or password was invalid!");
      } else {
        toast.error("An error occured while performing the request.");
      }
    }).finally(() => setWorking(false));
  };

  const inputIdentifier = new FormInputField({
    name: "identifier",
    placeholder: "Username or email",
    isValid: (value) => value != "",
  });

  const inputPassword = new FormInputField({
    name: "password",
    placeholder: "Password",
    type: "Password",
    isValid: (value) => value != "",
  });

  return (
    <LayoutContentMiddle>
      <div className={styles.back}>
        <Button
          text="Back"
          icon={<ArrowBack />}
          size="Small"
          onClick={() => router.push("/")}
        />
      </div>
      <Form
        className={styles.form}
        inputs={[inputIdentifier, inputPassword]}
        onSubmit={submitForm}
      >
        <Logo />
        <div className={styles.inputs}>
          <inputIdentifier.render />
          <inputPassword.render />
        </div>
        <Button text="Signin" loading={working} />
      </Form>
    </LayoutContentMiddle>
  );
}
