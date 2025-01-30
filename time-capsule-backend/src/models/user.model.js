import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import {v4 as uuidv4} from 'uuid';
import{dynamoDB} from '../db/index.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
const TABLE_NAME ='User';

class User{
    static fields = {
        userId:'string',
        email:'string',
        password:'string',
        activeCapsule:'array',
        createdAt:'string',
    };

    constructor({email,password}){
        this.userId=uuidv4();
        this.email=email;
        this.password=password;
        this.activeCapsule=[];
        this.createdAt=new Date().toDateString();
    }
    
    async save(){
        const info={
            TableName:TABLE_NAME,
            Item:this
        };
        try {
            const newUser = await dynamoDB.send(new PutCommand(info));
            return new ApiResponse(200,newUser,"User added successfully. :)");
        } catch (error) {
            throw new ApiError(400,{error},"<-----Error saving user to DB :(")
        }
    }

    static async findById(userId){
        const info ={
            TableName:TABLE_NAME,
            key:{
                userId:userId
            }
        }

        try {
            const result = await dynamoDB.send(new GetCommand(info));
            return result.Item;
        } catch (error) {
            throw new ApiError(400,{error},",--------Error Finding user in DB");
        }
    }
}

export default User;