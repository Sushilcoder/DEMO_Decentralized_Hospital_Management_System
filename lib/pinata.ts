import axios, { AxiosError } from 'axios';

export interface PinataUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export class PinataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PinataError';
  }
}

export async function uploadFileToPinata(file: File, retries = 3): Promise<string> {
  if (!process.env.NEXT_PUBLIC_PINATA_JWT) {
    throw new PinataError('Pinata API key not configured');
  }

  // Calculate timeout based on file size (larger files need more time)
  // Base: 60 seconds, plus 20 seconds per 5MB
  const fileSize = file.size / (1024 * 1024); // Convert to MB
  const baseTimeout = 60000; // 60 seconds minimum
  const additionalTimeout = Math.ceil((fileSize / 5) * 20000);
  const timeout = baseTimeout + additionalTimeout;

  console.log('[v0] File size:', fileSize.toFixed(2), 'MB, timeout:', timeout, 'ms');

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      console.log('[v0] Uploading file to Pinata, attempt', attempt + 1, 'of', retries);
      
      const formData = new FormData();
      formData.append('file', file);

      // Add metadata
      const metadata = JSON.stringify({
        name: file.name,
        keyvalues: {
          uploadedAt: new Date().toISOString(),
          originalSize: file.size.toString(),
        },
      });
      formData.append('pinataMetadata', metadata);

      const response = await axios.post<PinataUploadResponse>(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            'Content-Type': 'multipart/form-data',
          },
          timeout: timeout,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      console.log('[v0] File uploaded successfully:', response.data.IpfsHash);
      return response.data.IpfsHash;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log('[v0] Upload attempt', attempt + 1, 'failed:', axiosError.message);
      
      if (attempt === retries - 1) {
        // Check if it's a timeout error specifically
        const isTimeout = axiosError.code === 'ECONNABORTED' || axiosError.message.includes('timeout');
        const errorSuggestion = isTimeout
          ? 'The file upload timed out. Try uploading a smaller file or splitting into multiple files.'
          : 'Please check your internet connection and ensure your Pinata API key is valid.';
        
        throw new PinataError(
          `Failed to upload file to Pinata after ${retries} attempts: ${axiosError.message}. ${errorSuggestion}`
        );
      }
      
      // Progressive backoff: wait longer on each retry
      const waitTime = 2000 * Math.pow(1.5, attempt); // 2s, 3s, 4.5s...
      console.log('[v0] Retrying in', waitTime, 'ms...');
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw new PinataError('Failed to upload file to Pinata: Unknown error');
}

export async function uploadJSONToPinata(data: Record<string, unknown>, fileName: string): Promise<string> {
  if (!process.env.NEXT_PUBLIC_PINATA_JWT) {
    throw new PinataError('Pinata API key not configured');
  }

  try {
    const response = await axios.post<PinataUploadResponse>(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      {
        pinataContent: data,
        pinataMetadata: {
          name: fileName,
          keyvalues: {
            uploadedAt: new Date().toISOString(),
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new PinataError(
      `Failed to upload JSON to Pinata: ${axiosError.message}`
    );
  }
}

export function getIpfsGatewayUrl(ipfsHash: string): string {
  return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
}

export function getIpfsPublicUrl(ipfsHash: string): string {
  return `https://ipfs.io/ipfs/${ipfsHash}`;
}

export async function downloadFileFromIPFS(ipfsHash: string, fileName: string): Promise<void> {
  try {
    // Use Pinata gateway for reliable downloads
    const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    
    console.log('[v0] Fetching file from IPFS:', ipfsHash);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch file from IPFS`);
    }

    const blob = await response.blob();
    console.log('[v0] File downloaded, size:', blob.size, 'bytes');

    // Create download link
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    console.log('[v0] Download complete:', fileName);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.log('[v0] Download error:', errorMsg);
    throw new PinataError(`Failed to download file from IPFS: ${errorMsg}`);
  }
}
