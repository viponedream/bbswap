import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BBSwap – Swap TEA ↔ BB',
  description: 'Wrap & unwrap TEA to BB on Tea Sepolia testnet',
  icons: {
    icon: 'images/aet.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
