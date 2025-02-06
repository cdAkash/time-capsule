import { sendFileLinkToEmail } from "./mail.service.js";

export const handler = async (event) => {
  const inputString = event.detail.input; 
  console.log('Received input string:', inputString);

  let input;
  try {
    input = JSON.parse(inputString);
  } catch (error) {
    console.error('Error parsing input string:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid input format" }),
    };
  }

  const allEmails = input.recipients;
  allEmails.push(input.email)
  console.log('Parsed input:', allEmails);
  // console.log('Parsed input:', input.url);
  let response;
  for(const currEmail of allEmails){
    response = await sendFileLinkToEmail(currEmail,input.url);
  }


  //sending email logic
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Message processed successfully" }),
  };
};


const event = {
  "version": "0",
  "id": "53dc4d37-cffa-4f76-80c9-8b7d4a4d2eaa",
  "detail-type": "Scheduled Event",
  "source": "aws.events",
  "account": "123456789012",
  "time": "2023-10-05T12:00:00Z",
  "region": "us-east-1",
  "resources": [
    "arn:aws:events:us-east-1:123456789012:rule/ScheduledEvent-123456789"
  ],
  "detail": {
    "input": "{\"email\":\"akashyadav15032002@gmail.com\",\"recipients\":[\"notforpersonalusage@gmail.com\",\"oracleserver21@gmail.com\"],\"time\":\"19:32:26.478\",\"url\":\"http://example.com\"}"
  }
};

handler(event).then((response) => {
  console.log('Handler response:', response);
})
.catch((error) => {
  console.error('Handler error:', error);
});