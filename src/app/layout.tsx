import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WagmiProviderComp from "../../lib/wagmi-provider";
import { config } from "../../lib/config";
import { cookieToInitialState } from "wagmi";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BaseBrush",
  description: "Create and mint NFTs with your own art",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <WagmiProviderComp initialState={initialState}>
        <html lang="en">
          <body className={inter.className}>
            {children}
          </body>
        </html>
    </WagmiProviderComp>
  );
}
