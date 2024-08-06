"use client";

import { FC, useCallback, useEffect, useState } from "react";
import ConnectButton from "@/components/ConnectButton";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { solConnection } from "@/utils/util";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SolanaIcon } from "./SvgIcon";

interface HeaderProps {
  staked: number; // Currently unused but might be used for future features
}

const Header: FC<HeaderProps> = () => {
  const { publicKey, connected } = useWallet();
  const [solBalance, setSolBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch SOL balance
  const getBalance = useCallback(async () => {
    if (publicKey) {
      try {
        const price = await solConnection.getBalance(publicKey);
        setSolBalance(price / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [publicKey]);

  // Effect to fetch balance when publicKey changes
  useEffect(() => {
    if (publicKey) {
      setLoading(true);
      getBalance();
    }
  }, [publicKey, getBalance]);

  return (
    <header className="py-4 lg:py-7 z-50 relative">
      <div className="flex items-center justify-between max-w-[1080px] mx-auto">
        {/* Left section: Logo and Balance */}
        <div className="text-white md:w-1/3 flex items-center gap-2">
          <div className="relative w-11 h-11 md:hidden">
            <Image
              fill
              className="object-contain"
              src="/images/logo.png"
              alt="Logo"
            />
          </div>
          {publicKey && (
            <div>
              <span className="text-xs md:text-sm flex gap-1 opacity-80">
                <span className="hidden md:block">Your </span>Balance:{" "}
              </span>
              {connected ? (
                loading ? (
                  <div className="animate-pulse rounded-md bg-white/20 w-24 h-6" />
                ) : (
                  <div className="font-bold flex items-center gap-2">
                    <SolanaIcon className="w-3 h-3 opacity-60" />
                    {solBalance.toLocaleString()}{" "}
                    <span className="opacity-60 hidden md:block">SOL</span>
                  </div>
                )
              ) : (
                <span>N/A</span>
              )}
            </div>
          )}
        </div>

        {/* Center section: Logo */}
        <div className="hidden md:flex md:w-1/3 justify-center">
          <div className="relative w-[60px] h-[60px]">
            <Image
              fill
              className="object-contain"
              src="/images/logo.png"
              alt="Logo"
            />
          </div>
        </div>

        {/* Right section: Connect Button */}
        <div className="flex items-center justify-end gap-2 md:w-1/3">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
