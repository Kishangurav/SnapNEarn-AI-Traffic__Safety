# 🚀 Local Development Setup - NO MetaMask Private Key Required!

Since you don't have a Sepolia private key yet, I've set up a **fully functional local blockchain environment** for you to test and develop the application.

---

## ✅ What's Already Done

1. ✅ **Test wallet generated** for local development
2. ✅ **Local blockchain contract deployed** to `0x5FbDB2315678afecb367f032d93F642f64180aa3`
3. ✅ **Frontend configured** to use localhost network
4. ✅ **All dependencies installed**
5. ✅ **14 tests passed** successfully

---

## 🎯 Current Status: READY TO RUN!

### Local Blockchain is Running
- **Network**: Localhost (Hardhat)
- **Contract Address**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **RPC URL**: `http://127.0.0.1:8545`
- **Chain ID**: 31337

---

## 🚀 How to Run the Application Locally

### Option 1: Quick Start (Recommended)

The local blockchain is already running in the background!

**Just start the frontend:**

```bash
cd web3-frontend
npm start
```

The app will open at `http://localhost:3000`

---

### Option 2: Fresh Start

If you need to restart everything:

**Terminal 1 - Start Blockchain:**
```bash
cd contracts
npx hardhat node
```
Keep this terminal open - it shows blockchain activity.

**Terminal 2 - Start Frontend:**
```bash
cd web3-frontend
npm start
```

---

## 🔧 How to Connect MetaMask to Local Blockchain

1. **Open MetaMask Extension**

2. **Add Custom Network:**
   - Click network dropdown (top)
   - Click "Add Network" → "Add a network manually"
   - Fill in:
     ```
     Network Name: Localhost 8545
     New RPC URL: http://127.0.0.1:8545
     Chain ID: 31337
     Currency Symbol: ETH
     ```
   - Click "Save"

3. **Import Test Account:**
   - Click account icon → "Import Account"
   - Paste this private key:
     ```
     0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
     ```
   - This account has **10,000 test ETH** for local testing!

4. **Switch to Localhost Network**
   - Select "Localhost 8545" from network dropdown

---

## 📱 Using the Application

### Upload Violation (Local Mode)

1. Open http://localhost:3000
2. Click "Connect MetaMask"
3. **Important**: Switch MetaMask to "Localhost 8545" network
4. Approve connection
5. Upload an image
6. Select violation type
7. Click "Upload to Blockchain"
8. Approve the transaction in MetaMask

The IPFS upload will use a public gateway (may be slow). The blockchain transaction will be instant on localhost!

### View Records

Click "View Records" tab to see all violations stored on your local blockchain.

---

## 💡 Understanding Local vs Testnet

| Feature | Local Blockchain | Sepolia Testnet |
|---------|------------------|-----------------|
| **Setup Time** | Instant | Requires MetaMask key + faucet |
| **Transaction Speed** | Instant | 10-30 seconds |
| **Persistence** | Temporary (resets on restart) | Permanent |
| **Cost** | Free (test ETH) | Free testnet ETH from faucet |
| **MetaMask Required** | Optional | Required |
| **Internet Required** | No (except IPFS) | Yes |

---

## 🔐 When You're Ready for Sepolia Testnet

### Step 1: Get Your MetaMask Private Key

1. Open MetaMask browser extension
2. Click the **3 dots (⋮)** next to your account name
3. Select **"Account Details"**
4. Click **"Show Private Key"** or **"Export Private Key"**
5. Enter your MetaMask password
6. **Copy the private key** (starts with `0x`)

⚠️ **NEVER share this with anyone!** It controls your real funds.

### Step 2: Get Sepolia Test ETH

Visit any of these faucets:
- https://sepoliafaucet.com/
- https://sepolia-faucet.pk910.de/
- https://faucet.quicknode.com/ethereum/sepolia

Paste your Ethereum address and request test ETH.

### Step 3: Update Configuration

