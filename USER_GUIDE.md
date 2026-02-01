# MediChain - User Guide

## Getting Started

Welcome to MediChain! Your secure, decentralized healthcare records platform. This guide will help you navigate the application.

## First-Time Setup

### 1. Install MetaMask
- Download MetaMask extension for your browser
- Create a new wallet or import an existing one
- Save your seed phrase securely

### 2. Connect to MediChain
- Visit the MediChain website
- Click "Get Started" on the onboarding page
- Follow the wallet connection prompts
- Select your role (Patient or Doctor)

### 3. Choose Your Role
- **Patient**: Manage and share your medical records
- **Doctor**: Access patient records shared with you

## Patient Dashboard

### Uploading Medical Records

1. Click "Upload Record" button
2. Select a file from your device or drag and drop
3. Enter record details:
   - Record Name (e.g., "Blood Test Report")
   - Record Type (Lab Results, Imaging, Prescription, etc.)
4. Click "Upload"
5. The record will be stored on IPFS and encrypted for security

### Managing Access Permissions

1. Go to "My Medical Records"
2. Find the record you want to share
3. Click "Share"
4. Enter doctor's wallet address
5. Click "Grant Access"

To revoke access:
1. Find the record in your list
2. Click the options menu
3. Select "Revoke Access"
4. Confirm the action

### Viewing Your Records

All your uploaded medical records appear in the records list with:
- Record name and type
- Upload date
- IPFS hash (blockchain reference)
- Number of doctors with access
- Download and share options

## Doctor Dashboard

### Accessing Patient Records

1. Only records that patients have explicitly shared with you will appear
2. View patient name and wallet address
3. See record details (type, date, IPFS hash)

### Viewing Records

1. Click "View" button on any record
2. A preview modal will open showing:
   - Patient information
   - Record metadata
   - IPFS hash for blockchain verification

### Downloading Records

1. Find the record you need
2. Click "Download" button
3. The file will download to your device

## Security Features

### Data Privacy
- All medical records are encrypted before upload
- Records stored on IPFS are immutable and tamper-proof
- Only patients control who can access their data

### Wallet Security
- Never share your private keys
- Always verify you're on the official MediChain website
- Use a secure, private browser for transactions

### Access Control
- Grant access to specific doctors only
- Revoke access at any time
- View access logs on your dashboard

## Smart Contract Interaction

### For Advanced Users

Access the Smart Contract Interface to:
- Query access permissions directly
- View blockchain transaction history
- Verify data integrity
- Direct contract method calls

### Contract Methods
- `grantAccess(patientAddress, doctorAddress)` - Grant doctor access
- `revokeAccess(patientAddress, doctorAddress)` - Revoke doctor access
- `hasAccess(patientAddress, doctorAddress)` - Check access status
- `getAccessedPatients(doctorAddress)` - List accessible patient records

## Troubleshooting

### MetaMask Issues
- Ensure MetaMask is installed and updated
- Check if you're on the correct network (Sepolia testnet)
- Clear browser cache if connection fails

### File Upload Issues
- Check file size (maximum 10MB)
- Supported formats: PDF, Images, Documents
- Ensure stable internet connection
- Wait for Pinata confirmation

### Access Permission Issues
- Verify the doctor's wallet address
- Wait a few seconds for blockchain confirmation
- Check you have sufficient gas for transactions

### Records Not Showing
- Refresh the page
- Clear browser cache
- Ensure your wallet is connected
- Check network connection

## Network Information

### Sepolia Testnet Details
- Network: Ethereum Sepolia Testnet
- Chain ID: 11155111
- RPC URL: Available in environment variables
- Testnet Faucet: Get free test ETH from Sepolia faucet

### Getting Test ETH
1. Visit Sepolia faucet website
2. Enter your MetaMask wallet address
3. Request test funds
4. Receive 0.5 ETH for testing

## Privacy & Terms

### Data Ownership
- You own all your medical data
- MediChain cannot access encrypted records
- Records are on decentralized IPFS network

### Data Retention
- Records persist on IPFS indefinitely
- Only you can delete records from your patient dashboard
- Blockchain transactions are permanent

## Support & Help

For issues or questions:
1. Check this user guide
2. Visit our documentation
3. Contact support team

## Best Practices

### For Patients
- Regularly backup important medical records
- Share records only with trusted healthcare providers
- Keep your wallet address secure
- Review access permissions monthly

### For Doctors
- Verify patient identities before accessing records
- Keep patient data confidential
- Use MediChain only for authorized medical purposes
- Maintain compliance with healthcare regulations

## Technical Details

### IPFS Integration
- Files stored on Pinata IPFS network
- Each file gets unique IPFS hash
- Hash stored on blockchain for verification
- Ensures data integrity and availability

### Blockchain Storage
- Access permissions stored in smart contract
- All transactions recorded on Sepolia testnet
- Contract events for audit trails
- Immutable record of all access grants

### Encryption
- Files encrypted before IPFS upload
- Patient data protected end-to-end
- Only authorized recipients can decrypt
- MetaMask wallet required for access
