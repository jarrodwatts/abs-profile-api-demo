"use client";

import React from "react";
import { useAccount } from "wagmi";
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import UserProfile from "@/components/UserProfile";

export default function Home() {
  const { address, isConnecting, isReconnecting, isConnected } = useAccount();
  const { login } = useLoginWithAbstract();

  // 1. Loading / connecting states -----------------------------------------
  if (isConnecting || isReconnecting) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900">
        <p className="text-lg font-medium text-white">Connecting to wallet…</p>
      </main>
    );
  }

  // 2. Not connected --------------------------------------------------------
  if (!isConnected) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 gap-4 bg-gray-900">
        <button
          onClick={login}
          className="rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Connect Wallet
        </button>
      </main>
    );
  }

  // 3. Connected ------------------------------------------------------------
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900">
      <UserProfile />
    </main>
  );
}
