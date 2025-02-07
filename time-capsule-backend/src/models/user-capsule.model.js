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
        refreshToken:String,
        contractAddress:{type:String,unique:true},
        fileHash:String,
        fileURL:String,
        emails:{
            type:Array,
            schema:[String],
        },
        deliveryDate: { 
            type: String,
        },
        status:{
            type:String,
            index: {
                name: "DeliveryDateStatusIndex",
                global: true,
                rangeKey: "deliveryDate"
            }
        },
        createdAt:String,
    },{
        saveUnknown:true,
    }
)




export const UserCapsuleTable = dynamoose.model('UserCapsuleTable',UserCapsuleSchema,{
    waitForActive: true
})