import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    },
})

export async function sendVerficiationMail({id, email, verificationToken}) {
    try{
        let info = await transporter.sendMail({
            from: ` "TwitterClone" <nasimur.shellbeehaken@gmail.com> `,
            to: email,
            subject: "Please verify your account on Twitter",
            text: `http://localhost:3000/verify?id=${id}&token=${verificationToken}`,
            html: `<a href= 'http://localhost:3000/verify?id=${id}&token=${verificationToken}' style= "border: 1.2px solid cyan; padding: 20px;"> Verify your Email </a>`,
        });
        return info;
    }
    catch(error){
        console.log("Email Verification error is " + error);
        return false;
    }
}