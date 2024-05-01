"use client"
import { createPortal } from 'react-dom';
import { SiFarcaster } from "react-icons/si";
import { SiOpensea } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import Image from 'next/image';
// TODO: Refactor this pasta code

interface IOverlayProps {
  nftData: any;
  imageUrl: string;
  collectionAddress: string;
  onClose: () => void;
}


const Overlay = ({ nftData, imageUrl, collectionAddress, onClose }: IOverlayProps) => {
  if (typeof window === 'undefined') {
    // Return null or a fallback component for server-side rendering environments
    return null;
  }
  
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 " onClick={onClose}>
      <div className="bg-white p-5 rounded-2xl z-50 flex flex-col" onClick={e => e.stopPropagation()}>

        <img src={imageUrl} alt="Minted NFT" className="max-w-full max-h-screen"/>
        <div className="flex lg:flex-row flex-col justify-evenly mt-0 lg:gap-2">
          <button 
            onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(imageUrl)}`, '_blank')}
            className='lg:w-6/12 w-full p-2 pl-4 pr-4 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-300 flex flex-row items-center justify-center gap-1 mt-4'
          >
            <FaXTwitter/> Share on X
          </button>
          <button 
            onClick={() => window.open(`https://farcaster.xyz/`, '_blank')}
            className='lg:w-6/12 w-full p-2 pl-4 pr-4 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-300 flex flex-row items-center justify-center gap-1 mt-3'
          >
            <SiFarcaster/> Share on Farcaster
          </button>
          
        </div>
        <button 
          onClick={() => window.open(`https://opensea.io/assets/${collectionAddress}`, '_blank')}
          className='p-2 pl-4 pr-4 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-300 flex flex-row items-center justify-center gap-1 mt-3'
          >
            <SiOpensea/> View on OpenSea
          </button>
      </div>
    </div>,
    document.body
  );
}

export default Overlay;