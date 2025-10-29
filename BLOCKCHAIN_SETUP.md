# 🚀 SnapNEarn - Complete Web3 + IPFS Integration Guide

This guide provides complete instructions for setting up and running the blockchain-integrated SnapNEarn application.

## 📁 Project Structure

```
snearn/
├── contracts/                          # Smart Contract & Hardhat Setup
│   ├── contracts/
│   │   └── SnapNEarn.sol              # Solidity smart contract
│   ├── scripts/
│   │   └── deploy.js                  # Deployment script
│   ├── test/
│   │   └── SnapNEarn.test.js          # Contract tests
│   ├── hardhat.config.js              # Hardhat configuration
│   ├── package.json                   # Contract dependencies
│   └── .env.example                   # Environment template
│
├── web3-frontend/                      # React Web3 Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadViolation.js     # Upload component
│   │   │   ├── UploadViolation.css    # Upload styles
│   │   │   ├── ViewViolations.js      # View component
│   │   │   └── ViewViolations.css     # View styles
│   │   ├── config/
│   │   │   └── contract.js            # Contract ABI & config
│   │   ├── utils/
│   │   │   ├── ipfs.js                # IPFS utilities
│   │   │   └── contract.js            # Contract interaction
│   │   ├── App.js                     # Main app component
│   │   ├── App.css                    # App styles
│   │   ├── index.js                   # React entry point
│   │   └── index.css                  # Global styles
│   └── package.json                   # Frontend dependencies
│
└── BLOCKCHAIN_SETUP.md                # This file
```

## 🛠️ Prerequisites

Before starting, ensure you have:

