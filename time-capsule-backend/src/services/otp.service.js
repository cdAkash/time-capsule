import nodemailer from "nodemailer"
import crypto from "crypto";
import {ApiError} from "../utils/ApiError.js"
import dotenv from "dotenv";

dotenv.config();

//email transporter setup

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"oracleserver21@gmail.com",
        pass:process.env.OTP_KEY_PASS
    },
});

let otpStore = {};

// Generate OTP

const generateOtp = async function (email){
  /*
  accept the email from the body
  check if the email is empty or not
  generate a six digit otp
  generate a expiry time-5min
  store otp and expiry locally not in database
  send the otp to the user
  send a succefull message as a response
  */

  if(!email){
    throw new ApiError(400,"Email is required")
  }
  const otp = crypto.randomInt(100000, 999999).toString();

 
  const expiry = Date.now() + 5 * 60 * 1000;

  otpStore[email]={otp,expiry}

  //sending the otp to the mail
  await transporter.sendMail({
    from:"OTP provide",
    to: email,
    subject:"Your OTP code",
    text:`Your otp is ${otp}. I will expire in 5 min`
  });
  return true

}

const verifyOtp = async function(email,otp){
  

  if (!email || !otp) {
    return { message: "Email and OTP are required", output: false };
  }

  const otpData = otpStore[email];

  if (!otpData) {
    return { message: "No OTP data found for this email. Try again.", output: false };
  }

  if (otpData.otp !== otp) {
    return { message: "Invalid OTP", output: false };
  }

  if (Date.now() > otpData.expiry) {
    return { message: "OTP has expired", output: false };
  }

  delete otpStore[email];
  return { message: "OTP verified successfully", output: true };

}

export{
  generateOtp,
  verifyOtp
}
