// import { BrevoClient } from "@getbrevo/brevo";
// import dotenv from "dotenv";

// dotenv.config();

// const brevo = new BrevoClient({
//     apiKey: process.env.BREVO_API_KEY,
// });

// export const sendEmail = async (email, otp) => {

//     await brevo.transactionalEmails.sendTransacEmail({
//         sender: {
//             name: process.env.BREVO_SENDER_NAME,
//             email: process.env.BREVO_SENDER_EMAIL,
//         },

//         to: [
//             {
//                 email: email,
//             },
//         ],

//         subject: "RideShare Email Verification",

//         htmlContent: `
//             <h2>Email Verification</h2>
//             <p>Your OTP is:</p>
//             <h1>${otp}</h1>
//             <p>This OTP is valid for 5 minutes.</p>
//         `,
//     });

// };


import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

export const sendEmail = async (email, otp) => {
    try {
        await brevo.transactionalEmails.sendTransacEmail({
            sender: {
                name: process.env.BREVO_SENDER_NAME,
                email: process.env.BREVO_SENDER_EMAIL,
            },

            to: [
                {
                    email: email,
                },
            ],

            subject: "RideShare Email Verification",

            htmlContent: `
                <h2>Email Verification</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>This OTP is valid for 5 minutes.</p>
            `,
        });

        console.log("OTP EMAIL SENT TO:", email);

    } catch (error) {
        console.error("BREVO EMAIL ERROR:", error);
        throw error;
    }
};