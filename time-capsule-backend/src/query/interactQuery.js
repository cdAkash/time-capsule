import {UserCapsuleTable} from '../models/user-capsule.model.js'
import {ApiResponse} from '../utils/ApiResponse.js';

async function getUserByEmail(email) {
    try {
        
        const user = await UserCapsuleTable.query(email)
            .where('email')
            .eq(email)
            .and()
            .where('SK')
            .eq('METADATA')
            .exec();
        
        if (user.length === 0) {
            return new ApiResponse(404, {}, "User not found!");
        }
            return new ApiResponse(200,{user:user[0]},"User Fetched successfully.")
    } catch (error) {
        return new ApiResponse(501,{error},"user fetching failed or user not Found!")
    }
}

async function getAllUsersCapsules(userId) {
    try {
        const capsules = await UserCapsuleTable.query('PK')
        .eq(`USER#${userId}`)
        .and()
        .where('SK')
        .beginsWith('CAPSULE#')
        .exec();
        if (capsules.length === 0) {
            return new ApiResponse(404, {}, "capsules not found!");
        }
        return new ApiResponse(200,{capsules},"Capusles Fetched Succesfully.")
    } catch (error) {
        return new ApiResponse(501,{error},"Capusles fetching failed!")
    }
}

async function updatePassword(email,newPassword) {
    try {
        const user = await UserCapsuleTable.query(email)
            .eq(email)
            .and()
            .where('SK')
            .eq('METADATA')
            .exec();

            if (user.length === 0) {
                return new ApiResponse(404, {}, "User not found!");
            }

            await UserCapsuleTable.update(
                {PK:user[0].PK,SK:user[0].SK},
                {password:newPassword}
            )
            return new ApiResponse(200,{},"Password Updated :)")
    } catch (error) {
        return new ApiResponse(501,{error},"Password updation Failed :(")
    }
}

async function getUserByID(FullUserId) {
    try {
        const user = await UserCapsuleTable.query('PK')
        .eq(FullUserId)
        .and()
        .where('SK')
        .eq('METADATA')
        .attributes(['PK','email'])
        .exec()

        
        return new ApiResponse(200,user,"User Found")
    } catch (error) {
        console.error("Error fetching user:", error);
        return new ApiResponse(501, { error: error.message }, "User fetching failed!");
    }
}
export {
    getUserByEmail,
    getAllUsersCapsules,
    updatePassword,
    getUserByID
}