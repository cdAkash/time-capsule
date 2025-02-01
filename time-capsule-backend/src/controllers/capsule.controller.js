import dynamoose from 'dynamoose';
import { UserCapsuleTable } from '../models/user-capsule.model';
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiResponse} from '../utils/ApiResponse.js'

// create capsule
// return all capsules for the user

const createCapsule = asyncHandler(async(req,res)=>{

})

const userAllCapsules = asyncHandler(async(req,res)=>{

})

export default{
    createCapsule,
    userAllCapsules,
}