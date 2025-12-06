const Mailgen = require("mailgen");
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Product Camp",
            link: "https://taskmanager.example.com"
        }
    });

    const emailTextual = mailGenerator.generatePlaintext(options.mailContent);
    const emailHtml = mailGenerator.generate(options.mailContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_TRAP_HOST,
        port: process.env.MAIL_TRAP_PORT,
        auth: {
            user: process.env.MAIL_TRAP_USERNAME,
            pass: process.env.MAIL_TRAP_PASSWORD
        }
    });

    const mail = {
        from: "sample.bit@bitcode.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml
    };

    try {
        const info = await transporter.sendMail(mail);
        console.log(info);
    } catch (error) {
        console.error("Error Occured: ", error);
    }
};

const emailVerificationMailContent = (username, verificationLink) => {
    return {
        body: {
            name: username,
            intro: "Welcome to Product Camp! We're very excited to have you on board.",
            action: {
                instructions: "To get started, please click here:",
                button: {
                    color: "#22BC66",
                    text: "Confirm your account",
                    link: verificationLink
                }
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help."
        }
    };
};

const forgotPasswordMailContent = (username, forgotPassLink) => {
    return {
        body: {
            name: username,
            intro: "You've requested the forgot password link",
            action: {
                instructions: "To reset the password, please click here:",
                button: {
                    color: "#22BC66",
                    text: "Reset Password",
                    link: forgotPassLink
                }
            }
        }
    };
};

module.exports = {
    emailVerificationMailContent,
    forgotPasswordMailContent, 
    sendEmail
};

/* 
    ethereal/mailtrap => provide fake SMTP creds. and give inbox
    mailgen => creates beautiful email temp.
    nodemail => sends the email
*/