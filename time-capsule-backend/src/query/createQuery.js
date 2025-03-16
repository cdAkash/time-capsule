import {UserCapsuleTable} from '../models/user-capsule.model.js'
import {ApiResponse} from '../utils/ApiResponse.js';
import {v4 as uuidv4} from 'uuid';
import  {hashPassword}  from '../utils/auth.js';


async function createCapsule(userId,email,contractAddress, fileHash, fileURL, emails, deliveryDate) {
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
            PK: `${userId}`,
            SK: `CAPSULE#${capsuleId}`,
            EntityType: 'Capsule',
            email,
            contractAddress,
            fileHash,
            fileURL,
            emails,
            deliveryDate,
            status:"pending",
            createdAt: new Date().toISOString(),
        });

        await capsule.save();

        // Verify capsule creation
        const verifiedCapsule = await UserCapsuleTable.query('PK')
            .eq(`${userId}`)
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
export {createCapsule}