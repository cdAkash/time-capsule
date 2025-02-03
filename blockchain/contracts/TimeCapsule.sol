// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DataStorage {
    struct DataRecord {
        string email;
        string hash;
        string deliveryDate;
    }
    
    DataRecord private record; 
    bool private isInitialized; 

    constructor(
        string memory _email,
        string memory _hash,
        string memory _deliveryDate
    ) {
        
        record = DataRecord(_email, _hash, _deliveryDate);
        isInitialized = true;
        
    }
    
    // Read-only function
    function getData() public view returns (string memory, string memory, string memory) {
        require(isInitialized, "Data not initialized");
        return (record.email, record.hash, record.deliveryDate);
    }
}