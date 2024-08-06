"use client";

import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { ArrowLine, ExitIcon, WalletIcon } from "./SvgIcon";

const ConnectButton: FC = () => {
  const { setVisible } = useWalletModal();
  const { publicKey, disconnect } = useWallet();

  return (
    <button className="relative flex items-center justify-center rounded-lg border border-[#ffffff20] bg-[#272727] text-[#ffffff] tracking-[0.32px] py-2 px-4 w-[180px] h-10 group">
      {publicKey ? (
        <>
          <div className="flex items-center text-sm">
            <span>{publicKey.toBase58().slice(0, 4)}....{publicKey.toBase58().slice(-4)}</span>
            <div className="rotate-90 ml-2 w-5 h-5">
              <ArrowLine className="w-5 h-5" />
            </div>
          </div>
          <div className="absolute top-full right-0 mt-2 hidden group-hover:block">
            <ul className="border border-[#ffffff20] rounded-lg bg-[#272727] p-2">
              <li>
                <div
                  className="flex items-center gap-2 mb-1 text-white/90 text-sm cursor-pointer"
                  onClick={() => setVisible(true)}
                >
                  <WalletIcon className="w-4 h-4" fill="#ffffff" /> Change Wallet
                </div>
              </li>
              <li>
                <div
                  className="flex items-center gap-2 text-white/90 text-sm cursor-pointer"
                  onClick={disconnect}
                >
                  <ExitIcon className="w-4 h-4" fill="#ffffff" /> Disconnect
                </div>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div
          className="flex items-center gap-1 text-sm cursor-pointer"
          onClick={() => setVisible(true)}
        >
          Connect wallet <ArrowLine />
        </div>
      )}
    </button>
  );
};

export default ConnectButton;
