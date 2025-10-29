# 🚀 Quick Start - Web3 Integration

Get SnapNEarn blockchain app running in **5 minutes**!

## ⚡ Super Quick Setup

### 1️⃣ Run Automated Setup

**Windows:**
```bash
setup-blockchain.bat
```

**Linux/Mac:**
```bash
chmod +x setup-blockchain.sh
./setup-blockchain.sh
```

### 2️⃣ Configure Environment

Edit `contracts/.env`:
```env
PRIVATE_KEY=your_metamask_private_key
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-KEY
```

**Get credentials:**
- 🦊 **Private Key**: MetaMask → Account Details → Export Private Key
- 🔗 **RPC URL**: Sign up at [Alchemy.com](https://www.alchemy.com/) → Create App → Sepolia
- 💰 **Testnet ETH**: [Sepolia Faucet](https://sepoliafaucet.com/)

### 3️⃣ Deploy Contract

```bash
cd contracts
npm run deploy
```

**Save the contract address!** Example output:
```
✅ SnapNEarn contract deployed to: 0xABCD1234...
```

### 4️⃣ Update Frontend

Edit `web3-frontend/src/config/contract.js`:
```javascript
export const CONTRACT_ADDRESS = "0xYourContractAddressHere"; // Paste here
```

### 5️⃣ Start App

```bash
cd web3-frontend
npm start
```

Open http://localhost:3000 🎉

---

## 📝 Usage

### Upload Violation

1. **Connect MetaMask** (must be on Sepolia network)
2. **Select image** of traffic violation
3. **Choose violation type** (No Helmet, Red Light, etc.)
4. **Click Upload** → Wait ~30 seconds
5. **Get IPFS CID** + Blockchain transaction hash

### View Records

1. Click **"View Records"** tab
2. See all violations stored on blockchain
3. Click any image to view full details
4. All data is **permanent** and **decentralized**

---

## 🛠️ Manual Setup (Alternative)

If automated script doesn't work:

```bash
# Install contracts
cd contracts
npm install
cp .env.example .env
# Edit .env with your credentials
npx hardhat compile
npm run deploy

# Install frontend
cd ../web3-frontend
npm install
# Update src/config/contract.js with contract address
npm start
```

---

## 🔧 Useful Commands

### Contracts
```bash
npx hardhat compile    # Compile contracts
npx hardhat test       # Run tests
npm run deploy         # Deploy to Sepolia
```

### Frontend
```bash
npm start             # Start dev server
npm run build         # Build for production
```

---

## 🐛 Common Issues

### ❌ "Insufficient funds"
→ Get Sepolia ETH: https://sepoliafaucet.com/

### ❌ "Wrong network"
→ MetaMask: Switch to Sepolia Test Network

### ❌ "Contract not found"
→ Check contract address in `config/contract.js`

### ❌ "IPFS upload slow"
→ Normal with public gateway (may take 10-20 seconds)
→ Optional: Add Infura IPFS credentials for faster uploads

---

## 🎯 What's Deployed?

### Smart Contract Features
- ✅ Store violation records on Ethereum
- ✅ IPFS integration for image storage
- ✅ Permanent, tamper-proof records
- ✅ Verification system for authorities
- ✅ Public audit trail

### Frontend Features
- ✅ MetaMask wallet connection
- ✅ Image upload to IPFS
- ✅ Blockchain transaction submission
- ✅ View all violations from blockchain
- ✅ Full image viewer with metadata
- ✅ Real-time transaction tracking

---

## 📚 Tech Stack

- **Blockchain**: Ethereum (Sepolia Testnet)
- **Smart Contract**: Solidity 0.8.20
- **Development**: Hardhat
- **Storage**: IPFS (Decentralized)
- **Frontend**: React + Ethers.js
- **Wallet**: MetaMask

---

## 🔐 Security Notes

⚠️ **NEVER share your private key**
⚠️ **Always use testnet for development**
⚠️ **Keep .env files secret**

---

## 📖 Full Documentation

For detailed information, see:
- **[BLOCKCHAIN_SETUP.md](BLOCKCHAIN_SETUP.md)** - Complete setup guide
- **[contracts/README.md](contracts/README.md)** - Smart contract docs

---

## 🤝 Need Help?

1. Check **[BLOCKCHAIN_SETUP.md](BLOCKCHAIN_SETUP.md)** troubleshooting section
2. Verify all prerequisites are installed
3. Ensure Sepolia network is added to MetaMask
4. Confirm you have testnet ETH

---

**Ready to build the future of traffic enforcement? Let's go! 🚀**
