# SnapNEarn Smart Contracts

Ethereum smart contracts for decentralized traffic violation reporting system.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# Add: PRIVATE_KEY and SEPOLIA_RPC_URL

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Sepolia testnet
npm run deploy
```

## 📋 Contract Details

**Contract Name**: SnapNEarn.sol  
**Solidity Version**: 0.8.20  
**Network**: Ethereum Sepolia Testnet  

### Main Functions

#### Write Functions
- `addViolation(string imageHash, string violationType)` - Add new violation
- `verifyViolation(uint256 id)` - Verify a violation

#### Read Functions  
- `getAllViolations()` - Get all violations
- `getRecentViolations(uint256 count)` - Get recent violations
- `getViolation(uint256 id)` - Get specific violation
- `getViolationsByReporter(address reporter)` - Get user's violations
- `getTotalViolations()` - Get total count

### Events
- `ViolationAdded` - Emitted when new violation is added
- `ViolationVerified` - Emitted when violation is verified

## 🧪 Testing

Run the test suite:
```bash
npx hardhat test
```

Expected output:
```
  SnapNEarn Contract
    Deployment
      ✓ Should deploy with zero violations
      ✓ Should have correct initial state
    Adding Violations
      ✓ Should add a violation successfully
      ✓ Should emit ViolationAdded event
      ✓ Should reject empty image hash
      ✓ Should reject empty violation type
      ✓ Should track violations by reporter
    Retrieving Violations
      ✓ Should get all violations
      ✓ Should get specific violation by ID
      ✓ Should get recent violations
      ✓ Should handle invalid violation ID
    Verification
      ✓ Should verify a violation
      ✓ Should emit ViolationVerified event
      ✓ Should not verify already verified violation

  14 passing (2s)
```

## 🌐 Deployment

### Prerequisites
1. MetaMask with Sepolia ETH
2. Alchemy/Infura API key
3. Configure .env file

### Deploy Script

```bash
npm run deploy
```

This will:
1. Deploy contract to Sepolia
2. Save deployment info to `deployments/sepolia.json`
3. Display contract address and transaction details

### Local Testing

Start local Hardhat node:
```bash
npx hardhat node
```

In another terminal, deploy locally:
```bash
npm run deploy:local
```

## 📁 Project Structure

```
contracts/
├── contracts/
│   └── SnapNEarn.sol          # Main smart contract
├── scripts/
│   └── deploy.js              # Deployment script
├── test/
│   └── SnapNEarn.test.js      # Test suite
├── deployments/               # Deployment records
├── hardhat.config.js          # Hardhat configuration
├── package.json               # Dependencies
├── .env.example               # Environment template
└── README.md                  # This file
```

## 🔗 After Deployment

1. **Copy Contract Address** from deployment output
2. **Update Frontend Config**:
   - Go to `web3-frontend/src/config/contract.js`
   - Replace `CONTRACT_ADDRESS` with deployed address
3. **Copy ABI** (if needed):
   - From `artifacts/contracts/SnapNEarn.sol/SnapNEarn.json`
   - Already included in frontend config

## 🔐 Security

- Private keys are stored in `.env` (never committed)
- Contract uses OpenZeppelin libraries
- Input validation on all functions
- Events emitted for transparency

## 📚 Resources

- [Hardhat Documentation](https://hardhat.org/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Solidity Documentation](https://docs.soliditylang.org/)

## 📄 License

MIT
