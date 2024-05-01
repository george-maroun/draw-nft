import { createPortal } from 'react-dom';
import Image from 'next/image';

interface IOverlayProps {
  imageUrl: string;
  collectionAddress: string;
  onClose: () => void;
}

// Overlay Component
const Overlay = ({ imageUrl, collectionAddress, onClose }: IOverlayProps) => {
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-4 rounded-lg z-50" onClick={e => e.stopPropagation()}>
        <Image src={imageUrl} width={600} height={600} alt="Minted NFT" className="max-w-full max-h-screen"/>
        <div className="flex justify-around mt-4">
          <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(imageUrl)}`, '_blank')}>Share on Twitter</button>
          <button onClick={() => window.open(`https://www.instagram.com/`, '_blank')}>Share on Instagram</button>
          <button onClick={() => window.open(`https://farcaster.xyz/`, '_blank')}>Share on Farcaster</button>
          <button onClick={() => window.open(`https://opensea.io/assets/${collectionAddress}`, '_blank')}>Open on OpenSea</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Overlay;