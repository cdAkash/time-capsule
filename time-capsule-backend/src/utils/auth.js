import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const hashPassword = async(password)=>{
    return bcrypt.hash(password,10);
  };

const comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
  };

const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  };

const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  };

export {
    hashPassword,
    comparePassword,
    generateAccessToken,
    generateRefreshToken
}