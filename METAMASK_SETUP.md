# MetaMask Setup Guide for MediChain

## Prerequisites

Before connecting to MediChain, you'll need:

1. **MetaMask Browser Extension**
   - Download from: https://metamask.io
   - Available for Chrome, Firefox, Edge, Brave

2. **Sepolia Testnet ETH**
   - Get free testnet ETH from: https://sepoliafaucet.com
   - You'll need some ETH for transaction gas fees

## Step-by-Step Connection Guide

### 1. Install MetaMask
- Visit https://metamask.io
- Click "Install MetaMask for [Your Browser]"
- Add the extension to your browser
- Create a new wallet or import existing one

### 2. Add Sepolia Network (Auto-added by MediChain)
- MetaMask will automatically add the Sepolia network when you first connect
- If not, manually add it:
  - Open MetaMask
  - Click Networks dropdown
  - Click "Add Network"
  - Fill in details:
    - Network Name: Sepolia Testnet
    - RPC URL: https://rpc.sepolia.org (or your Alchemy URL)
    - Chain ID: 11155111
    - Currency: ETH
    - Block Explorer: https://sepolia.etherscan.io

### 3. Get Sepolia ETH
- Go to: https://sepoliafaucet.com
- Enter your MetaMask address
- Wait for the transaction to complete (usually 1-2 minutes)
- Check your MetaMask wallet balance

### 4. Connect to MediChain
- Open the MediChain application
- Click "Get Started" on the welcome page
- Click "Connect MetaMask"
- MetaMask will pop up asking for permission
- Review and approve the connection
- Select your role (Patient or Doctor)
- Done! You're connected

## Troubleshooting

### "MetaMask not installed"
- Install MetaMask from https://metamask.io
- Refresh the page after installation

### "Failed to connect wallet"
- Make sure you're on Sepolia testnet (check MetaMask network dropdown)
- Try disconnecting and reconnecting
- Clear browser cache and cookies
- Try in an incognito/private window

### "Wrong chain"
- MediChain automatically switches you to Sepolia
- If it fails, manually select Sepolia from MetaMask dropdown
- Make sure RPC URL is correct

### No transaction fee
- Get Sepolia ETH from https://sepoliafaucet.com
- Try alternative faucets:
  - https://www.alchemy.com/faucets/ethereum-sepolia
  - https://cloud.google.com/application/web3/faucet/ethereum/sepolia

## What MediChain Can Access

When you connect MetaMask to MediChain, the app can:
- ✓ View your wallet address
- ✓ Send transactions (only when you approve)
- ✓ Sign messages
- ✗ Never has access to your private key
- ✗ Cannot move funds without your approval

## Your Wallet Address

Your wallet address is a unique identifier that:
- Doctors can use to request access to your records
- Patients need to share with doctors for access
- Is public and safe to share
- Format: 0x... (42 characters)

## Security Tips

1. **Never share your private key** with anyone
2. **Keep your seed phrase safe** - backup to secure location
3. **Only approve transactions you understand**
4. **Disconnect wallet** when not using the app
5. **Use a strong password** for MetaMask

## Next Steps

1. **For Patients:**
   - Upload your first medical record
   - Get your wallet address to share with doctors
   - Grant access to doctors you trust

2. **For Doctors:**
   - Wait for patients to share records with your wallet address
   - View shared records when available
   - Download documents from IPFS

## Need Help?

- Check the full setup guide: `/SETUP_GUIDE.md`
- Review features guide: `/FEATURES_GUIDE.md`
- Test the system: `/TESTING_GUIDE.md`

---

**Network:** Ethereum Sepolia Testnet  
**IPFS Storage:** Pinata  
**Wallet:** MetaMask  
**Chain ID:** 11155111
