import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Cross from "../components/icon/Cross";
import Info from "../components/icon/Info";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer
        position="top-center"
        closeButton={false}
        icon={({ type }) => {
          console.log(type);
          return type == "error" ? (
            <Cross size={15} color="Light" />
          ) : (
            <Info color={type == "default" ? undefined : "Light"} />
          );
        }}
      />
    </>
  );
}

export default MyApp;
