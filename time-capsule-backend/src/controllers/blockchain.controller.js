import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiResponse} from '../utils/ApiResponse.js'

// create a contract for the capsule and return the contract addresss
// Controller for accept contractAddress and return the data after fetching it from the blockchain network.

async function createCapsuleContract(email,hash,deliveryDate) {
    try {
        const response = await fetch(`http://localhost:3000/api/contracts`,{
            method:'POST',
            headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    hash,
                    deliveryDate
                })
        })
        if (!response.ok) {
            throw new Error('Contract creation failed');
        }
    
        const data = await response.json();
        return data.contractAddress;
    } catch (error) {
        console.error('Contract creation error:', error);
        return new ApiResponse(501,{},"Failed to create contract")
    }
}


export {
    createCapsuleContract,
}