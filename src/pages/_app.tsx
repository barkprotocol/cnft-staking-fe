import Providers from "@/components/providers"; // Custom provider component
import "@/styles/globals.css"; // Global styles
import "react-toastify/dist/ReactToastify.css"; // Toast notification styles
import type { AppProps } from "next/app"; // Type for app props

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers> {/* Wrapping with providers for global context */}
      <Component {...pageProps} /> {/* Rendering the page component with its props */}
    </Providers>
  );
}
