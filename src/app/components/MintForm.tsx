import { use, useEffect, useState } from 'react';
import { type BaseError } from 'wagmi';
import { IFormData } from '../page';
import { IoInformationCircleOutline } from "react-icons/io5";

export interface IMintFormProps {
  formData: IFormData;
  handleFormChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  mintImage: () => void;
}

const Message = ({message, url}: any) => {
  return (
    <div className='p-3 bg-slate-100 rounded-lg flex flex-row gap-2 items-center mb-2'>
      <IoInformationCircleOutline />
      <div className=''>
        {url ? <a className="text-sky-900" href={url} target='_blank'>{message}</a> : message}
      </div>
    </div>
  );
}

export default function MintForm({
  address,
  formData,
  handleFormChange,
  mintImage,
  isMinting,
  isPending,
  hash,
  isConfirming,
  isConfirmed,
  error,
}: any) {

  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (isMinting || !address) {
      setIsDisabled(true);
    }
    else {
      setIsDisabled(false);
    }
  }, [isMinting, address]);

  const OPEN_SEA_URL = 'https://testnets.opensea.io/';
  const BASESCAN_URL = 'https://sepolia.basescan.org/tx/';

  return (
    <div className="form">
      <div className="mb-4 flex flex-col gap-2 text-sm">
        <label className='font-semibold' htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleFormChange}
          placeholder='Name your NFT'
          className="border p-2 rounded-lg lg:w-80 lg:max-w-80 w-full border-gray-200 focus:border-slate-200"
        />
      </div>

      <div className="mb-6 flex flex-col gap-2 text-sm">
        <label className='font-semibold' htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleFormChange}
          placeholder='Enter a description'
          className="border p-2 rounded-lg lg:w-80 lg:max-w-80 w-full h-32 border-gray-200 focus:border-slate-200"
        />
      </div>

      <div className='flex lg:justify-end justify-center mb-8'>
        <button 
          className='bg-gradient-to-r from-[#87FF5D] to-[#469BFF] p-2 w-32 text-sm font-semibold rounded-full text-white disabled:opacity-70'
          disabled={isDisabled}
          onClick={mintImage}
        >
          {isPending ? 'Minting...' : 'Mint'}
        </button>
      </div>
      {!address && <Message message='Connect your wallet to mint an NFT'/>}
      {hash && <Message message='View transaction on BaseScan' url={`${BASESCAN_URL}${hash}`}/>}
      {isConfirming && <Message message='Waiting for confirmation...'/>}
      {/* {isConfirmed && <Message message='Transaction confirmed'/>} */}
      {isConfirmed && <Message message='View your NFT on OpenSea' url={OPEN_SEA_URL + address}/>}
      {error && <Message message={`Error: ${(error as BaseError).shortMessage || error.message}`}/>}
      <div className='h-6'></div>
    </div>
  );
}


