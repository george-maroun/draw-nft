// "use client"

// import { useRef, useState } from 'react';
// import axios from 'axios';
// import { useAccount, useSignMessage, useWriteContract, useWaitForTransactionReceipt, type BaseError } from 'wagmi'
// import { abi } from '../../lib/abi/abi';

// export default function Home() {
//   // Canvas reference
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [drawing, setDrawing] = useState(false);

//   // Brush settings
//   const [brushColor, setBrushColor] = useState('#000000');
//   const [brushSize, setBrushSize] = useState(10);

//   const [isFormVisible, setFormVisible] = useState(false); // Control form visibility
//   const [formData, setFormData] = useState({ name: "", description: "" }); // Store form data

//   const { address, isConnecting, isDisconnected } = useAccount()
//   console.log('address:', address)
//   console.log('isConnecting:', isConnecting)

//   const { signMessage } = useSignMessage()
//   const { 
//     data: hash,
//     error, 
//     isPending, 
//     writeContract 
//   } = useWriteContract() 

//   // Get canvas context
//   const getContext = () => {
//     const canvas = canvasRef.current;
//     return canvas ? canvas.getContext('2d') : null;
//   };

//   // Function to get canvas content as data URL
//   const getCanvasImage = () => {
//     const canvas = canvasRef.current;
//     return canvas ? canvas.toDataURL("image/png") : "";
//   };

//   const mintImage = async () => {
//     const imageData = getCanvasImage();
//     const base64Data = imageData.split(",")[1]; // Get base64 content
//     if (!address) {
//       console.error("No address found");
//       return;
//     }
//     // read balance

//     let ipfsHash = '';
//     try {
//       const response = await axios.post(
//         "/api/imageStorage",
//         { 
//           image: base64Data, 
//           name: formData.name, 
//           description: formData.description},
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       ipfsHash = response.data.ipfsHash;
//       console.log("Image stored successfully:", response.data);
//       console.log("IPFS Hash:", ipfsHash);
//     } catch (error) {
//       console.error("Error storing image:", error);
//     }

//     const mintArgs = {
//       address: address,
//       ipfsHash: `ipfs://${ipfsHash}`,
//     };

//     console.log("Minting NFT with args:", mintArgs);
    
//     try {
//       const tx = await writeContract({ 
//         abi,
//         address: '0xf30e2246a53d1264ACe657A99Db2Ba737FFE7482',
//         functionName: 'safeMint',
//         args: [
//           mintArgs.address,
//           mintArgs.ipfsHash,
//         ],
//         // overrides: {
//         //   gasLimit: ethers.utils.hexlify(1000000), // Adjust this value as needed
//         // },
//       });
//       console.log("Transaction initiated:", tx);
//     } catch (error) {
//       console.error("Error executing writeContract:", error);
//     }
//   };

//   // Start drawing
//   const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
//     setDrawing(true);
//     const ctx = getContext();
//     if (ctx) {
//       ctx.strokeStyle = brushColor;
//       ctx.lineWidth = brushSize;
//       ctx.lineCap = 'round';
//       ctx.beginPath();
//       ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
//     }
//   };

//   // Draw on canvas
//   const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!drawing) return;

//     const ctx = getContext();
//     if (ctx) {
//       ctx.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
//       ctx.stroke();
//     }
//   };

//   // Stop drawing
//   const stopDrawing = () => {
//     setDrawing(false);
//     const ctx = getContext();
//     if (ctx) {
//       ctx.closePath();
//     }
//   };

//   // Clear canvas
//   const clearCanvas = () => {
//     const ctx = getContext();
//     if (ctx) {
//       ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
//     }
//   };

//   const handleFormChange = (e:any) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const toggleFormVisibility = () => {
//     setFormVisible(!isFormVisible); // Toggle form visibility
//   };



//   const { isLoading: isConfirming, isSuccess: isConfirmed } = 
//     useWaitForTransactionReceipt({ 
//       hash, 
//     }) 


