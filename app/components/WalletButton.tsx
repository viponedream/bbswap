'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export default function WalletButton() {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAddress(accounts[0].address);
        }
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask');
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAddress(accounts[0]);
    } catch (err) {
      console.error(err);
      alert('Connection failed');
    }
  };

  return (
    <div className="absolute top-6 right-6">
      {address ? (
        <div className="bg-green-800 text-white px-4 py-2 rounded-full font-mono text-sm">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-semibold"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
