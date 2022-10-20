import { UserIdentity } from "ra-core";
import { TApiResponse } from "../constants/Types";

const authProvider = {
  login: ({ username, password }: { username: string; password: string }) => {
    const request = new Request(`${location.origin}/api/admin/signin`, {
      method: "POST",
      body: JSON.stringify({ identifier: username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    return fetch(request)
      .then((res) => res.json())
      .then((res: TApiResponse) => {
        if (!res.success) throw new Error(`${res.message} (${res.error})`);
        return Promise.resolve();
      })
      .catch(() => {
        throw new Error("Network error");
      });
  },
  checkError: () => {
    // Required for the authentication to work
    return Promise.resolve();
  },
  checkAuth: () => {
    const request = new Request(`${location.origin}/api/admin/token`, {
      method: "GET",
    });
    return fetch(request)
      .then((res) => res.json())
      .then(
        (
          res: TApiResponse<{
            token: string;
          }>
        ) => {
          if (!res.success) return Promise.reject();
          localStorage.setItem("kadmxs", res.result?.token || "");
          return Promise.resolve();
        }
      )
      .catch(() => {
        throw new Error("Network error");
      });
  },
  getPermissions: () => {
    // Required for the authentication to work
    return Promise.resolve();
  },
  logout: () => {
    const request = new Request(`${location.origin}/api/admin/signout`, {
      method: "GET",
    });
    return fetch(request)
      .then((res) => res.json())
      .then((res: TApiResponse) => {
        if (!res.success) throw new Error(`${res.message} (${res.error})`);
        localStorage.removeItem("kadmxs");
        return Promise.resolve();
      })
      .catch(() => {
        throw new Error("Network error");
      });
  },
  getIdentity: () => {
    const request = new Request(`${location.origin}/api/admin/me`, {
      method: "GET",
    });
    return fetch(request)
      .then((res) => res.json())
      .then(
        (
          res: TApiResponse<{
            id: string;
            name: string;
          }>
        ) => {
          if (!res.success)
            return Promise.reject(`${res.message} (${res.error})`);
          if (!res.result) return Promise.reject();
          return Promise.resolve({
            id: res.result.id,
            fullName: res.result.name,
          } as UserIdentity);
        }
      )
      .catch(() => {
        throw new Error("Network error");
      });
  },
};

export default authProvider;
