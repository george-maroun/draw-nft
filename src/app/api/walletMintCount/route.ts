import type { NextRequest } from 'next/server'
import getWalletMintCount from '../../../../lib/helpers/getWalletMintCount'
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get('wallet');

  if (!wallet) {
    return new Response('Missing wallet address', { status: 400 });
  }
  try {
    const count = await getWalletMintCount(wallet);
    return new Response(JSON.stringify({ walletMintCount: count }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }
  catch (error) {
    return new Response('Error fetching wallet mint count', { status: 200 });
  }
}