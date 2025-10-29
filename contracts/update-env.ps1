$envContent = @"
PRIVATE_KEY=0x70253e65cc4a0199e210cfc8132b9e2509209974dde6d5759dd6984f548d2ea9
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
ETHERSCAN_API_KEY=demo
"@

$envContent | Out-File -FilePath ".env" -Encoding ASCII
Write-Host "✅ .env file updated with Sepolia credentials"
