const blockchainService = require("../services/blockchainService");

class ContractController {
  async createContract(req, res) {
    try {
      const { email, hash, deliveryDate } = req.body;
      const contractAddress = await blockchainService.deployContract(email, hash, deliveryDate);
      res.status(201).json({ contractAddress });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getData(req, res) {
    try {
      const { contractAddress } = req.params;
      const data = await blockchainService.getData(contractAddress);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ContractController();