Edit `contracts/.env`:
```env
PRIVATE_KEY=0xYourActualMetaMaskPrivateKeyHere
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY
```

Get Alchemy API key (free):
1. Go to https://www.alchemy.com/
2. Sign up (free)
3. Create new app → Select "Ethereum" → "Sepolia"
4. Copy API key

### Step 4: Deploy to Sepolia

```bash
cd contracts
npm run deploy
```

### Step 5: Update Frontend

Edit `web3-frontend/src/config/contract.js`:
```javascript
export const CONTRACT_ADDRESS = "0xYourNewSepoliaContractAddress";
```

Change the address to the one shown after deployment.

### Step 6: Restart Frontend

```bash
cd web3-frontend
npm start
```

In MetaMask, **switch to Sepolia network**.

---

## 📊 Test Accounts Available (Localhost Only)

Your local blockchain has 20 pre-funded accounts. Here are the first 3:

**Account #0** (10,000 ETH):
```
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**Account #1** (10,000 ETH):
```
Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```

**Account #2** (10,000 ETH):
```
Address: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

Import any of these into MetaMask for testing!

---

## 🐛 Troubleshooting

### "MetaMask: Network Error"
→ Make sure Hardhat node is running: `cd contracts && npx hardhat node`

### "Contract Not Found"
→ Deploy contract: `cd contracts && npx hardhat run scripts/deploy.js --network localhost`

### "IPFS Upload Slow"
→ Normal with public gateway. For faster uploads:
  1. Sign up at https://infura.io/product/ipfs
  2. Get project ID and secret
  3. Add to `web3-frontend/.env`:
     ```
     REACT_APP_IPFS_PROJECT_ID=your_id
     REACT_APP_IPFS_PROJECT_SECRET=your_secret
     ```

### "Wrong Network" in MetaMask
→ Switch MetaMask to "Localhost 8545" network

### Can't Connect MetaMask
→ Make sure localhost network is added to MetaMask (see section above)

---

## 📁 Generated Files

These files were auto-created for you:

- ✅ `contracts/.env` - Contains test wallet private key
- ✅ `contracts/deployments/localhost.json` - Local deployment info
- ✅ `web3-frontend/src/config/contract.js` - Updated with local contract address

---

## 🎓 Next Steps

1. **Test Locally** (Now):
   - Run frontend: `cd web3-frontend && npm start`
   - Connect MetaMask to localhost
   - Upload violations
   - View records

2. **Deploy to Testnet** (When Ready):
   - Get MetaMask private key
   - Get Sepolia test ETH
   - Update `.env` file
   - Deploy to Sepolia
   - Update frontend config

3. **Production** (Future):
   - Audit smart contract
   - Deploy to Ethereum Mainnet
   - Use hardware wallet for deployment
   - Implement additional security measures

---

## 🔗 Useful Commands

### Contracts
```bash
# Generate new test wallet
node scripts/generate-wallet.js

# Start local blockchain
npx hardhat node

# Deploy to localhost
npx hardhat run scripts/deploy.js --network localhost

# Deploy to Sepolia (when ready)
npm run deploy

# Run tests
npx hardhat test

# Compile contracts
npx hardhat compile
```

### Frontend
```bash
# Start development server
npm start

# Build for production
npm run build
```

---

## 📚 Documentation

- **Complete Guide**: [BLOCKCHAIN_SETUP.md](BLOCKCHAIN_SETUP.md)
- **Quick Start**: [QUICK_START_WEB3.md](QUICK_START_WEB3.md)
- **Contract Docs**: [contracts/README.md](contracts/README.md)

---

## ✨ Summary

**You're all set for local development!**

- ✅ Local blockchain running
- ✅ Contract deployed
- ✅ Frontend configured
- ✅ Test accounts available

**Just run:** `cd web3-frontend && npm start`

**When you get your MetaMask private key**, follow the "Sepolia Testnet" section to deploy to a public network.

---

**Happy Coding! 🚀**
