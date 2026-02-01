# Quick Start Guide

## 1️⃣ Install Dependencies

The application uses the following key packages that are auto-installed:
- `ethers`: For Web3 integration
- `axios`: For Pinata API calls
- `lucide-react`: For UI icons

## 2️⃣ Deploy Smart Contract

### Using Remix (Recommended for beginners):

1. Open [remix.ethereum.org](https://remix.ethereum.org)
2. Create file → paste `/public/DecentralizedHealthcareRecords.sol`
3. Compile (left sidebar → Solidity Compiler → Compile)
4. Deploy:
   - Select "Injected Provider - MetaMask" environment
   - Make sure MetaMask is on **Sepolia testnet**
   - Get Sepolia ETH: [faucet.sepolia.dev](https://faucet.sepolia.dev)
   - Click "Deploy"
5. Copy the deployed contract address

## 3️⃣ Set Environment Variables

Go to your Vercel project settings and add:

```
NEXT_PUBLIC_PINATA_JWT=<your_pinata_jwt>
NEXT_PUBLIC_ALCHEMY_API_KEY=<your_alchemy_key>
NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed_contract_address>
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<your_alchemy_key>
```

### Where to get these:

**Pinata JWT:**
- Go to [pinata.cloud](https://pinata.cloud)
- API Keys section
- Generate new key → Copy JWT

**Alchemy Key:**
- Go to [alchemy.com](https://alchemy.com)
- Create app (select Sepolia)
- Copy API key

## 4️⃣ Test Locally

```bash
npm run dev
# Visit http://localhost:3000
```

## 5️⃣ Deploy to Vercel

```bash
vercel deploy
```

## 🧪 Test Workflow

### Scenario: Patient shares record with Doctor

**Wallet A (Patient):**
1. Connect wallet
2. Go to Patient Dashboard
3. Upload test file
4. Copy Wallet B address
5. Grant access to Wallet B

**Wallet B (Doctor):**
1. Switch MetaMask to Wallet B
2. Refresh and connect wallet
3. Go to Doctor Dashboard
4. Enter Wallet A address
5. Fetch records → should see shared file

## ⚠️ Important Notes

- **Sepolia Testnet Only**: This is a testnet implementation
- **Test ETH**: Get free ETH from faucet (limited amounts)
- **File Uploads**: Currently demos with mock integration
- **Gas Fees**: Minimal on testnet (free)

## 🆘 Common Issues

**"MetaMask not detected"**
- Install MetaMask: [metamask.io](https://metamask.io)

**"Wrong network"**
- MetaMask → Select "Sepolia" from network dropdown
- If missing, add manually in MetaMask settings

**"Insufficient balance"**
- Get testnet ETH: [faucet.sepolia.dev](https://faucet.sepolia.dev)

**"Contract not found"**
- Verify contract address in env variables
- Check on Sepolia Etherscan: https://sepolia.etherscan.io

## 📊 Features Implemented

✅ MetaMask wallet connection
✅ Sepolia testnet support
✅ Pinata IPFS file upload
✅ Smart contract access control
✅ Patient dashboard (upload, grant access)
✅ Doctor dashboard (view records)
✅ Access revocation
✅ Responsive UI
✅ Error handling

## 🚀 Next Features

- Add encryption before upload
- Implement audit logging
- Add patient-doctor matching
- Email notifications
- Mobile app
- Advanced filtering/search

## 📱 Support

For issues:
1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup
2. Review contract at `/public/DecentralizedHealthcareRecords.sol`
3. Check browser console for errors
4. Verify MetaMask connection and network
