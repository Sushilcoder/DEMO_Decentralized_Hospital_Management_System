# How to Test Patient Upload & Doctor Access

This guide shows you exactly how to test the working end-to-end flow.

## Quick Test Flow

### 1. Patient Uploads Document
- Connect Wallet as Account 1 (Patient)
- Go to Patient Dashboard
- Click "Upload Record"
- Select a file and enter details
- File uploads to Pinata IPFS
- Record appears in your list with IPFS hash

### 2. Patient Grants Doctor Access
- Click "Manage Access" on your record
- Enter Account 2's wallet address (0x...)
- Click "Grant Access"
- Doctor address now shows in "SHARED WITH" section

### 3. Doctor Views Record
- Disconnect and connect as Account 2 (Doctor)
- Go to Doctor Dashboard
- Your shared record appears in list
- Click "View" to see full details
- Click "Download File" to access IPFS

### 4. Patient Revokes Access
- Switch back to Account 1
- Click "Revoke" next to doctor's address
- Access is removed

### 5. Doctor Loses Access
- Switch to Account 2
- Click "Refresh" in Doctor Dashboard
- Record disappears

## Environment Setup

Set in Vercel:
- `NEXT_PUBLIC_PINATA_JWT` - Your Pinata API key

## Testing with MetaMask

1. Install MetaMask extension
2. Create 2 test accounts
3. Copy account addresses (0x...)
4. Use Account 1 for Patient role
5. Use Account 2 for Doctor role

## Data Storage

- All records saved to localStorage
- Format: `patient_records_<wallet_address>`
- Doctors see records by checking all patients' localStorage
- Access control via `sharedWith` array on each record
