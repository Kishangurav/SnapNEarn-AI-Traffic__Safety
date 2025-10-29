const { ethers } = require('ethers');
const fs = require('fs');

console.log('🔐 Generating Test Wallet for Local Development...\n');

// Generate a random wallet
const wallet = ethers.Wallet.createRandom();

console.log('✅ Test Wallet Generated!\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 Wallet Details:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Address:', wallet.address);
console.log('Private Key:', wallet.privateKey);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Create .env file with the generated credentials
const envContent = `# Auto-generated test wallet for LOCAL DEVELOPMENT ONLY
# DO NOT use this for real funds on mainnet or testnet!

# Local development private key
PRIVATE_KEY=${wallet.privateKey}

# For Sepolia testnet (when you're ready):
# 1. Install MetaMask extension
# 2. Create/Import account
# 3. Go to Account Details → Export Private Key
# 4. Replace the PRIVATE_KEY above with your real key
# 5. Get free Sepolia ETH from: https://sepoliafaucet.com/

# Alchemy/Infura RPC URL for Sepolia (optional - for testnet deployment)
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/demo

# Etherscan API Key (optional - for contract verification)
ETHERSCAN_API_KEY=demo
`;

fs.writeFileSync('.env', envContent);

console.log('✅ .env file created with test credentials!\n');
console.log('⚠️  IMPORTANT NOTES:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1. This wallet is for LOCAL TESTING ONLY');
console.log('2. It has NO real funds - perfect for development');
console.log('3. For Sepolia testnet, you need your MetaMask private key');
console.log('4. Never share your real private key with anyone!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📚 How to get your MetaMask Private Key:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1. Open MetaMask extension');
console.log('2. Click the 3 dots (⋮) on your account');
console.log('3. Select "Account Details"');
console.log('4. Click "Export Private Key"');
console.log('5. Enter your MetaMask password');
console.log('6. Copy the private key (starts with 0x)');
console.log('7. Replace PRIVATE_KEY in .env file');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🚀 Next Steps:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('For Local Testing (no MetaMask needed):');
console.log('  npm run node       # Start local blockchain');
console.log('  npm run deploy:local   # Deploy to local network');
console.log('\nFor Sepolia Testnet (requires MetaMask):');
console.log('  1. Update .env with your MetaMask private key');
console.log('  2. Get Sepolia ETH from faucet');
console.log('  3. npm run deploy  # Deploy to Sepolia');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
