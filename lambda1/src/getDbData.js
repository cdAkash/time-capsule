import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient,QueryCommand } from '@aws-sdk/lib-dynamodb';

class CapsuleProcessor {
    #docClient;
    #tableName = 'UserCapsuleTable';

    constructor() {
        const dynamoDBClient = new DynamoDB({ region: process.env.AWS_REGION });
        this.#docClient = DynamoDBDocumentClient.from(dynamoDBClient);
    }

    async getPendingCapsulesForToday(todayDate) {
        const today = todayDate.split("T")[0]; // e.g., "2024-05-20"
        const params = {
            TableName: this.#tableName,
            IndexName: 'DeliveryDateStatusIndex',
            KeyConditionExpression: '#status = :status AND begins_with(#deliveryDate, :today)',
            ExpressionAttributeNames: {
                '#status': 'status',
                '#deliveryDate': 'deliveryDate'
            },
            ExpressionAttributeValues: {
                ':status': 'pending',
                ':today': today
            }
        };

        try {
            const data = await this.#docClient.send(new QueryCommand(params));
            return data.Items || [];
        } catch (error) {
            console.error("Error fetching pending capsules:", error);
            throw error;
        }
    }
}

export default CapsuleProcessor;