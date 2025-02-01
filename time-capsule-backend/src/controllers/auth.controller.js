
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {createUser} from '../query/createQuery.js';
import {comparePassword,
    generateAccessToken,
    generateRefreshToken} from '../utils/auth.js'
import {getUserByEmail,
    updatePassword} from '../query/interactQuery.js'
import { UserCapsuleTable } from '../models/user-capsule.model.js';
// first register conntroller
// login controller
// forgot controller
// 

const registerUser=asyncHandler(async(req,res)=>{
    const {email,password} = req.body
    try {
        const response = await createUser(email,password);
        return res.status(response.statusCode).json(response)
    } catch (error) {
        return res.status(response.statusCode).json(error)
    }
    
})

const login = asyncHandler(async(req,res)=>{
    // steps to acheive login
    // get email and password from body
    // hit a query using email.
    // get the  database password and user password compare it
    // generate refreshToken and accessToken,
    // save the refreshToken in the database
    //allow user to be login by set the cookies.
    try {
        const {email,password} = req.body;
        function isValidEmail(email){
            const emailRegex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    
        if(!isValidEmail(email)){
            return new ApiResponse(400,{},"Not a vaild Email!")
        }
    
        const userResponse = await getUserByEmail(email);
        if (userResponse.statusCode !== 200) {
            return res
                .status(userResponse.statusCode)
                .json(userResponse);
        }
        const user = userResponse.data.user;

       

        const isPasswordValid = comparePassword(password,user.password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json(new ApiResponse(401, {}, "Invalid credentials"));
        }
        const accessToken = generateAccessToken(user.PK)
        const refreshToken = generateRefreshToken(user.PK)
    
        // updating the database with refreshToken
    
        try {
            await UserCapsuleTable.update({
                PK: user.PK,
                SK: 'METADATA'
            }, {
                $SET: {
                refreshToken: refreshToken
                }
                }
        );
        } catch (updateError) {
            console.error("Error updating refresh token:", updateError);
            return res
                .status(500)
                .json(new ApiResponse(500, {}, "Login failed - token update error"));
        }
    
        const options={
            httpOnly:true,
            secure:true
        }
        const userWithoutSensitiveData = {
            email: user.email,
            userId: user.PK,
            createdAt: user.createdAt,
            activeCapsule: user.activeCapsule
        };

        return res
            .status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",refreshToken,options)
            .json(new ApiResponse(
                200,
                {
                    user: userWithoutSensitiveData,
                    accessToken 
                },
                "Login successful"
            ));


    } catch (error) {
        console.error("Login error:", error);
        return res
            .status(500)
            .json(new ApiResponse(
                500,
                { error: error.message },
                "Login failed - internal server error"
            ));
    }

})

const forgotPassword = asyncHandler(async(req,res)=>{

})

const logout = asyncHandler(async(req,res)=>{
    try {
        const userId = req.user.data[0].PK
        // console.log(req.user.data[0].PK)
        await UserCapsuleTable.update({
                PK: userId,
                SK: 'METADATA'
            }, {
                $SET: {
                    refreshToken: '',
                    lastLogoutAt: new Date().toISOString()  
                }
            });
            const options = {
                httpOnly: true,
                secure: true,
            }
            return res
            .status(200)
            .clearCookie("accesToken",options)
            .clearCookie("refreshToken",options)
            .json(new ApiResponse(200, {}, "Logged out successfully"));

    } catch (error) {
        console.error("Logout error:", error);
        return res
            .status(500)
            .json(new ApiResponse(500, { error: error.message }, "Logout failed"));
    }
})

export {
    registerUser,
    login,
    forgotPassword,
    logout
}