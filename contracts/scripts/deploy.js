const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting SnapNEarn contract deployment...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Check deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  if (balance === 0n) {
    console.log("⚠️  WARNING: Account has zero balance!");
    console.log("   Get Sepolia testnet ETH from: https://sepoliafaucet.com/\n");
  }

  // Deploy SnapNEarn contract
  console.log("⏳ Deploying SnapNEarn contract...");
  const SnapNEarn = await hre.ethers.getContractFactory("SnapNEarn");
  const snapNEarn = await SnapNEarn.deploy();
  
  await snapNEarn.waitForDeployment();
  const contractAddress = await snapNEarn.getAddress();

  console.log("✅ SnapNEarn contract deployed to:", contractAddress);
  console.log("\n📋 Deployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Save deployment info to file
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber()
  };

  const deploymentsDir = "./deployments";
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  fs.writeFileSync(
    `${deploymentsDir}/${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("💾 Deployment info saved to:", `deployments/${hre.network.name}.json`);

  // Wait for block confirmations on public networks
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("\n⏳ Waiting for block confirmations...");
    await snapNEarn.deploymentTransaction().wait(6);
    console.log("✅ Confirmed!\n");

    console.log("🔍 Verify contract on Etherscan:");
    console.log(`   npx hardhat verify --network ${hre.network.name} ${contractAddress}`);
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📝 Next steps:");
  console.log("   1. Copy contract address to your React app");
  console.log("   2. Copy ABI from artifacts/contracts/SnapNEarn.sol/SnapNEarn.json");
  console.log("   3. Update CONTRACT_ADDRESS in your frontend config\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
