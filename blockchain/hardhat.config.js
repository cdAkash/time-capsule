require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "", // Sepolia RPC URL
      chainId: 11155111, // Sepolia chain ID
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [], // Wallet private key
    },
  },
};