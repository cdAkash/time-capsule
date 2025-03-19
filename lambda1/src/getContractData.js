import { ethers } from 'ethers';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const dataStorage = require('./hardhat.abi.json');

async function getCapsuleData(contractAddress) {
    try {
      
      const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
      
     
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      console.log(`Connecting to contract at address: ${contractAddress}`);
    
      const abi = dataStorage.abi
 t
      const contract = new ethers.Contract(contractAddress, abi, wallet);
      console.log(`Contract instantiated successfully`);

      console.log(`Fetching data from contract at ${contractAddress}...`);
      const [email, hash, deliveryDate] = await contract.getData();
      // console.log("Fetched data:", { email, hash, deliveryDate });
      
  
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

// getCapsuleData("0x45b244301dd6F9A3d8A3EdB562573a2741b6e5b4")

export { getCapsuleData }