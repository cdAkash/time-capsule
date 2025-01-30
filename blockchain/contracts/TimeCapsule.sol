// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DataStorage {
    struct DataRecord {
        string email;
        string hash;
        uint256 deliveryDate;
    }
    
    DataRecord private record; // Single record for the contract
    bool private isInitialized; // Track if data has been initialized
    
    event DataStored(uint256 timestamp);
    
    // Constructor to initialize data during deployment
    constructor(
        string memory _email,
        string memory _hash,
        uint256 _deliveryDate
    ) {
        
        record = DataRecord(_email, _hash, _deliveryDate);
        isInitialized = true;
        emit DataStored(block.timestamp);
    }
    
    // Read-only function
    function getData() public view returns (string memory, string memory, uint256) {
        require(isInitialized, "Data not initialized");
        return (record.email, record.hash, record.deliveryDate);
    }
}