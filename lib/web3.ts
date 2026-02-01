import { ethers } from 'ethers';

// Contract ABI for basic healthcare records contract
export const DHR_CONTRACT_ABI = [
  'function grantAccess(address doctor, string memory ipfsHash) public',
  'function revokeAccess(address doctor, string memory ipfsHash) public',
  'function getAccessCount(string memory ipfsHash) public view returns (uint256)',
  'function hasAccess(address patient, address doctor, string memory ipfsHash) public view returns (bool)',
  'event AccessGranted(address indexed patient, address indexed doctor, string ipfsHash)',
  'event AccessRevoked(address indexed patient, address indexed doctor, string ipfsHash)',
];

export interface HealthRecord {
  id: string;
  ipfsHash: string;
  fileName: string;
  fileType: string;
  uploadedAt: number;
  description: string;
  accessedBy: string[];
}

export interface WalletConnection {
  address: string;
  isConnected: boolean;
  network: 'sepolia' | 'unknown';
}

export async function connectWallet(): Promise<WalletConnection> {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    });

    // Sepolia testnet chain ID is 0xaa36a7 (11155111 in decimal)
    if (chainId !== '0xaa36a7') {
      await switchToSepolia();
    }

    return {
      address: accounts[0],
      isConnected: true,
      network: 'sepolia',
    };
  } catch (error) {
    throw new Error(`Failed to connect wallet: ${error}`);
  }
}

export async function switchToSepolia(): Promise<void> {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      // Chain not added to MetaMask
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0xaa36a7',
            chainName: 'Sepolia Testnet',
            rpcUrls: [process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL],
            nativeCurrency: {
              name: 'Sepolia ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          },
        ],
      });
    } else {
      throw error;
    }
  }
}

export function getProvider(): ethers.BrowserProvider {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner(provider: ethers.BrowserProvider): Promise<ethers.JsonRpcSigner> {
  return provider.getSigner();
}

export function getContractInstance(
  signer: ethers.JsonRpcSigner,
  contractAddress: string
): ethers.Contract {
  return new ethers.Contract(contractAddress, DHR_CONTRACT_ABI, signer);
}

export async function grantAccess(
  contract: ethers.Contract,
  doctorAddress: string,
  ipfsHash: string
): Promise<ethers.TransactionResponse> {
  const tx = await contract.grantAccess(doctorAddress, ipfsHash);
  await tx.wait();
  return tx;
}

export async function revokeAccess(
  contract: ethers.Contract,
  doctorAddress: string,
  ipfsHash: string
): Promise<ethers.TransactionResponse> {
  const tx = await contract.revokeAccess(doctorAddress, ipfsHash);
  await tx.wait();
  return tx;
}
