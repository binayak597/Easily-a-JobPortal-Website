
import nodeMailer from "nodemailer";

const sendEmail = async (receiver, companyName, position) => {
    //configure the email and send it

const transporter = nodeMailer.createTransport({

    //which smtp server service you are using
    service: 'gmail',
    auth: {
        user: 'binayak.mukherjee9640@gmail.com',
        pass: 'wgey ogxn lprg issv'
    }
});

//configure the email

const mailBody = {
    from: 'binayak.mukherjee9640@gmail.com', //official email account for this easily jobSite
    to: receiver,
    subject: 'Application Successfully Received',
    text: `Thanks for Applying to ${companyName} for this ${position} position. We will notify you for further rounds.`
};


//send the mail
try {
    await transporter.sendMail(mailBody);
    console.log("Email sent successfully");
} catch (error) {
    console.log("Email sent failed with an error: " + error);
}
}

export default sendEmail;
