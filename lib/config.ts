import { http, createConfig } from 'wagmi'
import { base, mainnet, baseSepolia } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || '' // WalletConnect project ID;


export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    // metaMask(),
    safe(),
  ],
  transports: {
    // [mainnet.id]: http(),
    [baseSepolia.id]: http(),
  },
})