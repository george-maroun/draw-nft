import { createPublicClient, http, parseAbi } from 'viem'
import { baseSepolia, base } from 'viem/chains'
import { abi } from '../contract/abi'
import { NFT_CONTRACT_ADDRESS } from '../contract/address'

const ALCHEMY_URL = process.env.ALCHEMY_URL || '';

const contractAddress = NFT_CONTRACT_ADDRESS;

const publicClient = createPublicClient({
  chain: base,
  transport: http(ALCHEMY_URL),
})

// Read the balance of an address from the contract
async function readContract(address:any) {
  const count = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: 'getNumTokensForAddress',
    args: [address],
  })

  return count;
}

const getWalletMintCount = async (wallet: string) => {
  try {
    const count = await readContract(wallet);
    return Number(count);
  }
  catch (error) {
    console.error('Error fetching wallet mint count:', error);
    return -1;
  }
}

export default getWalletMintCount;