//   return (
//     <main className='pt-4 flex flex-col items-center font-inter'>
//       <div className='absolute top-4 right-4'>
//         <w3m-button />
//       </div>
//       <h1 className='text-5xl text-blue-700 font-semibold mb-6 font-fredoka'>Paint ! 🎨</h1>
//       {/* <div>{address}</div>
//       <div>{isConnecting && 'Connecting...'}</div>
//       <div>{isDisconnected && 'Disconnected'}</div> */}
//       <div className='flex flex-col items-center' style={{maxWidth: "350px"}}>
        
//         <canvas
//           ref={canvasRef}
//           width={350}
//           height={350}
//           onMouseDown={startDrawing}
//           onMouseMove={draw}
//           onMouseUp={stopDrawing}
//           style={{ border: '1px solid #dddddd'}}
//         />

//         <div className='mb-4 mt-4 flex flex-col gap-4'>
//           <div className='flex flex-row items-center gap-3'>
//             <div className='flex flex-row items-center'>
//               <label htmlFor="brushColor">Brush Color:</label>
//               <input
//                 type="color"
//                 id="brushColor"
//                 value={brushColor}
//                 onChange={(e) => setBrushColor(e.target.value)}
//                 style={{ width: '25px', height: '30px', background: 'none', border: 'none'}}
//               />
//             </div>
//             <div className='flex flex-row items-center gap-1'>
//               <label htmlFor="brushSize">Brush Size:</label>
//               <input
//                 type="range"
//                 id="brushSize"
//                 min="1"
//                 max="100"
//                 value={brushSize}
//                 onChange={(e) => setBrushSize(parseInt(e.target.value))}
//               />
//             </div>
//           </div>
//           <div className='flex flex-row items-center justify-between'>
//             <button className='bg-slate-200 p-1 w-40' onClick={clearCanvas}>
//               Clear Canvas
//             </button>

//             <button className='bg-slate-200 p-1 w-40' onClick={toggleFormVisibility}>
//               Mint
//             </button>
//           </div>
//         </div>
//         {isFormVisible && (
//           <div className="form">
//             <h3 className="text-2xl text-blue-700 font-semibold mb-6">Mint Form</h3>
//             <div className="mb-4">
//               <label htmlFor="name">Name:</label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleFormChange}
//                 className="border p-2"
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="description">Description:</label>
//               <input
//                 type="text"
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleFormChange}
//                 className="border p-2"
//               />
//             </div>
//             <button 
//               className='bg-slate-200 p-1 w-40'
//               disabled={isPending} 
//               onClick={mintImage}
//             >
//               {isPending ? 'Confirming...' : 'Mint'} 
//             </button>
//             {hash && <div>Transaction Hash: {hash}</div>}
//             {isConfirming && <div>Waiting for confirmation...</div>} 
//             {isConfirmed && <div>Transaction confirmed.</div>} 
//             {error && ( 
//               <div>Error: {(error as BaseError).shortMessage || error.message}</div> 
//             )} 
//           </div>
//         )}
//       </div>
//       <div className='h-44'>
//       </div>
//     </main>
//   );
// }

"use client"
import { useState } from 'react';
import Canvas from './components/Canvas';
import MintForm from './components/MintForm';
import axios from 'axios';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { abi } from '../../lib/abi/abi';
import { type WriteContractReturnType } from '@wagmi/core'

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

  // Width and height of the canvas (it's a square canvas)
  const CANVAS_SIZE = 450;

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
        address: '0xf30e2246a53d1264ACe657A99Db2Ba737FFE7482',
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
      <div className='flex flex-col items-center p-10 pt-5 w-4/5 bg-white relative rounded-2xl'>
        <div className='absolute top-4 right-4'>
          <w3m-button />
        </div>
        
        <div className='flex flex-col gap-3'>
          <div>
            <div className='text-sm mb-6 italic'>
              @PaintOnBase 🎨
            </div>
            <h1 className='text-2xl font-semibold mb-2'>Create an NFT</h1>
            <p className='text-sm'>Once the item is minted, you will be able to see it on OpenSea</p>
          </div>
          <div className='flex flex-row gap-10'>
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
      <div className='h-32'>
      </div>
    </main>
  );
}
