import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, NETWORKS } from '../config/contract';

let provider = null;
let signer = null;
let contract = null;

/**
 * Connect to MetaMask wallet
 * @returns {Promise<Object>} Connected account info
 */
export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask extension.');
    }

    console.log('🔌 Connecting to MetaMask...');

    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    // Create provider and signer
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);

    // Get network info
    const network = await provider.getNetwork();

    console.log('✅ Wallet connected:', address);
    console.log('⛓️  Network:', network.name, `(Chain ID: ${network.chainId})`);
    console.log('💰 Balance:', ethers.formatEther(balance), 'ETH');

    // Initialize contract
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    return {
      address,
      balance: ethers.formatEther(balance),
      network: network.name,
      chainId: network.chainId.toString(),
    };
  } catch (error) {
    console.error('❌ Wallet connection error:', error);
    throw error;
  }
};

/**
 * Check if wallet is already connected
 * @returns {Promise<boolean>} True if connected
 */
export const isWalletConnected = async () => {
  try {
    if (!window.ethereum) return false;

    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });

    return accounts.length > 0;
  } catch (error) {
    return false;
  }
};

/**
 * Get current connected account
 * @returns {Promise<string>} Account address
 */
export const getCurrentAccount = async () => {
  try {
    if (!signer) {
      await connectWallet();
    }
    return await signer.getAddress();
  } catch (error) {
    console.error('❌ Error getting account:', error);
    throw error;
  }
};

/**
 * Switch to Sepolia network
 * @returns {Promise<void>}
 */
export const switchToSepolia = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: NETWORKS.sepolia.chainId }],
    });
    console.log('✅ Switched to Sepolia network');
  } catch (error) {
    // Network not added, add it
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [NETWORKS.sepolia],
        });
        console.log('✅ Sepolia network added and switched');
      } catch (addError) {
        console.error('❌ Error adding Sepolia network:', addError);
        throw addError;
      }
    } else {
      console.error('❌ Error switching network:', error);
      throw error;
    }
  }
};

/**
 * Add a violation to the blockchain
 * @param {string} imageHash - IPFS CID of violation image
 * @param {string} violationType - Type of violation
 * @returns {Promise<Object>} Transaction receipt and violation ID
 */
export const addViolation = async (imageHash, violationType) => {
  try {
    if (!contract) {
      await connectWallet();
    }

    console.log('📝 Adding violation to blockchain...');
    console.log('   Image Hash:', imageHash);
    console.log('   Type:', violationType);

    // Call contract method
    const tx = await contract.addViolation(imageHash, violationType);
    console.log('⏳ Transaction sent:', tx.hash);
    console.log('   Waiting for confirmation...');

    // Wait for transaction confirmation
    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed!');
    console.log('   Block:', receipt.blockNumber);
    console.log('   Gas used:', receipt.gasUsed.toString());

    // Extract violation ID from event
    const event = receipt.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed.name === 'ViolationAdded';
      } catch {
        return false;
      }
    });

    let violationId = null;
    if (event) {
      const parsed = contract.interface.parseLog(event);
      violationId = parsed.args.id.toString();
      console.log('🆔 Violation ID:', violationId);
    }

    return {
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
      violationId,
      gasUsed: receipt.gasUsed.toString(),
    };
  } catch (error) {
    console.error('❌ Error adding violation:', error);
    throw error;
  }
};

/**
 * Get all violations from blockchain
 * @returns {Promise<Array>} Array of violation records
 */
export const getAllViolations = async () => {
  try {
    if (!contract) {
      // For read-only operations, we can use provider without signer
      provider = new ethers.BrowserProvider(window.ethereum);
      contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    }

    console.log('📥 Fetching all violations from blockchain...');

    const violations = await contract.getAllViolations();

    // Format violations for frontend use
    const formattedViolations = violations.map((v) => ({
      id: v.id.toString(),
      imageHash: v.imageHash,
      violationType: v.violationType,
      timestamp: new Date(Number(v.timestamp) * 1000).toISOString(),
      reporter: v.reporter,
      verified: v.verified,
    }));

    console.log(`✅ Retrieved ${formattedViolations.length} violations`);
    return formattedViolations;
  } catch (error) {
    console.error('❌ Error fetching violations:', error);
    throw error;
  }
};

