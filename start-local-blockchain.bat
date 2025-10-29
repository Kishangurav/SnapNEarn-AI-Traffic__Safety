@echo off
echo ========================================
echo  Starting Local Blockchain for Testing
echo ========================================
echo.
echo This will start a local Ethereum blockchain
echo No internet or MetaMask private key required!
echo.
echo Contract deployed at:
echo 0x5FbDB2315678afecb367f032d93F642f64180aa3
echo.
echo Default test accounts with 10,000 ETH each:
echo Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
echo Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
echo.
echo ========================================
echo.

cd contracts
npx hardhat node
