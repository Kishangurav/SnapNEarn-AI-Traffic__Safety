@echo off
cls
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║         SnapNEarn Web3 - SEPOLIA TESTNET LIVE            ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo ✅ Smart Contract: DEPLOYED TO SEPOLIA
echo    Address: 0x40B94974577C1435BC7fa03Af91AA569e94224EC
echo    Network: Sepolia Testnet
echo    Deployer: 0xA208348FAf6401F42eC1712cE4342cA0c49DEe8c
echo.
echo 🔗 View on Etherscan:
echo    https://sepolia.etherscan.io/address/0x40B94974577C1435BC7fa03Af91AA569e94224EC
echo.
echo ═══════════════════════════════════════════════════════════
echo  IMPORTANT: MetaMask Setup Required
echo ═══════════════════════════════════════════════════════════
echo.
echo Before using the app:
echo.
echo 1. Switch MetaMask to SEPOLIA TEST NETWORK
echo    - Click network dropdown in MetaMask
echo    - Select "Sepolia test network"
echo    - If not visible, enable in Settings ^> Advanced
echo.
echo 2. Import Your Account (if needed):
echo    - Address: 0xA208348FAf6401F42eC1712cE4342cA0c49DEe8c
echo    - You have 0.12 Sepolia ETH
echo.
echo 3. Get More Sepolia ETH (if needed):
echo    - Visit: https://sepoliafaucet.com/
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo Starting frontend...
echo App will open at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

cd web3-frontend
npm start
