
const e = {
    "sender":"surajdas@example.com",
    "recipients":["[\"akashyadav15032002@gmail.com\"","\"sumitshar16@gmail.com\"]"],
    "fileLink":"http://res.cloudinary.com/cdakash/image/upload/v1738574107/ejo9frmds9try9pisby2.jpg"
}

let input = JSON.parse(e.recipients)
let allEmails=input;
allEmails.push(e.sender)

console.log(allEmails)


