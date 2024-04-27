import { type BaseError } from 'wagmi';
import { IFormData } from '../page';
import { IoInformationCircleOutline } from "react-icons/io5";

export interface IMintFormProps {
  formData: IFormData;
  handleFormChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  mintImage: () => void;
}

const Message = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='p-3 bg-slate-200 rounded-lg flex flex-row gap-2 items-center mb-2'>
      <IoInformationCircleOutline />
      <div className='max-w-72 text-wrap'>{children}</div>
    </div>
  );
}

export default function MintForm({
  address,
  formData,
  handleFormChange,
  mintImage,
  isPending,
  hash,
  isConfirming,
  isConfirmed,
  error,
}: any) {

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
          placeholder='Name your NFT...'
          className="border p-2 rounded-lg w-72 max-w-72 border-gray-200 focus:border-slate-200"
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
          className="border p-2 rounded-lg w-72 max-w-72 h-32 border-gray-200 focus:border-slate-200"
        />
      </div>

      <div className='flex justify-end mb-8'>
        <button 
          className='bg-gradient-to-r from-[#87FF5D] to-[#469BFF] p-2 w-32 text-sm font-semibold rounded-full text-white'
          disabled={isPending || !address}
          onClick={mintImage}
        >
          {isPending ? 'Confirming...' : 'Mint'}
        </button>
      </div>
      
      {hash && <Message>Transaction hash: {hash}</Message>}
      {isConfirming && <Message>Waiting for confirmation...</Message>}
      {isConfirmed && <Message>Transaction confirmed.</Message>}
      {error && <Message>Error: {(error as BaseError).shortMessage || error.message}</Message>}
 
      
    </div>
  );
}


