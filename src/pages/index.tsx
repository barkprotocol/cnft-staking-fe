import { Background } from "@/components/Widgets";
import dynamic from "next/dynamic";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Spinner } from "@chakra-ui/react";

// Dynamically import MainPage without server-side rendering
const MainPage = dynamic(() => import("@/components/MainPage"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <Spinner size="xl" />
    </div>
  ),
});

export default function Home() {
  return (
    <main
      className="relative min-h-screen bg-black bg-opacity-75 backdrop-blur-lg"
      role="main"
      aria-label="Main content"
    >
      <ErrorBoundary>
        <MainPage />
      </ErrorBoundary>
      <Background />
    </main>
  );
}
