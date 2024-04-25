// import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
// import { cookieStorage, createStorage } from "wagmi";
// import { mainnet, sepolia, base, baseSepolia } from "wagmi/chains";
 
// export const projectId = 'b03a9cfe061dd79ffc8a8a28fd22ce10'
 
// if (!projectId) throw new Error("Project ID is not defined");
 
// const metadata = {
//   name: "Web3Modal Example",
//   description: "Web3Modal Example",
//   url: "https://web3modal.com",
//   icons: ["https://avatars.githubusercontent.com/u/37784886"],
// };
 
// export const config = defaultWagmiConfig({
//   chains: [baseSepolia],
//   projectId,
//   metadata,
//   ssr: true,
//   storage: createStorage({
//     storage: cookieStorage,
//   }),
// });

import { http, createConfig } from 'wagmi'
import { base, mainnet, baseSepolia } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

export const projectId = process.env.WALLET_CONNECT_PROJECTID || '';

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