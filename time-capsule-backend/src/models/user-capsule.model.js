import dynamoose from 'dynamoose';

const UserCapsuleSchema = new dynamoose.Schema(
    {
        PK:{
            type:String,
            required:true,
        },
        SK:{
            type:String,
            required:true,
        },
        EntityType:{type:String,required:true},
        email:{type:String,unique:true},
        password:String,
        activeCapsule:{
            type:Array,
            schema:[String],
        },
        contractAddress:{type:String,unique:true},
        hash:String,
        emails:{
            type:Array,
            schema:[String],
        },
        deliveryDate:String,
        createdAt:String,
    },{timestamps:true,saveUnknown:true}
)


export const UserCapsuleTable = dynamoose.model('UserCapsuleTable',UserCapsuleSchema)