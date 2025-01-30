const express = require("express");
const contractController = require("../controllers/contractController");

const router = express.Router();


router.post("/contracts", contractController.createContract);

router.get("/contracts/:contractAddress", contractController.getData);

module.exports = router;