const hre = require("hardhat");

class BlockchainService {
  async deployContract(email, hash, deliveryDate) {
    try {
      // Input validation
      if (!email || typeof email !== 'string') {
        throw new Error("Email must be a non-empty string");
      }
      if (!hash || typeof hash !== 'string') {
        throw new Error("Hash must be a non-empty string");
      }
      if (!deliveryDate || typeof deliveryDate !== 'string') {
        throw new Error("DeliveryDate must be a non-empty string");
      }

      // Connect to the Sepolia network
      const sepoliaNetwork = hre.config.networks.sepolia;
      if (!sepoliaNetwork) {
        throw new Error("Sepolia network configuration not found in hardhat.config.js");
      }

      console.log(`Connecting to Sepolia network: ${sepoliaNetwork.url}`);
      const provider = new hre.ethers.JsonRpcProvider(sepoliaNetwork.url);
      const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

      console.log("Deploying with account:", signer.address);


      console.log("Deployment parameters:", {
        email,
        hash,
        deliveryDate,
      });

      // Get the contract factory
      const DataStorage = await hre.ethers.getContractFactory("DataStorage", signer);
      const contract = await DataStorage.deploy(email, hash, deliveryDate);
      await contract.waitForDeployment();

      const address = await contract.getAddress();
      console.log("Contract deployed to:", address);

      return address;
    } catch (error) {
      console.error("Deployment failed:", error);
      throw error;
    }
  }

  async getData(contractAddress) {
    try {
      const sepoliaNetwork = hre.config.networks.sepolia;
      const provider = new hre.ethers.JsonRpcProvider(sepoliaNetwork.url);
      const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
      console.log(`Connecting to contract at address: ${contractAddress}`);
  
      // Load the ABI
      const abiPath = "../../artifacts/contracts/TimeCapsule.sol/DataStorage.json";
      console.log(`Loading ABI from: ${abiPath}`);
      const abi = require(abiPath).abi;
  
      // ABI for debugging
      console.log("Loaded ABI:", JSON.stringify(abi, null, 2));
  
      // Instantiate the contract
      const contract = new hre.ethers.Contract(contractAddress, abi, wallet);
      console.log(`Contract instantiated successfully`);
  
      console.log(`Fetching data from contract at ${contractAddress}...`);
  
      
      const [email, hash, deliveryDate] = await contract.getData();
  
      console.log("Fetched data:", { email, hash, deliveryDate });
  
      return {
        contractAddress,
        data: {
          email,
          hash,
          deliveryDate: deliveryDate.toString(),
        },
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
}

module.exports = new BlockchainService();