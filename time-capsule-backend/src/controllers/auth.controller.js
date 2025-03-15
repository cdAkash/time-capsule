
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {
    generateAccessToken,
    generateRefreshToken} from '../utils/auth.js'
import {
    verifyOrCreateUser,
} from '../query/interactQuery.js'
import { UserCapsuleTable } from '../models/user-capsule.model.js';
import {generateOtp,
    verifyOtp
} from '../services/otp.service.js'

const sendOTP = asyncHandler(async(req, res) => {
    const { email } = req.body;

    try {

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        if (!isValidEmail(email)) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "Not a valid Email!"));
        }

        await generateOtp(email);

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                { email },
                "OTP sent successfully. Please verify your email."
            ));

    } catch (error) {
        console.error("OTP generation error:", error);
        return res
            .status(500)
            .json(new ApiResponse(
                500,
                { error: error.message },
                "Failed to send OTP"
            ));
    }
});

const verifyOTPAndLogin = asyncHandler(async(req, res) => {
    const { email, otp } = req.body;

    try {
        
        const otpVerification = await verifyOtp(email, otp);
        
        if (!otpVerification.output) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, otpVerification.message));
        }

        
        const userResponse = await verifyOrCreateUser(email);
        if (userResponse.statusCode !== 200 && userResponse.statusCode !== 201) {
            return res
                .status(userResponse.statusCode)
                .json(userResponse);
        }

        const userId = userResponse.data.userId;
        const userCapsules = userResponse.data.capsules || [];
        const accessToken = generateAccessToken(userId);
        const refreshToken = generateRefreshToken(userId);

        try {
            await UserCapsuleTable.update({
                PK: userId,
                SK: 'METADATA'
            }, {
                $SET: {
                    refreshToken: refreshToken,
                    lastLoginAt: new Date().toISOString()
                }
            });
        } catch (updateError) {
            console.error("Error updating refresh token:", updateError);
            return res
                .status(500)
                .json(new ApiResponse(500, {}, "Login failed - token update error"));
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        };

        const userWithoutSensitiveData = {
            email,
            userId,
            isNewUser: userResponse.data.isNewUser,
            capsules: userCapsules
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(
                200,
                {
                    user: userWithoutSensitiveData,
                },
                "Login successful"
            ));

    } catch (error) {
        console.error("Verification error:", error);
        return res
            .status(500)
            .json(new ApiResponse(
                500,
                { error: error.message },
                "Verification failed"
            ));
    }
});


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
                secure: process.env.NODE_ENV==='production',
                sameSite:process.env.NODE_ENV==='production' ? 'None' : 'Lax',
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
    sendOTP,
    verifyOTPAndLogin,
    logout
}