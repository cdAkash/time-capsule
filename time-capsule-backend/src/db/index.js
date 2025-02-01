import dotenv from 'dotenv';
import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb'; // Correct import for ListTablesCommand
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'; // Import DynamoDBDocumentClient from lib-dynamodb
import dynamoose from 'dynamoose';
dotenv.config();

// Configure AWS SDK with credentials and region
const client = new dynamoose.aws.ddb.DynamoDB({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


dynamoose.aws.ddb.set(client);

const connectToDynamoDB = async () => {
  try {
    const command = new ListTablesCommand({});
    const data = await client.send(command);
    console.log('Connected to DynamoDB. Tables:', data.TableNames);
    return data;
  } catch (err) {
    console.error('Unable to connect to DynamoDB:', err);
    throw err;
  }
};

export { connectToDynamoDB };