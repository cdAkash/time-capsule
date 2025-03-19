const express = require("express");
const contractRoutes = require("./routes/contractRoutes");

const app = express();

app.use(express.json());

// Routes
app.use("/api", contractRoutes);

module.exports = app;