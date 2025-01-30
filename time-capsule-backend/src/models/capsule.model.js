import { PutCommand, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import {v4 as uuidv4} from 'uuid';
import{dynamoDB} from '../db/index.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import { QueryCommand } from '@aws-sdk/client-dynamodb';
const TABLE_NAME ='Capsule';

class Capsule{
    static fields ={
        capsuleId:'string',
        userId:'string',
        contractAddress:'string',
        hash:'string',
        emails:'array',
        deliveryDate:'string',
        createdAt:'string',
    };

    constructor({userId,contractAddress,hash,emails,deliveryDate}){
        this.capsuleId=uuidv4();
        this.userId=userId;
        this.contractAddress=contractAddress;
        this.hash=hash;
        this.emails=emails;
        this.deliveryDate= deliveryDate;
        this.createdAt=new Date().toISOString();
    };
    // saving the new capusule to the database
    async save(){
        const info={
            TableName:TABLE_NAME,
            Item:this
        };

    try {
        const newCap = await dynamoDB.send(new PutCommand(info))
        return new ApiResponse(200,newCap,"New capusle crated successfully. :)")
    } catch (error) {
        throw new ApiError(500,error,"<----------Error occured. :(");
        }
    }

    // fetching all the capsule for the specific user

    static async findAllCapusleByUserId(userId){
        const parameter ={
            TableName:TABLE_NAME,
            FilterExpression:'userId=:userId',
            ExpressionAttributeValues:{
                ':userId':userId
            }
        }
        let capsules=[]
        let lastEvaluatedKey = null;

        try {
            do{
                if(lastEvaluatedKey){
                    params.ExclusiveStartKey = lastEvaluatedKey;
                }
                const result = await dynamoDB.send(new QueryCommand(params));
                capsules.capsules.concat(result.Items);
                lastEvaluatedKey = result.LastEvaluatedKey;
            }while(lastEvaluatedKey);

            return JSON.stringify(capsules);
        } catch (error) {
            throw new ApiError(500,error,"Error occurred while fetching capsules :(")
        }
    };
}
export default Capsule;