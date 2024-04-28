"use client"
import { useState, TouchEvent } from 'react';
import Canvas from './components/Canvas';
import MintForm from './components/MintForm';
import axios from 'axios';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { abi } from '../../lib/abi/abi';
// import { type WriteContractReturnType } from '@wagmi/core'

export interface IFormData {
  name: string;
  description: string;
  isPending: boolean;
  hash: string | null;
  isConfirming: boolean;
  isConfirmed: boolean;
  error: any;
}

export default function Home() {
  const { address } = useAccount();

  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(10);

  let windowWidth = 0;
  if (typeof window !== "undefined") {
    windowWidth = window.innerWidth;
  }
  // Width and height of the canvas (it's a square canvas)
  const CANVAS_SIZE = windowWidth < 450 ? 390 : 450;
  const NFT_CONTRACT_ADDRESS = '0xCb32931000319F4d6183B3e5D5940e997e2caF14';

  const { 
    data: hash,
    error, 
    isPending, 
    writeContract 
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    }) 

  // Using a single state object for form and transaction status
  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
  });

  // const handleTouchDraw = (event: React.TouchEvent<HTMLDivElement>) => {
  //   event.preventDefault(); // Prevent touch-related scrolling
  // };

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData:any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to get canvas content as data URL
  // const getCanvasImage = () => {
  //   const canvas = canvasRef.current;
  //   return canvas ? canvas.toDataURL("image/png") : "";
  // };

  const mintImage = async () => {
    console.log('Minting image...');
    const imageData = document.querySelector('canvas')?.toDataURL("image/png");
    if (!imageData) return;
    const base64Data = imageData.split(",")[1];

    if (!address) {
      return;
    }

    let ipfsHash = '';
    try {
      const response = await axios.post(
        "/api/imageStorage",
        { 
          image: base64Data,
          name: formData.name,
          description: formData.description,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      ipfsHash = response.data.ipfsHash;
      console.log("Image stored successfully:", response.data);
    } catch (err) {

      console.log('Error storing image:', err);
      return;
    }

    try {
      const tx = await writeContract({
        abi,
        address: NFT_CONTRACT_ADDRESS,
        functionName: 'safeMint',
        args: [address, `ipfs://${ipfsHash}`],
      });

      console.log('Transaction initiated:', tx);
    } catch (err: any) {
      console.log('Error executing writeContract:', err);
    }
  };

  return (
    <main className='pt-4 pb-4 flex flex-col items-center font-inter text-sm'>
      <div className='flex flex-col items-center lg:p-10 pt-5 lg:w-4/5 w-full bg-white relative rounded-2xl'>
        <div className='absolute top-4 right-4'>
          <w3m-button />
        </div>
        
        <div className='flex flex-col gap-3'>
          <div className='lg:p-0 p-4'>
            <div className='text-sm mb-6 italic'>
              @PaintOnBase 🎨
            </div>
            <h1 className='text-2xl font-semibold mb-2'>Create an NFT</h1>
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
            />
            <div className='lg:p-0 p-4'>
              <MintForm
                address={address}
                formData={formData}
                handleFormChange={handleFormChange}
                mintImage={mintImage}
                isPending={isPending}
                hash={hash}
                isConfirming={isConfirming}
                isConfirmed={isConfirmed}
                error={error}
              />
            </div>
            
          </div>
        </div>
      </div>
      <div className='lg:h-32 h-16'>
      </div>
    </main>
  );
}
