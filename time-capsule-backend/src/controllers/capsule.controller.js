import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js' 
// create capsule
// return all capsules for the user
import { createCapsule as createCapsuleQuery } from '../query/createQuery.js'
import { createCapsuleContract } from './blockchain.controller.js'
import { generateFileHash } from '../services/hash.service.js'
import { getAllUsersCapsules } from '../query/interactQuery.js'


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
    
    // const contractAddress= await createCapsuleContract(email,fileHash,deliveryDateTimeStamp);
    // if (contractAddress instanceof ApiResponse) {
    //         throw new Error(contractAddress.message);
    //     }
    
    const contractAddress ="0x45b244301dd6F9A3d8A3EdB562573a2741b6e5b4"

    
        const capsule = await createCapsuleQuery(userId,contractAddress,fileHash,fileURL,emails,deliveryDate);
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

const userAllCapsules = asyncHandler(async(req, res) => {
    try {
        
        if (!req.user?.data?.[0]?.PK) {
            return res
                .status(401)
                .json(new ApiResponse(401, null, "Unauthorized access"));
        }

        const userId = req.user.data[0].PK;
        const capsuleResponse = await getAllUsersCapsules(userId);

    
        if (capsuleResponse.statusCode !== 200) {
            return res
                .status(capsuleResponse.statusCode)
                .json(capsuleResponse);
        }
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                { capsuleCount: capsuleResponse.data.count },
                "Successfully retrieved capsule count"
            ));

    } catch (error) {
        console.error("Controller error - userAllCapsules:", error);
        
        return res
            .status(500)
            .json(new ApiResponse(
                500,
                null,
                "Failed to retrieve capsule count. Please try again later."
            ));
    }
});

export {
    createCapsuleController,
    userAllCapsules,
}