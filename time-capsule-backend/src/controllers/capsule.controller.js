
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js' 
// create capsule
// return all capsules for the user
import { createCapsule as createCapsuleQuery } from '../query/createQuery.js'
import { createCapsuleContract } from './blockchain.controller.js'
import { generateFileHash } from '../services/hash.service.js'
const createCapsuleController = asyncHandler(async(req,res)=>{

    const {emails,deliveryDate}=req.body

    if (typeof emails === 'string') {
        try {
            emails = JSON.parse(emails);
        } catch (error) {
            return res.status(400).json(
                new ApiResponse(400, null, "Emails must be a valid JSON array")
            );
        }
    }

    // Validate emails array
    if (!Array.isArray(emails) || emails.length === 0 || emails.length > 2) {
        return res.status(400).json(
            new ApiResponse(400, null, "Please provide 1-2 valid email addresses")
        );
    }
    const userId = req.user.data[0].PK
    const email =req.user.data[0].email
    console.log(email)

    const localFilePath = req.file?.path;
    const fileHash = generateFileHash(localFilePath)
    try {

    const cloud = await uploadOnCloudinary(localFilePath)
    const fileURL = cloud.url
    const deliveryDateTimeStamp = Math.floor(new Date(deliveryDate).getTime() / 1000);
    const contract= await createCapsuleContract(email,fileHash,deliveryDateTimeStamp);
    const contractAddress=contract.contractAddress;
    console.log(contract)
    // const contractAddress ="testing contract"

    
        const capsule = await createCapsuleQuery(userId,contract,fileHash,fileURL,emails,deliveryDate);
        if(capsule.statusCode!==201){
            throw new error(capsule.message || "Capsule creation Failed")
        }
        return res.status(201).json(
            new ApiResponse(201, { capsule }, "Capsule created Successfully")
        );
    } catch (error) {
        console.error("Capsule creation error:", error);
        return res.status(500).json(
            new ApiResponse(500, { error: error.message }, "Capsule creation failed")
        );
    }
})

const userAllCapsules = asyncHandler(async(req,res)=>{

})

export {
    createCapsuleController,
    userAllCapsules,
}