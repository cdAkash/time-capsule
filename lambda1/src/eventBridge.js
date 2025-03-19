import { SchedulerClient, CreateScheduleCommand } from "@aws-sdk/client-scheduler";

const schedulerClient = new SchedulerClient({ region: process.env.AWS_REGION });
function parseMessage(message) {
  const parts = message.split(',');
  if (parts.length < 4) {
      throw new Error("Invalid message format: insufficient parts");
  }
  const sender = parts[0];
  const fileLink = parts[parts.length - 1];
  const timestamp = parts[parts.length - 2];
  const recipientsRaw = parts.slice(1, parts.length - 2).join(',');

  return [sender, recipientsRaw, timestamp, fileLink];
}
export async function scheduleCapsule(message) {
  const [sender, recipientsRaw, timestamp, fileLink] = parseMessage(message);
  const recipients = recipientsRaw.split(',').map(r => r.trim().replace(/^["'](.*)["']$/, '$1'));

  const [hours, minutes, seconds] = timestamp.split(':').map(Number);
  const now = new Date();
  const scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    Math.floor(seconds)
  );

  const localScheduledTime = new Date(
    scheduledTime.getTime() - (scheduledTime.getTimezoneOffset() * 60000)
  );
  
  if (localScheduledTime <= now) {
    localScheduledTime.setDate(localScheduledTime.getDate() + 1);
  }

  const scheduleName = `capsule-${localScheduledTime.getTime()}-${Math.random().toString(36).substr(2, 5)}`;

  const command = new CreateScheduleCommand({
    Name: scheduleName,
    ScheduleExpression: `at(${localScheduledTime.toISOString().split('.')[0]})`,
    ScheduleExpressionTimezone: "Asia/Kolkata", // ISO 8601 format
    Target: {
      Arn: process.env.LAMBDA_FUNCTION_ARN, 
      RoleArn: process.env.EVENTBRIDGE_SCHEDULER_ROLE_ARN, 
      Input: JSON.stringify({
        sender,
        recipients,
        fileLink,
      }),
    },
    FlexibleTimeWindow: { Mode: "OFF" },
    RetryPolicy: {
      MaximumEventAgeInSeconds: 86400, 
      MaximumRetryAttempts: 3,
    },
  });

  try {
    await schedulerClient.send(command);
    console.log(`Scheduled ${scheduleName} successfully.`);
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw error;
  }
}