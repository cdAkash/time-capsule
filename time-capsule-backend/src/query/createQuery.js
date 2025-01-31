import UserCapsuleTable from '../models/user-capsule.model.js'
import ApiResponse from '../utils/ApiResponse.js';
import {v4 as uuidv4} from 'uuid';

async function createUser(email,password) {
    const userId = uuidv4();
    const user = new UserCapsuleTable({
        PK:`USER#${userId}`,
        SK:`METADATA`,
        EntityType:'User',
        email,
        password,
        refreshToken:'',
        activeCapsule:[],
        createdAt:new Date().toISOString(),
    })

    
    try {
        await user.save();
        return new ApiResponse(200,{user},"User created")
    } catch (error) {
        return new ApiResponse(500,{error},"User Creation Failed")
    }
}

async function createCapsule(userId,contractAddress,hash,emails,deliveryDate) {
    const capsuleId=uuidv4();
    const capsule = new UserCapsuleTable({
        PK:`USER#${userId}`,
        SK:`CAPSULE#${capsuleId}`,
        EntityType:'capsule',
        contractAddress,
        hash,
        emails,
        deliveryDate,
        createdAt: new Date().toISOString(),
    })
    
    try {
        await capsule.save();
        return new ApiResponse(200,{user},"capsule created")
    } catch (error) {
        return new ApiResponse(500,{error},"capsule Creation Failed")
    }
}

export default {createUser,createCapsule}