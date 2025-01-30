const express = require("express");
const contractController = require("../controllers/contractController");

const router = express.Router();

// Create a new contract with initial data
router.post("/contracts", contractController.createContract);

// Get data from a contract
router.get("/contracts/:contractAddress", contractController.getData);

module.exports = router;