/**
 * Get recent violations
 * @param {number} count - Number of recent violations to fetch
 * @returns {Promise<Array>} Array of recent violations
 */
export const getRecentViolations = async (count = 10) => {
  try {
    if (!contract) {
      provider = new ethers.BrowserProvider(window.ethereum);
      contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    }

    console.log(`📥 Fetching ${count} recent violations...`);

    const violations = await contract.getRecentViolations(count);

    const formattedViolations = violations.map((v) => ({
      id: v.id.toString(),
      imageHash: v.imageHash,
      violationType: v.violationType,
      timestamp: new Date(Number(v.timestamp) * 1000).toISOString(),
      reporter: v.reporter,
      verified: v.verified,
    }));

    console.log(`✅ Retrieved ${formattedViolations.length} recent violations`);
    return formattedViolations;
  } catch (error) {
    console.error('❌ Error fetching recent violations:', error);
    throw error;
  }
};

/**
 * Get violation by ID
 * @param {number} id - Violation ID
 * @returns {Promise<Object>} Violation details
 */
export const getViolation = async (id) => {
  try {
    if (!contract) {
      provider = new ethers.BrowserProvider(window.ethereum);
      contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    }

    console.log(`📥 Fetching violation #${id}...`);

    const v = await contract.getViolation(id);

    const violation = {
      id: v.id.toString(),
      imageHash: v.imageHash,
      violationType: v.violationType,
      timestamp: new Date(Number(v.timestamp) * 1000).toISOString(),
      reporter: v.reporter,
      verified: v.verified,
    };

    console.log('✅ Violation retrieved:', violation);
    return violation;
  } catch (error) {
    console.error('❌ Error fetching violation:', error);
    throw error;
  }
};

/**
 * Get violations by reporter address
 * @param {string} address - Reporter's address
 * @returns {Promise<Array>} Array of violation IDs
 */
export const getViolationsByReporter = async (address) => {
  try {
    if (!contract) {
      provider = new ethers.BrowserProvider(window.ethereum);
      contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    }

    console.log(`📥 Fetching violations by ${address}...`);

    const violationIds = await contract.getViolationsByReporter(address);
    const ids = violationIds.map((id) => id.toString());

    console.log(`✅ Found ${ids.length} violations by this reporter`);
    return ids;
  } catch (error) {
    console.error('❌ Error fetching violations by reporter:', error);
    throw error;
  }
};

/**
 * Verify a violation
 * @param {number} id - Violation ID to verify
 * @returns {Promise<Object>} Transaction receipt
 */
export const verifyViolation = async (id) => {
  try {
    if (!contract) {
      await connectWallet();
    }

    console.log(`✅ Verifying violation #${id}...`);

    const tx = await contract.verifyViolation(id);
    console.log('⏳ Transaction sent:', tx.hash);

    const receipt = await tx.wait();
    console.log('✅ Violation verified!');

    return {
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    console.error('❌ Error verifying violation:', error);
    throw error;
  }
};

/**
 * Get total violations count
 * @returns {Promise<number>} Total count
 */
export const getTotalViolations = async () => {
  try {
    if (!contract) {
      provider = new ethers.BrowserProvider(window.ethereum);
      contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    }

    const count = await contract.getTotalViolations();
    return Number(count);
  } catch (error) {
    console.error('❌ Error getting total violations:', error);
    throw error;
  }
};

// Listen to account changes
if (window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts) => {
    console.log('🔄 Account changed:', accounts[0]);
    window.location.reload();
  });

  window.ethereum.on('chainChanged', () => {
    console.log('🔄 Network changed');
    window.location.reload();
  });
}

export default {
  connectWallet,
  isWalletConnected,
  getCurrentAccount,
  switchToSepolia,
  addViolation,
  getAllViolations,
  getRecentViolations,
  getViolation,
  getViolationsByReporter,
  verifyViolation,
  getTotalViolations,
};
