import nodemailer from 'nodemailer';

const OTP_KEY_PASS="xnyl vehm woqh fkpm";
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:"oracleserver21@gmail.com",
        pass:OTP_KEY_PASS
    }
});

export const sendFileLinkToEmail = async(email,fileURL)=>{
    const mailOptions ={
        from:"Team Time Capsule",
        to:email,
        subject:"Your memory is here :)",
        html:`
        <h2>Your memory is found the road to you</h2>
        <p>click on this link <a href="${fileURL}">here</a> to open your parcel </p>
        `
    }
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        if (info.rejected.length > 0) {
            console.error('Email was rejected for:', info.rejected);
            return { success: false, error: `Email was rejected for: ${info.rejected.join(', ')}` };
        }
        return { success: true, info };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
}

// async function sendMaile(){
//     const reusult = await sendFileLinkToEmail("akashyadav15032002@gmail.com","akashyadav.me")
//     console.log(reusult)
// }

// sendMaile() // testing done
