# Decentralized Healthcare Records (DHR) System - Setup Guide

## Overview
A blockchain-based medical record management system using:
- **MetaMask**: For wallet connection and Ethereum transactions
- **Pinata**: For IPFS file pinning and storage
- **Sepolia Testnet**: For smart contract deployment
- **Next.js**: Modern web framework

## Prerequisites
1. MetaMask browser extension installed
2. Sepolia testnet ETH (get from [faucet.sepolia.dev](https://faucet.sepolia.dev))
3. Pinata account with API keys

## Environment Variables Setup

Add these to your Vercel project settings (Settings > Environment Variables):

```
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_alchemy_api_key
```

### Getting Pinata API Keys
1. Go to [pinata.cloud](https://pinata.cloud)
2. Sign up or login
3. Navigate to API Keys section
4. Create a new API key
5. Copy the JWT token and add to environment variables

### Getting Alchemy API Key
1. Go to [alchemy.com](https://alchemy.com)
2. Create free account
3. Create new app (select Sepolia network)
4. Copy your API key

## Smart Contract Deployment

### Step 1: Compile Contract
The Solidity contract is located at `/public/DecentralizedHealthcareRecords.sol`

### Step 2: Deploy Options

**Option A: Using Remix IDE (Easiest)**
1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create new file `DecentralizedHealthcareRecords.sol`
3. Copy contract code from `/public/DecentralizedHealthcareRecords.sol`
4. Select Solidity Compiler 0.8.20 or higher
5. Click "Compile"
6. Switch to "Deploy" tab
7. Select "Injected Provider - MetaMask" as environment
8. Make sure MetaMask is on Sepolia testnet
9. Click "Deploy"
10. Copy the contract address from deployment receipt

**Option B: Using Hardhat (Advanced)**
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
# Copy contract to contracts/ folder
npx hardhat run scripts/deploy.js --network sepolia
```

### Step 3: Update Contract Address
After deployment, add the contract address to your environment variables:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

## Application Features

### Patient Dashboard
- **Upload Medical Records**: Upload files to IPFS via Pinata
- **Grant Access**: Allow doctors to view specific records
- **Revoke Access**: Remove doctor access at any time
- **View Records**: See all uploaded records and who has access

### Doctor Dashboard
- **Access Patient Records**: View records shared with you
- **Download Records**: Download accessible medical files
- **View Details**: See record metadata and access dates

## How It Works

1. **Patient Action**:
   - Connects wallet via MetaMask
   - Uploads medical file (file stored on IPFS via Pinata)
   - Receives IPFS hash
   - Grants access by submitting transaction with doctor address and file hash

2. **Smart Contract**:
   - Records patient → doctor → hash relationship
   - Stores access permissions on blockchain
   - Emits events for transparency

3. **Doctor Action**:
   - Connects wallet
   - Views records patient granted access to
   - Downloads or views files from IPFS

## Testing Workflow

1. **Create Test Wallets** (or use existing):
   - Patient wallet (e.g., Wallet A)
   - Doctor wallet (e.g., Wallet B)

2. **As Patient**:
   - Connect Wallet A
   - Upload test PDF/image
   - Copy doctor's address
   - Grant access to doctor's address

3. **As Doctor**:
   - Switch to Wallet B in MetaMask
   - Connect wallet
   - Enter patient address
   - View granted records

## Getting Test ETH

Visit [faucet.sepolia.dev](https://faucet.sepolia.dev):
1. Enter your wallet address
2. Request test ETH
3. Wait for confirmation (usually < 1 minute)

## Troubleshooting

### "MetaMask not installed"
- Install MetaMask extension from [metamask.io](https://metamask.io)

### "Wrong network"
- Open MetaMask
- Select Sepolia testnet from network dropdown
- If Sepolia not available, add it manually with:
  - RPC URL: https://eth-sepolia.g.alchemy.com/v2/your_api_key
  - Chain ID: 11155111

### "Pinata upload failed"
- Verify JWT token in environment variables
- Check JWT hasn't expired
- Test with smaller file first

### "Contract call failed"
- Verify contract address is correct
- Ensure you have Sepolia testnet ETH
- Check MetaMask is connected to Sepolia

## Security Considerations

⚠️ **This is a demo application. For production:**
- Implement proper encryption before uploading files
- Add role-based access control (RBAC)
- Implement audit logging
- Add rate limiting
- Implement KYC verification
- Use hardware wallets for production accounts
- Implement proper error handling and monitoring

## Architecture

```
┌─────────────┐
│   Next.js   │
│ Web UI      │
└──────┬──────┘
       │
       ├─► MetaMask (Wallet Connection)
       │
       ├─► Pinata API (IPFS File Storage)
       │
       └─► Smart Contract (Access Control)
           └─► Sepolia Testnet
```

## File Structure

```
/components/
  ├── home-page.tsx
  ├── patient-dashboard.tsx
  ├── doctor-dashboard.tsx
  ├── file-upload.tsx
  └── wallet-button.tsx
  
/lib/
  ├── web3.ts
  ├── pinata.ts
  └── wallet-context.tsx
```

## Next Steps

1. Deploy smart contract to Sepolia
2. Add contract address to environment variables
3. Deploy Next.js app to Vercel
4. Test with multiple wallets
5. Add additional features (encryption, audit logging, etc.)

## Resources

- [MetaMask Docs](https://docs.metamask.io/)
- [Pinata Docs](https://docs.pinata.cloud/)
- [Ethers.js Docs](https://docs.ethers.org/)
- [Sepolia Faucet](https://faucet.sepolia.dev/)
- [Remix IDE](https://remix.ethereum.org)
