import * as anchor from "@coral-xyz/anchor";
import { solConnection } from "@/utils/util";
import type { NextApiRequest, NextApiResponse } from "next";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Transaction } from "@solana/web3.js";

type Data = {
  status: string;
  tx?: string;
  error?: string;
};

// Initialize admin wallet
let adminWallet: NodeWallet;

const initializeWallet = () => {
  try {
    const adminKeypair = anchor.web3.Keypair.fromSecretKey(
      bs58.decode(process.env.ADMIN_WALLET as string)
    );
    adminWallet = new NodeWallet(adminKeypair);
  } catch (error) {
    console.error("Failed to initialize admin wallet:", error);
    throw new Error("Failed to initialize wallet. Check server logs for details.");
  }
};

// Initialize the wallet when the server starts
initializeWallet();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ status: "Failed", error: "Method Not Allowed" });
    return;
  }

  try {
    const { txData } = req.body;

    if (typeof txData !== "string") {
      res.status(400).json({ status: "Failed", error: "Invalid transaction data format" });
      return;
    }

    // Decode the transaction from base64
    let tx = Transaction.from(Buffer.from(txData, 'base64'));

    // Sign the transaction with admin's Keypair
    tx = await adminWallet.signTransaction(tx);
    console.log("Signed by admin: ", adminWallet.publicKey.toBase58());

    const sTx = tx.serialize();

    // Send the raw transaction
    const options = {
      commitment: "confirmed",
      skipPreflight: false,
    };

    // Confirm the transaction
    const signature = await solConnection.sendRawTransaction(sTx, options);
    await solConnection.confirmTransaction(signature, "confirmed");

    console.log("Transaction confirmed:", signature);
    res.status(200).json({ status: "Confirmed", tx: signature });
  } catch (error) {
    // Ensure error message is captured and returned
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Transaction error:", errorMessage);
    res.status(500).json({ status: "Failed", error: errorMessage });
  }
}
