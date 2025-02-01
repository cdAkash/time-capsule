import dynamoose from 'dynamoose';
import { UserCapsuleTable } from '../models/user-capsule.model';
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiResponse} from '../utils/ApiResponse.js'
// first register conntroller
// login controller
// forgot controller
// 

const registerUser=asyncHandler(async(req,res)=>{

})

const login = asyncHandler(async(req,res)=>{

})

const forgotPassword = asyncHandler(async(req,res)=>{

})

export default {
    registerUser,
    login,
    forgotPassword,
}