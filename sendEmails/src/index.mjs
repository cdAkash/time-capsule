import { sendFileLinkToEmail } from "./mail.service.js";

export const handler = async (event) => {

  let input = JSON.parse(event.recipients)
  let allEmails=input;
  allEmails.push(event.sender)
  let response;
  for(const currEmail of allEmails){
    response = await sendFileLinkToEmail(currEmail,event.fileLink);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Message processed successfully" }),
  };
};


const event = {
  "sender":"notforpersonalusage@gmail.com",
  "recipients":["[\"akashyadav15032002@gmail.com\"","\"oracleserver21@gmail.com\"]"],
  "fileLink":"http://res.cloudinary.com/cdakash/image/upload/v1738574107/ejo9frmds9try9pisby2.jpg"
  }

handler(event).then((response) => {
  console.log('Handler response:', response);
})
.catch((error) => {
  console.error('Handler error:', error);
});