import SwapBox from "./components/SwapBox";
import WalletButton from "./components/WalletButton";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      <WalletButton />
      <div className="absolute w-[600px] h-[600px] bg-purple-500 blur-[160px] opacity-20 rounded-full -z-10" />
      <SwapBox />
    </main>
  );
}
