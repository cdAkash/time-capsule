//jwt implementation

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { getUserByID } from "../query/interactQuery.js";


const verifyJWT=asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");

        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        // console.log(decodedToken)
        const user = await getUserByID(decodedToken.userId);
        if(!user){

            throw new ApiError(401,"Invalid Access Token")
        }
        // console.log(user)
        req.user = user
        // console.log(req.user.PK)
        next()
    } catch (error) {
        return res.status(400).json(new ApiResponse(400, {}, "User not found"));
    }
})

export {verifyJWT}