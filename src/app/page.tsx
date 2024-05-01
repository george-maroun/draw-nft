"use client"
import { useState, useEffect, useRef } from 'react';
import Canvas from './components/Canvas';
import MintForm from './components/MintForm';
import axios from 'axios';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { abi } from '../../lib/abi/abi';
import toast, { Toaster } from 'react-hot-toast';
import Overlay from './components/Overlay';

export interface IFormData {
  name: string;
  description: string;
  isMinting: boolean;
  isPending: boolean;
  hash: string | null;
  isConfirming: boolean;
  isConfirmed: boolean;
  error: any;
}

export default function Home() {
  const { address } = useAccount();
  const [showOverlay, setShowOverlay] = useState(false);
  const [mintedImageUrl, setMintedImageUrl] = useState('');

  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(10);
  const [isMinting, setIsMinting] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
  });

  const { 
    data: hash,
    error, 
    isPending, 
    writeContract 
  } = useWriteContract()

  // Width and height of the canvas (it's a square canvas)
  let CANVAS_SIZE:number = 600;

  const NFT_CONTRACT_ADDRESS = '0xCb32931000319F4d6183B3e5D5940e997e2caF14';

  const containerRef = useRef(null);

  useEffect(() => {
    const container:any = containerRef.current;

    const handleTouchMove = (event:any) => {
      event.preventDefault();
    };

    if (container) {
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, []);

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    })

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData:any) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  // Function to close the overlay
  const closeOverlay = () => {
    setShowOverlay(false);
  };

  const mintImage = async () => {
    console.log('mintImage called');
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      toast.error('Canvas not found');
      return;
    }

    const imageData = canvas.toDataURL("image/png");
    const base64Data = imageData.split(",")[1];

    if (!address) {
      toast.error('Connect your wallet to mint NFTs');
      return;
    }
    if (!formData.name || !formData.description) {
      toast.error('Missing name or description');
      return;
    }
    console.log('Minting image...');
    const toastId = toast.loading('Minting NFT...');
    setIsMinting(prev => true);
    try {
      const response = await axios.post("/api/imageStorage", {
        image: base64Data,
        name: formData.name,
        description: formData.description,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Image stored successfully:", response.data);
      const ipfsHash = response.data.ipfsHash;

      try {
        const tx = await writeContract({
          abi,
          address: NFT_CONTRACT_ADDRESS,
          functionName: 'safeMint',
          args: [address, `ipfs://${ipfsHash}`],
        });

        console.log('Transaction initiated:', tx);

        toast.success('Successfully minted NFT');

        setShowOverlay(true);
        setMintedImageUrl(`ipfs://${response.data.ipfsHash}`);
      } catch (err: any) {
      
        console.error('Error executing writeContract:', err);
        toast.error('Error during contract execution');
      }
    } catch (err: any) {
      console.error('Something went wrong while minting NFT:', err);
      
      toast.error('Failed to mint NFT');
    } finally {
      toast.dismiss(toastId);
      setIsMinting(prev => false);
    }
  };

  return (
    <main className='pt-6 pb-4 flex flex-col items-center font-inter text-sm pl-1 pr-1' ref={containerRef}>
      <Toaster />

      {showOverlay && 
        <Overlay 
          nftData={formData}
          imageUrl={mintedImageUrl} 
          collectionAddress={NFT_CONTRACT_ADDRESS} 
          onClose={closeOverlay} 
        />}

      <div className='z-10 flex flex-col items-center lg:p-10 lg:pl-16 lg:pr-16 lg:pt-7 pt-4 lg:w-auto md:w-8/12 w-full bg-white relative rounded-3xl'>
        <div className='absolute lg:right-10 top-6 right-4'>
          <w3m-button />
        </div>
        
        <div className='flex flex-col gap-3'>
          <div className='lg:p-0 p-5 pt-4'>
            <div className='text-sm mb-6 italic'>
              @BaseBrush 🎨
            </div>
            <h1 className='text-2xl font-semibold mt-1 mb-2'>Create an NFT</h1>
            <p className='text-sm'>Once the item is minted, you will be able to see it on OpenSea</p>
          </div>
          <div className='flex lg:flex-row flex-col gap-10'>
            <Canvas
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              brushColor={brushColor}
              setBrushColor={setBrushColor}
              brushSize={brushSize}
              setBrushSize={setBrushSize}
              onClearCanvas={() => {
                const ctx = document.querySelector('canvas')?.getContext('2d');
                if (ctx) {
                  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
                }
              }}
              containerRef={containerRef}
            />
            <div className='lg:p-0 p-5 pt-0 lg:pt-0'>
              <MintForm
                address={address}
                formData={formData}
                handleFormChange={handleFormChange}
                mintImage={mintImage}
                isMinting={isMinting}
                isPending={isPending}
                hash={hash}
                isConfirming={isConfirming}
                isConfirmed={isConfirmed}
                error={error}
              />
            </div>
            
          </div>
        </div>
        <div className='h-2'></div>
        
      </div>
      <div className=' h-6'></div>

  
    </main>
  );
}


    // {/* <div className='flex flex-col items-center lg:p-16 pt-5 lg:w-4/5 w-full bg-white relative rounded-2xl'>
    //   <div>
    //       <h1 className='text-2xl font-semibold mb-2'>Gallery 🎨</h1>
    //       <p className='text-sm mb-4'>Discover what others have created</p>

    //       <div className="flex flex-col gap-2">
    //       {[...Array(3)].map((_, rowIndex) => (
    //         <div key={rowIndex} className="flex gap-2">
    //           {[...Array(3)].map((_, colIndex) => (
    //             <div key={`${rowIndex}-${colIndex}`} className="w-64 h-64 bg-gray-200 rounded-lg"></div>
    //           ))}
    //         </div>
    //         ))}
    //       </div>
          
    //     </div>
    //   </div> */}