require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "", //rpc url
      chainId: 11155111, 
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [], // Wallet private key
    },
  },
};