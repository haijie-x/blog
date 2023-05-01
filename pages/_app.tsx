import { AppProps } from "next/app";
import "../styles/index.css";
import { initTheme } from "../hooks/useTheme";

export default function MyApp({ Component, pageProps }: AppProps) {
  initTheme();
  return <Component {...pageProps} />;
}
