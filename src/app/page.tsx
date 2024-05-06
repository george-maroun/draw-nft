"use client"
import { useState, useEffect, useRef } from 'react';
import Canvas from './components/Canvas';
import MintForm from './components/MintForm';
import axios from 'axios';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, BaseError } from 'wagmi';
import { abi } from '../../lib/abi/abi';
import toast, { Toaster } from 'react-hot-toast';
import Overlay from './components/Overlay';
import { SiFarcaster } from "react-icons/si";
import { SiOpensea } from "react-icons/si";
import { FaEthereum } from "react-icons/fa";

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

  const [mintedImageData, setMintedImageData] = useState('');
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(10);
  const [isMinting, setIsMinting] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
  });

  const [isTouchingCanvas, setIsTouchingCanvas] = useState(false);

  const { 
    data: hash,
    error, 
    isPending, 
    writeContract 
  } = useWriteContract()

  // Width and height of the canvas (it's a square canvas)
  let CANVAS_SIZE:number = 600;

  const NFT_CONTRACT_ADDRESS = '0xE5E25645468A76949d3D1847cBF4c37e11dDbEd6';

  const containerRef = useRef(null);

  useEffect(() => {
    const handleTouchMove = (event:any) => {
      if (isTouchingCanvas) {
        event.preventDefault();
      }
    };
    // Adding event listener
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      // Removing event listener
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isTouchingCanvas]); 

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    });

  const toastIdRef = useRef('');

  useEffect(() => {
    if (isConfirming) {
      toastIdRef.current = toast.loading('Minting NFT...');
    } else if (isConfirmed) {
      toast.dismiss(toastIdRef.current);
      toast.success('Transaction confirmed');
      setShowOverlay(true);
    } else if (error) {
      toast.dismiss(toastIdRef.current);
      toast.error(`Error: ${(error as BaseError).shortMessage || error.message}`);
    }

    return () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, [isConfirming, isConfirmed, error]); 


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

    setMintedImageData(imageData);
    if (!address) {
      toast.error('Connect your wallet to mint NFTs');
      return;
    }
    if (!formData.name || !formData.description) {
      toast.error('Missing name or description');
      return;
    }
    console.log('Minting image...');
    const toastId = toast.loading('Preparing to mint NFT...');
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

      const ipfsHash = response.data.ipfsHash;

      try {
        const tx = await writeContract({
          abi,
          address: NFT_CONTRACT_ADDRESS,
          functionName: 'safeMint',
          args: [`ipfs://${ipfsHash}`],
        });

        console.log('Transaction initiated:', tx);
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
          imageData={mintedImageData} 
          collectionAddress={NFT_CONTRACT_ADDRESS} 
          onClose={closeOverlay} 
        />}

      <div className='z-10 flex flex-col items-center lg:p-10 lg:pl-16 lg:pr-16 lg:pt-7 pt-4 lg:w-auto md:w-8/12 w-full bg-white relative rounded-3xl'>
        <div className='absolute lg:right-10 top-7 right-4'>
          <w3m-button />
        </div>
        <div className='absolute lg:left-16 top-8 left-5 mb-6'>
          
          <div className='flex lg:flex-row flex-col lg:gap-6 gap-4'>
            <div className='text-sm italic'>
              @ B a s e B r u s h  🎨
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <div className='lg:p-0 p-5 lg:pt-12 pt-16'>
            
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
              setIsTouchingCanvas={setIsTouchingCanvas}
            />
            <div className='lg:p-0 p-5 pt-0 lg:pt-0 flex flex-col lg:justify-between'>
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
              <div className='flex flex-row gap-8 lg:justify-end justify-center pr-2 mb-2'>
                <div className='flex items-center gap-1'>
                  <FaEthereum style={{color: '#888888'}}/>
                </div>
                <div className='flex items-center gap-1'>
                  <SiFarcaster style={{color: '#888888'}}/>
                </div>
                <div className='flex items-center gap-1'>
                  <SiOpensea style={{color: '#888888'}}/>
                </div>
              </div>
            </div>
            
          </div>
        </div>

            <div className='lg:h-0 h-4'></div>

        
      </div>
      <div className=' h-6'></div>

  
    </main>
  );
}
