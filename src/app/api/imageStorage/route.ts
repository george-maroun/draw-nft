import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";
import { Readable } from "stream";
import { Buffer } from "buffer";

const JWT = process.env.PINATA_JWT;

// Create a readable stream from a base64-encoded data URL
const createStreamFromBase64 = (base64Data: string) => {
  const buffer = Buffer.from(base64Data, "base64");
  return Readable.from(buffer);
};

// Create metadata for the image
const getMetadata = (name: string, description: string, imageHash: string) => {
  return {
    name,
    description,
    extrenal_url: "https://pinata.cloud",
    image: `ipfs://${imageHash}`,
  };
};

// Pin the file to IPFS using a readable stream
const pinStreamToIPFS = async (stream: Readable, fileName: string) => {
  const formData = new FormData();
  formData.append("file", stream, { filename: fileName });

  const pinataMetadata = JSON.stringify({
    name: fileName,
  });
  formData.append("pinataMetadata", pinataMetadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  formData.append("pinataOptions", pinataOptions);

  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data;`,
          "Authorization": `Bearer ${JWT}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error pinning stream to IPFS:", error);
    throw error;
  }
};

// POST handler to upload a base64-encoded image to IPFS
export async function POST(request: NextRequest) {
  try {
    const { image, name, description } = await request.json(); // Extract base64 data from the request body

    if (!image) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    } else if (!name) {
      return NextResponse.json({ error: "No name provided" }, { status: 400 });
    } else if (!description) {
      return NextResponse.json({ error: "No description provided" }, { status: 400 });
    }


    // const base64Data = image.split(",")[1]; // Remove the "data:image/png;base64," prefix if present
    const stream = createStreamFromBase64(image);
    
    const fileName = `image-${Math.random().toString(36).substring(2, 16)}.png`; // Create a unique file name

    // Pin the stream to IPFS and return the IPFS URL
    const ipfsImageResponse = await pinStreamToIPFS(stream, fileName);

    const imageHash = ipfsImageResponse.IpfsHash;

    const metadata = getMetadata(name, description, imageHash);

    const metadataStream = Readable.from(JSON.stringify(metadata));

    const ipfsMetadataResponse = await pinStreamToIPFS(metadataStream, "metadata.json");

    return NextResponse.json({
      success: true,
      ipfsHash: ipfsMetadataResponse.IpfsHash,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${ipfsMetadataResponse.IpfsHash}`,
    });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}


