"use client";
import React, { ReactNode } from "react";
import { PageProvider } from "@/contexts/PageContext";
import { SolanaWalletProvider } from "@/contexts/SolanaWalletProvider";
import { ToastContainer } from "react-toastify";
import { ModalProvider } from "@/contexts/ModalProvider";

// Define a type for the props
interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SolanaWalletProvider>
      <ModalProvider>
        <PageProvider>
          {children}
          <ToastContainer
            pauseOnFocusLoss={false}
            theme="colored"
            closeOnClick
          />
        </PageProvider>
      </ModalProvider>
    </SolanaWalletProvider>
  );
}
