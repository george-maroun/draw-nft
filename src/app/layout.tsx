import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WagmiProviderComp from "../../lib/wagmi-provider";
import { config } from "../../lib/config";
import { cookieToInitialState } from "wagmi";
import { headers } from "next/headers";
import Script from 'next/script'

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
          <head>
            <Script
              src="https://cdn.cookie3.co/scripts/analytics/0.11.4/cookie3.analytics.min.js"
              integrity="sha384-lzDmDdr/zEhMdlE+N04MgISCyL3RIWNCb9LjsrQeEFi8Gy5CKXIRI+u58ZV+ybYz"
              crossOrigin="anonymous"
              async
              strategy="lazyOnload"
              data-site-id="1271"
              data-chain-tracking-enabled="true"
            />
        </head>
          <body className={inter.className}>
            {children}
          </body>
        </html>
    </WagmiProviderComp>
  );
}
