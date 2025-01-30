const deployedAddress = "0xec3e91A2fE1A77C30338c1b9820F42Db9758bf0D"; // Replace with the actual address
const abiPath = "./artifacts/contracts/TimeCapsule.sol/DataStorage.json";
const abi = require(abiPath).abi;

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const deployedContract = new ethers.Contract(deployedAddress, abi, signer);

const [email, hash, deliveryDate] = await deployedContract.getData();
console.log({ email, hash, deliveryDate });