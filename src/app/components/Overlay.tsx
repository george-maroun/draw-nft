"use client"
import { createPortal } from 'react-dom';
// import { SiFarcaster } from "react-icons/si";
import { SiOpensea } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import { IoDownloadOutline } from "react-icons/io5";
// import Image from 'next/image';
// TODO: Refactor this pasta code

interface IOverlayProps {
  address: any;
  nftData: any;
  imageData: string;
  collectionAddress: string;
  onClose: () => void;
}


const Overlay = ({ address, nftData, imageData, collectionAddress, onClose }: IOverlayProps) => {
  if (typeof window === 'undefined') {
    // Return null or a fallback component for server-side rendering environments
    return null;
  }

  const handleDownloadImage = () => {
    // Create a link element
    const link = document.createElement('a');
    link.href = imageData; // Set the href to the image data URL
    link.download = "my_nft.png"; // Set the download attribute with a filename
    document.body.appendChild(link); // Append the link to the body
    link.click(); // Trigger the click to download
    document.body.removeChild(link); // Clean up by removing the link
  };
  
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 " onClick={onClose}>
      <div className="bg-white p-5 rounded-2xl z-50 flex flex-col" onClick={e => e.stopPropagation()}>
        <img src={imageData} height={380} width={380} alt="Minted NFT" className="max-w-full max-h-screen border border-gray-200"/>

        <div className="flex lg:flex-row flex-col justify-evenly mt-0 lg:gap-2 lg:items-center">
          
          <button 
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=Just%20minted%20my%20artwork%20on%20https%3A%2F%2Fbasebrush.xyz`, '_blank')}
            className='lg:w-6/12 w-full h-10 pl-4 pr-4 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-300 flex flex-row items-center justify-center gap-1 mt-4'
          >
            <FaXTwitter/> Share on X
          </button>
          <button 
            onClick={handleDownloadImage}
            className='lg:w-6/12 w-full h-10 pl-4 pr-4 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-300 flex flex-row items-center justify-center gap-1 mt-4'
          >
            <IoDownloadOutline /> Save Image
          </button>
          
        </div>
        <button 
          onClick={() => window.open(`https://opensea.io/${address}`, '_blank')}
          className='h-10 pl-4 pr-4 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:border-gray-300 flex flex-row items-center justify-center gap-1 mt-3'
          >
            <SiOpensea/> View on OpenSea
          </button>
      </div>
    </div>,
    document.body
  );
}

export default Overlay;