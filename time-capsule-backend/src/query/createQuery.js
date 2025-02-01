import {UserCapsuleTable} from '../models/user-capsule.model.js'
import {ApiResponse} from '../utils/ApiResponse.js';
import {v4 as uuidv4} from 'uuid';
import  {hashPassword}  from '../utils/auth.js';

async function createUser(email,password) {
    try {
        const userId = uuidv4();
        const hashedPass = await hashPassword(password)
        //token generation

        const user = new UserCapsuleTable({
        PK:`USER#${userId}`,
        SK:`METADATA`,
        EntityType:'User',
        email:email,
        password:hashedPass,
        refreshToken:'',
        activeCapsule:[],
        createdAt:new Date().toISOString(),
    })
        await user.save();
        // Verifying the  user creation 
        const verifiedUser = await UserCapsuleTable.query('PK')
            .eq(`USER#${userId}`)
            .and()
            .where('SK')
            .eq('METADATA')
            .exec();

        if (!verifiedUser || verifiedUser.length === 0) {
            throw new Error('User creation verification failed');
        }

        // Returning the verified user data
        return new ApiResponse(201, { 
            user: verifiedUser[0],
            userId: userId 
        }, "User created successfully");
    } catch (error) {
        console.error("user creation Failed",error)
        return new ApiResponse(500,{error:error.message},"User Creation Failed")
    }
}

async function createCapsule(userId, contractAddress, fileHash, fileURL, emails, deliveryDate) {
    try {
        const capsuleId = uuidv4();
        
        // Input validation
        if (!userId || !fileHash || !fileURL || !emails || !deliveryDate) {
            throw new Error("Missing required fields");
        }
        console.log(contractAddress)
        if(!contractAddress){
            throw new Error("Missing Contract address");
        }

        const capsule = new UserCapsuleTable({
            PK: `USER#${userId}`,
            SK: `CAPSULE#${capsuleId}`,
            EntityType: 'Capsule',
            contractAddress,
            fileHash,
            fileURL,
            emails,
            deliveryDate,
            createdAt: new Date().toISOString(),
        });

        await capsule.save();

        // Verify capsule creation
        const verifiedCapsule = await UserCapsuleTable.query('PK')
            .eq(`USER#${userId}`)
            .and()
            .where('SK')
            .eq(`CAPSULE#${capsuleId}`)
            .exec();

        if (!verifiedCapsule || verifiedCapsule.length === 0) {
            throw new Error("Capsule creation verification failed");
        }

        return new ApiResponse(201, {
            capsule: verifiedCapsule[0],
            capsuleId
        }, "Capsule created successfully");

    } catch (error) {
        console.error("Capsule creation failed:", error);
        return new ApiResponse(500, { error: error.message }, "Capsule creation failed");
    }
}
export {createUser,createCapsule}