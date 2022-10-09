import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "../components/Button";
import ArrowBack from "../components/icon/ArrowBack";
import { toast } from "react-toastify";

import styles from "../styles/JoinWaitlist.module.scss";
import axios from "axios";
import { TApiResponse } from "../constants/Types";
import LayoutContentMiddle from "../components/Layout/ContentMiddle";

export default function Account() {
  const router = useRouter();

  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    username: string;
  } | null>(null);

  useEffect(() => {
    axios
      .get<TApiResponse>(`${location.origin}/api/user/me`)
      .then((result) => {
        if (result.data.success) {
          setUser(result.data.result);
        } else {
          toast.error(`${result.data.message} (${result.data.error})`);
        }
      })
      .catch((res) => {
        if (res.response.status == 401) {
          toast.info("Please signin first!");
          router.push("/auth/signin");
        } else {
          toast.error(
            "An error occured while retrieving your profile details."
          );
        }
      });
  }, [router]);

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
      {user && (
        <div>
          <h1>{user.name}</h1>
          <p>@{user.username}</p>
          <p>{user.email}</p>
        </div>
      )}
    </LayoutContentMiddle>
  );
}
