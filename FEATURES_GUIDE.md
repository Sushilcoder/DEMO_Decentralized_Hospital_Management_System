# MediChain - Interactive Features Guide

## Dashboard Features Explained

### Onboarding Wizard (First Time Users)
The onboarding wizard guides you through:
1. **Welcome Screen** - Overview of MediChain benefits
2. **Wallet Connection** - Connect MetaMask securely
3. **Role Selection** - Choose Patient or Doctor
4. **Ready to Go** - Start using MediChain

**Pro Tip**: The wizard appears each time you disconnect your wallet. You can skip it by connecting your wallet directly.

---

## Patient Dashboard Features

### Record Upload Modal
- **Drag & Drop**: Drag files directly into the upload area
- **Click Upload**: Browse files from your computer
- **Record Name**: Enter a descriptive name for your record
- **Record Type**: Select from predefined categories or add custom type
- **Auto-Encryption**: Files are automatically encrypted before upload

### Quick Stats
- **Total Records**: Count of all uploaded medical records
- **Doctors With Access**: Number of doctors who can view your data
- **Access Granted**: Total number of times your records were accessed

### Record Management
Each record shows:
- **File Icon**: Visual indicator of record type
- **Name & Type**: Quick identification
- **Date**: When the record was uploaded
- **IPFS Hash**: Blockchain reference (immutable proof)
- **Access Count**: How many times the record was viewed
- **Share Button**: Grant access to a doctor
- **Delete Button**: Remove record permanently

### Access Control Popup
When sharing a record:
1. Click "Share" on any record
2. Enter doctor's wallet address
3. Choose expiration date (optional)
4. Click "Grant Access"
5. Wait for blockchain confirmation (10-30 seconds)

---

## Doctor Dashboard Features

### Patient Records View
Shows all records shared with you by patients.

**Record Information**:
- **Patient Name & Address**: Identified by blockchain wallet
- **Record Details**: Type, date uploaded, IPFS reference
- **Quick Actions**: View and download buttons

### View Record Modal
Click "View" to see:
- Patient information
- Record preview area
- Metadata (type, date, hash)
- Download option

### Download Function
Click "Download" to:
- Save record to your device
- Automatic file naming with date
- Encrypted copy on local storage

---

## Navigation Tips

### Role Switching
- Use the role toggle in top navigation bar
- Switch between Patient and Doctor views instantly
- Your data remains secure in both modes

### Wallet Management
- Display button shows connected wallet address
- Click to copy address to clipboard
- Disconnect button to logout
- Reconnect maintains all data

### Navigation Menu
- **Patient Dashboard**: Manage your medical records
- **Doctor Dashboard**: Access shared records
- **Smart Contract Interface**: Advanced interactions
- **Wallet**: Connection status and address

---

## Smart Features

### Auto-Save
- Unsaved changes auto-save every 30 seconds
- No need to manually save work
- Automatic encryption in background

### Real-time Updates
- New shared records appear instantly
- Access revocations immediate
- Status updates without page refresh

### Dark Mode (If Enabled)
- Toggle in user settings
- Reduces eye strain in low light
- Saves color scheme preference

---

## Interactive Modals

### Upload Modal
- **Visual Feedback**: Hover effects on upload zone
- **Progress Bar**: Shows upload progress
- **Error Messages**: Clear error descriptions
- **Success Notification**: Confirms successful upload

### View Record Modal
- **Responsive Design**: Works on all screen sizes
- **Keyboard Navigation**: Use Tab to navigate
- **Close Button**: Click X or press Escape
- **Scroll Support**: Scroll modal content independently

### Share Access Modal
- **Address Validation**: Verifies wallet format
- **Gas Estimation**: Shows transaction cost
- **Confirmation Step**: Review before submitting
- **Transaction Hash**: View blockchain transaction

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Esc | Close modal/dialog |
| Tab | Navigate form fields |
| Enter | Submit form/confirm action |
| Ctrl+C | Copy wallet address |
| Ctrl+V | Paste wallet address |

---

## Accessibility Features

### For Screen Readers
- Alt text on all images
- Form labels properly associated
- ARIA labels on interactive elements
- Semantic HTML structure

### Keyboard Navigation
- All buttons accessible via Tab key
- Enter/Space to activate buttons
- Arrow keys in select dropdowns
- Focus indicators visible

### Color Contrast
- Text meets WCAG AA standards
- Color not sole indicator of status
- Sufficient contrast ratios
- Dark mode option available

---

## Performance Tips

### Optimize Upload Speed
1. Compress large PDF files before upload
2. Use standard image formats (JPG, PNG)
3. Clear browser cache periodically
4. Use wired internet for large files

### Reduce Load Time
1. Limit open browser tabs
2. Disable browser extensions during use
3. Keep browser updated
4. Clear cookies/cache monthly

### Better Battery Life (Mobile)
1. Reduce screen brightness
2. Use WiFi instead of cellular
3. Close other apps
4. Enable dark mode

---

## Common Tasks Simplified

### Share Record with New Doctor
1. Click "Share" on record
2. Enter doctor's wallet address
3. Confirm access grant
4. Done - doctor can now view

### Revoke Doctor Access
1. Find record to revoke
2. Click options menu
3. Select "Revoke Access"
4. Confirm action
5. Access removed immediately

### Download Multiple Records
1. Click "Download" on first record
2. Files save with timestamps
3. Repeat for other records
4. All files organized in Downloads folder

### Switch Roles
1. Use role toggle button
2. Select Patient or Doctor
3. Redirect to appropriate dashboard
4. All previous data accessible

---

## Help & Support

### Getting Help
1. Hover over any question mark icon (?)
2. Tooltips appear with explanations
3. Links to relevant documentation
4. Contact support email

### Report Issues
1. Open Settings
2. Click "Report Bug"
3. Describe the issue
4. Submit with screenshot

### Feedback
1. Settings > Send Feedback
2. Rate your experience
3. Suggest improvements
4. Help us improve MediChain

---

## Mobile App Tips

### Responsive Design
- All features work on mobile
- Touch-friendly buttons (48px minimum)
- Optimized layouts for smaller screens
- Swipe gestures for navigation

### Mobile Considerations
- Larger tap targets than desktop
- Fewer columns in tables
- Simplified modals
- Adjusted font sizes

### MetaMask Mobile
- Use MetaMask app on mobile
- Desktop-like experience in browser
- All features fully supported
- Secure authentication

---

## Advanced Features

### Smart Contract Explorer
- View raw contract data
- Check access logs
- Verify transactions
- Query patient data

### Advanced Sharing Options
- Set expiration dates
- Limit access to specific records
- Create access groups
- View access history

### Data Export
- Export all records as archive
- Backup to local storage
- Generate certificate of records
- Verify blockchain proof

---

*For more detailed information, check the USER_GUIDE.md file or contact support.*