1. **Node.js** (v16+) - [Download](https://nodejs.org/)
2. **MetaMask** browser extension - [Install](https://metamask.io/)
3. **Sepolia ETH** (testnet) - Get from [faucet](https://sepoliafaucet.com/)
4. **Alchemy or Infura account** (for RPC URL) - [Alchemy](https://www.alchemy.com/) | [Infura](https://infura.io/)

## 📝 Step-by-Step Setup

### Step 1: Install Contract Dependencies

```bash
cd contracts
npm install
```

This installs:
- `hardhat` - Ethereum development environment
- `ethers` - Ethereum library
- `@nomicfoundation/hardhat-toolbox` - Hardhat plugins
- `@openzeppelin/contracts` - Secure smart contract library
- `dotenv` - Environment variables

### Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your credentials:

```env
# Get your MetaMask private key:
# MetaMask → Account Details → Export Private Key
PRIVATE_KEY=your_metamask_private_key_here

# Get Alchemy API key:
# Sign up at https://www.alchemy.com/
# Create app → Select "Ethereum" → "Sepolia"
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-ALCHEMY-API-KEY

# Optional: For contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

⚠️ **IMPORTANT**: Never commit your `.env` file! It contains sensitive information.

### Step 3: Compile Smart Contract

```bash
npx hardhat compile
```

Expected output:
```
Compiled 1 Solidity file successfully
```

### Step 4: Test Smart Contract (Optional but Recommended)

```bash
npx hardhat test
```

This runs comprehensive tests to ensure the contract works correctly.

### Step 5: Deploy to Sepolia Testnet

```bash
npm run deploy
```

Or:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Expected output:
```
🚀 Starting SnapNEarn contract deployment...

📝 Deploying contracts with account: 0x1234...5678
💰 Account balance: 0.5 ETH

⏳ Deploying SnapNEarn contract...
✅ SnapNEarn contract deployed to: 0xABCD...EFGH

📋 Deployment Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contract Address: 0xABCD...EFGH
Network: sepolia
Deployer: 0x1234...5678
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 Deployment info saved to: deployments/sepolia.json
```

**📋 SAVE THIS CONTRACT ADDRESS!** You'll need it for the frontend.

### Step 6: Setup Frontend

```bash
cd ../web3-frontend
npm install
```

This installs:
- `react` & `react-dom` - React framework
- `ethers` - Ethereum interactions
- `ipfs-http-client` - IPFS uploads
- `web3modal` - Wallet connections
- `@walletconnect/web3-provider` - WalletConnect support

### Step 7: Configure Frontend

1. Open `web3-frontend/src/config/contract.js`

2. Update the contract address:
```javascript
export const CONTRACT_ADDRESS = "0xYourDeployedContractAddress"; // Replace with actual address
```

3. (Optional) If you want to use Infura IPFS, create `.env` in web3-frontend:
```env
REACT_APP_IPFS_PROJECT_ID=your_infura_ipfs_project_id
REACT_APP_IPFS_PROJECT_SECRET=your_infura_ipfs_secret
```

Get these from [Infura IPFS](https://infura.io/product/ipfs)

### Step 8: Start Frontend

```bash
npm start
```

The app will open at `http://localhost:3000`

## 🎯 Using the Application

### Upload a Violation

1. **Connect MetaMask**
   - Click "🔌 Connect MetaMask"
   - Approve the connection
   - Ensure you're on Sepolia network

2. **Upload Image**
   - Click upload area or drag-drop image
   - Select violation type
   - Click "📤 Upload to Blockchain"

3. **Wait for Confirmations**
   - Step 1: Image uploads to IPFS (5-10 seconds)
   - Step 2: Transaction sent to blockchain
   - Step 3: Transaction confirmed (10-30 seconds)

4. **View Results**
   - IPFS CID displayed
   - Transaction hash shown
   - Links to IPFS and Etherscan

### View All Violations

1. Click "🔍 View Records" tab
2. Choose "Recent (10)" or "All Violations"
3. Click any image to view full details
4. All data is fetched from blockchain + IPFS

## 🔧 Development Commands

### Contracts

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Sepolia
npm run deploy

# Deploy to localhost (for testing)
npx hardhat node          # Terminal 1: Start local node
npm run deploy:local      # Terminal 2: Deploy to local node

# Verify contract on Etherscan
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
```

### Frontend

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 📊 Smart Contract Functions

### Write Functions (Requires Gas)

- `addViolation(imageHash, violationType)` - Add new violation
- `verifyViolation(id)` - Mark violation as verified

### Read Functions (Free)

- `getAllViolations()` - Get all violations
- `getRecentViolations(count)` - Get recent violations
- `getViolation(id)` - Get specific violation
- `getViolationsByReporter(address)` - Get violations by reporter
- `getTotalViolations()` - Get total count

## 🔐 Security Best Practices

1. **Never share your private key** - It controls your funds
2. **Use testnet first** - Don't deploy to mainnet without thorough testing
3. **Audit contracts** - Consider professional audit for production
4. **Keep .env secret** - Never commit to version control
5. **Use hardware wallet** - For mainnet deployments

## 🐛 Troubleshooting

### "Insufficient funds" Error
- Get Sepolia ETH from faucet: https://sepoliafaucet.com/

### "Network Mismatch" Error
- MetaMask → Networks → Add Sepolia
- Or click "Switch to Sepolia" in the app

### "IPFS Upload Failed"
- Using public gateway - may be slow/rate-limited
- Solution: Create Infura IPFS account and add credentials

### "Contract Not Found"
- Verify contract address in `config/contract.js`
- Check you're on correct network (Sepolia)

### "Transaction Failed"
- Increase gas limit in MetaMask
- Check account has enough ETH
- Verify contract is deployed correctly

## 🌐 Useful Links

- **Sepolia Faucet**: https://sepoliafaucet.com/
- **Sepolia Explorer**: https://sepolia.etherscan.io/
- **IPFS Gateway**: https://ipfs.io/
- **Alchemy**: https://www.alchemy.com/
- **Infura**: https://infura.io/
- **MetaMask**: https://metamask.io/
- **Hardhat Docs**: https://hardhat.org/docs

## 🎓 Architecture Overview

```
┌─────────────┐         ┌──────────────┐        ┌─────────────┐
│   React UI  │ ◄─────► │   MetaMask   │ ◄────► │   Ethereum  │
│  (Frontend) │         │   (Wallet)   │        │  (Sepolia)  │
└─────────────┘         └──────────────┘        └─────────────┘
       │                                                │
       │                                                │
       ▼                                                ▼
┌─────────────┐                              ┌─────────────────┐
│    IPFS     │                              │  Smart Contract │
│ (Storage)   │                              │  (SnapNEarn.sol)│
└─────────────┘                              └─────────────────┘

Flow:
1. User uploads image through React UI
2. Image stored on IPFS → returns CID
3. MetaMask signs transaction with CID + metadata
4. Smart contract stores record on Ethereum blockchain
5. ViewViolations component fetches data from blockchain
6. Images loaded from IPFS using stored CIDs
```

## 📜 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit your changes
4. Push to the branch
5. Create Pull Request

## 💬 Support

Need help? 
- Open an issue on GitHub
- Check troubleshooting section
- Review Hardhat/Ethers.js documentation

---

**Built with ❤️ using Ethereum, IPFS, React, and Hardhat**
