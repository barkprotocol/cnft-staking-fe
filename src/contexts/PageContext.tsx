"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from "react";

// Define the type for the PageContext
interface PageContextType {
  solPrice: number;
  refreshSolPrice: () => void; // Function to manually refresh the SOL price
  isLoading: boolean; // Loading state for data fetching
  error: string | null; // Error state for data fetching
}

// Default value for context
const defaultValue: PageContextType = {
  solPrice: 0,
  refreshSolPrice: () => {},
  isLoading: false,
  error: null,
};

// Create context with default value
export const PageContext = createContext<PageContextType>(defaultValue);

// Custom hook to use PageContext
export function usePageContext() {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error("usePageContext must be used within a PageProvider");
  }
  return context;
}

interface PageProviderProps {
  children: ReactNode;
}

// PageProvider component to provide context value
export function PageProvider({ children }: PageProviderProps) {
  const [solPrice, setSolPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSolPrice = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      setSolPrice(data.solana.usd);
    } catch (error: any) {
      console.error("Error fetching SOL price:", error);
      setError(error.message || "An error occurred while fetching the price.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch the price initially
    fetchSolPrice();
    
    // Set up polling every 60 seconds
    const intervalId = setInterval(fetchSolPrice, 60 * 1000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [fetchSolPrice]);

  // Function to manually refresh the SOL price
  const refreshSolPrice = () => {
    fetchSolPrice();
  };

  return (
    <PageContext.Provider value={{ solPrice, refreshSolPrice, isLoading, error }}>
      {children}
    </PageContext.Provider>
  );
}
