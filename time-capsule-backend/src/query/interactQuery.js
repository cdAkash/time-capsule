import {UserCapsuleTable} from '../models/user-capsule.model.js'
import {ApiResponse} from '../utils/ApiResponse.js';
import {v4 as uuidv4} from 'uuid';

async function verifyOrCreateUser(email) {
    try {
        // First check if user exists
        const user = await UserCapsuleTable.query(email)
            .where('email')
            .eq(email)
            .and()
            .where('SK')
            .eq('METADATA')
            .exec();
        
        let userId;
        let isNewUser = false;
        let capsules = [];
        
        if (user.length === 0) {
            // Creating the new user
            userId = `USER#${uuidv4()}`;
            await UserCapsuleTable.create({
                PK: userId,
                SK: 'METADATA',
                email: email,
                createdAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
                EntityType: 'USER'
            });
            isNewUser = true;
        } else {
            userId = user[0].PK;
            
      
            try {
                const userCapsules = await UserCapsuleTable.query(userId)
                    .where('PK')
                    .eq(userId)
                    .and()
                    .where('SK')
                    .beginsWith('CAPSULE#')
                    .exec();
                
                capsules = userCapsules.map(capsule => ({
                    id: capsule.SK.replace('CAPSULE#', ''),
                    contractAddress: capsule.contractAddress,
                    fileURL: capsule.fileURL,
                    recipients: capsule.emails || [],
                    deliveryDate: capsule.deliveryDate,
                    status: capsule.status || 'pending',
                    createdAt: capsule.createdAt
                }));
            } catch (capsuleError) {
                console.error("Error fetching user capsules:", capsuleError);
            
            }
        }
        
        return new ApiResponse(
            isNewUser ? 201 : 200,
            { 
                isNewUser, 
                userId,
                capsules
            }, 
            isNewUser ? "New user created" : "Existing user found"
        );
    } catch (error) {
        console.error("User verification error:", error);
        return new ApiResponse(501, { error }, "User fetching failed or user not found!")
    }
}


async function getAllUsersCapsules(FullUserId) {
    try {
   
        if (!FullUserId || !FullUserId.startsWith('USER#')) {
            return new ApiResponse(400, null, "Invalid user ID format");
        }

        const capsules = await UserCapsuleTable.query('PK')
            .eq(FullUserId)
            .and()
            .where('SK')
            .beginsWith('CAPSULE#')
            .exec();
            
        const formattedCapsules = capsules.map(capsule => ({
            id: capsule.SK.replace('CAPSULE#', ''),
            contractAddress: capsule.contractAddress,
            fileURL: capsule.fileURL,
            recipients: capsule.emails || [],
            deliveryDate: capsule.deliveryDate,
            status: capsule.status || 'pending',
            createdAt: capsule.createdAt
        }));

        return new ApiResponse(
            200,
            { 
                count: capsules.length,
                capsules: formattedCapsules
            },
            "Capsules fetched successfully"
        );

    } catch (error) {
        console.error("Capsule fetch error:", error);
        
        if (error.name === 'ValidationError') {
            return new ApiResponse(400, null, "Invalid query parameters");
        }

        return new ApiResponse(500, null, "Failed to fetch capsules");
    }
}


async function getUserByID(userId){
    try{
        if (!userId || !userId.startsWith('USER#')) {
            console.error("Invalid user ID format:", userId);
            return null;
        }
        // console.log("Get user by ID reached:",userId);

        // Query the user's metadata
        const user = await UserCapsuleTable.query(userId)
            .where('PK')
            .eq(userId)
            .and()
            .where('SK')
            .eq('METADATA')
            .exec();
        

        // console.log("From get userByID",user)
        if (user.length === 0) {
            console.error("User not found with ID:", userId);
            return null;
        }
        return user[0];
    }catch(err){
        console.error("Get user by ID error:", err)
        return null;
    }
}
export {
    verifyOrCreateUser,
    getAllUsersCapsules,
    getUserByID
}