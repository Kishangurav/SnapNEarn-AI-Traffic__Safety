#!/bin/bash

echo "========================================"
echo " SnapNEarn Blockchain Setup Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "[1/5] Installing contract dependencies..."
cd contracts || exit
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install contract dependencies"
    exit 1
fi

echo ""
echo "[2/5] Creating .env file from template..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "[INFO] Created .env file. Please edit it with your credentials!"
else
    echo "[INFO] .env file already exists"
fi

echo ""
echo "[3/5] Compiling smart contracts..."
npx hardhat compile
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to compile contracts"
    exit 1
fi

echo ""
echo "[4/5] Installing frontend dependencies..."
cd ../web3-frontend || exit
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install frontend dependencies"
    exit 1
fi

echo ""
echo "[5/5] Setup complete!"
echo ""
echo "========================================"
echo " Next Steps:"
echo "========================================"
echo ""
echo "1. Edit contracts/.env file with your:"
echo "   - PRIVATE_KEY (from MetaMask)"
echo "   - SEPOLIA_RPC_URL (from Alchemy/Infura)"
echo ""
echo "2. Get Sepolia testnet ETH:"
echo "   https://sepoliafaucet.com/"
echo ""
echo "3. Deploy contract:"
echo "   cd contracts"
echo "   npm run deploy"
echo ""
echo "4. Update contract address in:"
echo "   web3-frontend/src/config/contract.js"
echo ""
echo "5. Start frontend:"
echo "   cd web3-frontend"
echo "   npm start"
echo ""
echo "========================================"
echo "For detailed instructions, see:"
echo "BLOCKCHAIN_SETUP.md"
echo "========================================"
echo ""

cd ..
