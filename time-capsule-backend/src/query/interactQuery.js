import {UserCapsuleTable} from '../models/user-capsule.model.js'
import {ApiResponse} from '../utils/ApiResponse.js';
import {v4 as uuidv4} from 'uuid';

async function verifyOrCreateUser(email) {
    try {
        
        const user = await UserCapsuleTable.query(email)
            .where('email')
            .eq(email)
            .and()
            .where('SK')
            .eq('METADATA')
            .exec();
        
            if (user.length === 0) {
                // Creating the new user

                const userId = `USER#${uuidv4()}`;
                await UserCapsuleTable.create({
                    PK: userId,
                    SK: 'METADATA',
                    email: email,
                    createdAt: new Date().toISOString(),
                    lastLoginAt: new Date().toISOString()
                });
                return new ApiResponse(201, { isNewUser: true, userId }, "New user created");
            }
            return new ApiResponse(200, { 
                isNewUser: false, 
                userId: user[0].PK 
            }, "Existing user found");
    } catch (error) {
        return new ApiResponse(501,{error},"user fetching failed or user not Found!")
    }
}

async function getAllUsersCapsules(FullUserId) {
    try {
        // Validate user ID
        if (!FullUserId || !FullUserId.startsWith('USER#')) {
            return new ApiResponse(400, null, "Invalid user ID format");
        }

        const result = await UserCapsuleTable.query('PK')
            .eq(FullUserId)
            .and()
            .where('SK')
            .beginsWith('CAPSULE#')
            .select('COUNT')  
            .exec();

        return new ApiResponse(
            200,
            { 
                count: result.count
            },
            "Capsule count fetched successfully"
        );

    } catch (error) {
        console.error("Capsule count fetch error:", error);
        
        if (error.name === 'ValidationError') {
            return new ApiResponse(400, null, "Invalid query parameters");
        }

        return new ApiResponse(500, null, "Failed to fetch capsule count");
    }
}


export {
    verifyOrCreateUser,
    getAllUsersCapsules,
}