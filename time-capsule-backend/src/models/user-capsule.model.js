import dynamoose from 'dynamoose';

const UserCapsuleSchema = new dynamoose.Schema(
    {
        PK:{
            type:String,
            required:true,
            hashKey:true,
        },
        SK:{
            type:String,
            required:true,
            rangeKey:true,
        },
        EntityType:{type:String,required:true},
        email:{type:String,unique:true,index:{name:"EmailIndex",global:true}},
        password:String,
        refreshToken:String,
        activeCapsule:{
            type:Array,
            schema:[String],
        },
        contractAddress:{type:String,unique:true},
        fileHash:String,
        fileURL:String,
        emails:{
            type:Array,
            schema:[String],
        },
        deliveryDate:String,
        createdAt:String,
    },{
        saveUnknown:true,
    }
)




export const UserCapsuleTable = dynamoose.model('UserCapsuleTable',UserCapsuleSchema,{
    waitForActive: true
})