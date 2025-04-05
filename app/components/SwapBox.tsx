'use client';

declare global {
  interface Window {
    ethereum?: any;
  }
}

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const AET_ADDRESS = '0xa9fE432eeC1cF3b1ec655f6cAb5cEB5fe2042bcb';
const AET_ABI = [
  "function wrap() payable",
  "function unwrap(uint256 amount)",
  "function balanceOf(address) view returns (uint256)",
];

export default function SwapBox() {
  const [amount, setAmount] = useState('');
  const [direction, setDirection] = useState<'wrap' | 'unwrap'>('wrap');
  const [teaBalance, setTeaBalance] = useState('0');
  const [aetBalance, setAetBalance] = useState('0');
  const [txHistory, setTxHistory] = useState<string[]>([]); // ← TX history state

  const handleSwap = async () => {
    try {
      if (!window.ethereum) return alert('Please connect your wallet.');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(AET_ADDRESS, AET_ABI, signer);

      const tx = direction === 'wrap'
        ? await contract.wrap({ value: ethers.parseEther(amount) })
        : await contract.unwrap(ethers.parseEther(amount));

      await tx.wait();
      alert('Swap success!');
      setTxHistory((prev) => [tx.hash, ...prev]); // ← simpan tx hash
      fetchBalances();
    } catch (err) {
      console.error(err);
      alert('Swap failed!');
    }
  };

  const switchDirection = () => {
    setDirection((prev) => (prev === 'wrap' ? 'unwrap' : 'wrap'));
    setAmount('');
  };

  const fetchBalances = async () => {
    if (!window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    const tea = await provider.getBalance(address);
    setTeaBalance(ethers.formatEther(tea));

    const contract = new ethers.Contract(AET_ADDRESS, AET_ABI, provider);
    const aet = await contract.balanceOf(address);
    setAetBalance(ethers.formatEther(aet));
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  const fromToken = direction === 'wrap' ? 'TEA' : 'AET';
  const toToken = direction === 'wrap' ? 'AET' : 'TEA';
  const fromBalance = direction === 'wrap' ? teaBalance : aetBalance;

  return (
    <div className="bg-white dark:bg-zinc-900/90 backdrop-blur border border-zinc-700 rounded-2xl shadow-2xl p-6 w-full max-w-md text-black dark:text-white">
      <h2 className="text-xl font-bold mb-6 text-center">AETSwap</h2>

      {/* FROM Box */}
      <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-4 mb-3">
        <div className="flex justify-between text-sm text-zinc-400 mb-1">
          <span>From</span>
          <span>Balance: {parseFloat(fromBalance).toFixed(4)}</span>
        </div>
        <div className="flex items-center justify-between">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="bg-transparent text-xl font-semibold outline-none w-full appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <div className="ml-4 text-lg font-semibold tracking-wide">
            {fromToken}
          </div>
        </div>
        <div className="text-sm text-zinc-500 mt-1">~ ${(Number(amount) || 0).toFixed(2)} USD</div>
      </div>

      {/* Switch Button */}
      <div className="flex justify-center my-3">
        <button
          onClick={switchDirection}
          className="bg-zinc-200 dark:bg-zinc-700 p-2 rounded-full hover:rotate-180 hover:scale-110 shadow transition-all duration-300"
          title="Switch"
        >
          🔁
        </button>
      </div>

      {/* TO Box */}
      <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl p-4 mb-6">
        <div className="flex justify-between text-sm text-zinc-400 mb-1">
          <span>To</span>
          <span>Est. Rate: 1:1</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">{amount || '0.0'}</div>
          <div className="ml-4 text-lg font-semibold tracking-wide">
            {toToken}
          </div>
        </div>
        <div className="text-sm text-zinc-500 mt-1">~ ${(Number(amount) || 0).toFixed(2)} USD</div>
      </div>

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        className="w-full bg-cyan-500 hover:bg-cyan-600 p-3 rounded-xl text-white font-semibold text-lg transition"
      >
        Swap
      </button>

      {/* Footer */}
      <div className="text-center text-xs text-zinc-400 mt-6 space-y-1">
        <p>Built on Tea Sepolia Testnet</p>
        <p>
          Built with ❤️ by <a href="https://github.com/bapakkau15" className="underline" target="_blank" rel="noopener noreferrer">bapakkau15</a>
        </p>
        <p>tea username: <span className="font-mono">riyanibay</span></p>
      </div>

      {/* TX History */}
      {txHistory.length > 0 && (
        <div className="mt-6 text-left text-sm space-y-1">
          <h3 className="text-center font-semibold">Transaction History</h3>
          {txHistory.map((hash, index) => (
            <a
              key={index}
              href={`https://sepolia.tea.xyz/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-500 hover:underline break-all"
            >
              {hash}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
