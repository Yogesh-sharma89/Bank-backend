import nodemailer from 'nodemailer';
import { accessToken } from '../config/googletoken.js';

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        type:'OAuth2',
        clientId:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
        refreshToken:process.env.REFRESH_TOKEN,
        user:process.env.EMAIL_USER,
        accessToken:accessToken.token
    }
})

transporter.verify((error,success)=>{
    if(error){
        console.log('Error in connecting to mail server : '+error);
    }else{
        console.log('Email server is ready to send emails')
    }
})

const sendEmail = async(to , subject , text='' , html)=>{
    try{

        const info  = await transporter.sendMail({
            from:` Bank-backend -- ${process.env.EMAIL_USER}`,
            to,
            subject,
            text,
            html
        })

        console.log(`Email sent : ${info.messageId}`);
        console.log(`Preview url : ${nodemailer.getTestMessageUrl(info)}`)

    }catch(err){

        console.log(`Failed to send email : ${err}`)

    }
}

export const sendRegistirationEmail = async(email,name)=>{

    const subject = "Welcome to Bank-backend 🎉 Your Account is Ready";

    const html = 
    `
     <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8" />
        <title>Welcome to Bank-backend</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f5f7fa; font-family:Arial, sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
            <td align="center">

                <table width="600" cellpadding="0" cellspacing="0" 
                style="background:#ffffff; margin-top:40px; border-radius:8px; overflow:hidden;">

                
                <tr>
                    <td style="background:#1e3a8a; padding:25px; text-align:center; color:#ffffff;">
                    <h1 style="margin:0;">🏦 Bank-backend</h1>
                    </td>
                </tr>

                
                <tr>
                    <td style="padding:40px; color:#333;">
                    <h2 style="margin-top:0;">Hello ${name},</h2>

                    <p style="font-size:16px; line-height:1.6;">
                        Welcome to <strong>Bank-backend</strong>! 🎉
                    </p>

                    <p style="font-size:16px; line-height:1.6;">
                        Your account has been successfully created. 
                        You can now securely access and manage your banking backend services.
                    </p>

                    <p style="font-size:16px; line-height:1.6;">
                        We’re excited to have you onboard.
                    </p>


                    <p style="font-size:14px; color:#777;">
                        If you did not create this account, please contact support immediately.
                    </p>
                    </td>
                </tr>

                
                <tr>
                    <td style="background:#f1f5f9; padding:20px; text-align:center; font-size:12px; color:#888;">
                    © 2026 Bank-backend. All rights reserved.
                    </td>
                </tr>

                </table>

            </td>
            </tr>
        </table>

        </body>
        </html>

    `

    await sendEmail(email,subject,'',html);


}

export const sendLoginEmail = async(email,name)=>{
    const subject =  "Login Confirmation – Bank-backend";

    const html = `
            <!DOCTYPE html>
                <html>
                <body style="margin:0;padding:0;background:#eef2f7;font-family:Arial,sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                <td align="center">

                <table width="600" cellpadding="0" cellspacing="0" 
                style="background:#ffffff;margin-top:40px;border-radius:10px;overflow:hidden;">

                <tr>
                <td style="background:#0f172a;padding:30px;text-align:center;color:#ffffff;">
                <h1 style="margin:0;font-size:24px;">🔐 Bank-backend</h1>
                </td>
                </tr>

                <tr>
                <td style="padding:40px;color:#333;">
                <h2 style="margin-top:0;">Login Successful</h2>

                <p style="font-size:16px;line-height:1.6;">
                Your account was successfully accessed.
                Below are the details of this login activity:
                </p>

                <p style="font-size:14px;color:#6b7280;margin-top:20px;">
                If this was you, you can safely ignore this message.
                </p>

                </td>
                </tr>

                <tr>
                <td style="background:#f1f5f9;padding:20px;text-align:center;font-size:12px;color:#888;">
                © 2026 Bank-backend • Secure Login Notification
                </td>
                </tr>

                </table>

                </td>
                </tr>
                </table>
                </body>
                </html>
     `;


    await sendEmail(email,subject,"",html);


}

export const sendAccountCreatingEmail = async(email,name,accountId,date)=>{
    const subject = "Your Bank Account Has Been Successfully Created | Bank-backend";

    const html = `
                <!DOCTYPE html>
                <html>
                <head>
                <meta charset="UTF-8" />
                <title>Account Created</title>
                </head>

                <body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

                <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                <td align="center">

                <!-- Main Container -->
                <table width="620" cellpadding="0" cellspacing="0"
                style="background:#ffffff;margin-top:40px;border-radius:10px;overflow:hidden;
                box-shadow:0 6px 18px rgba(0,0,0,0.06);">

                <!-- Header -->
                <tr>
                <td style="background:#0b3d91;padding:28px;text-align:center;color:#ffffff;">
                <h1 style="margin:0;font-size:24px;font-weight:600;">🏦 Bank-backend</h1>
                <p style="margin:6px 0 0 0;font-size:14px;opacity:0.9;">
                Secure Banking Infrastructure
                </p>
                </td>
                </tr>

                <!-- Body -->
                <tr>
                <td style="padding:40px;color:#1a1a1a;">

                <h2 style="margin-top:0;font-size:20px;">Hello ${name},</h2>

                <p style="font-size:16px;line-height:1.6;color:#333;">
                We are pleased to inform you that your bank account has been successfully created on
                <strong>Bank-backend</strong>.
                </p>

                <p style="font-size:16px;line-height:1.6;color:#333;">
                Your account is now active and ready for secure access to our platform services.
                </p>

                <!-- Account Info Box -->
                <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#f1f5f9;border-radius:8px;margin:25px 0;">
                <tr>
                <td style="padding:20px;font-size:15px;color:#333;">
                <strong>Account Details</strong><br/><br/>
                Account Holder: ${name}<br/>
                Account ID:  ${accountId} <br/>
                Created On: ${date}
                </td>
                </tr>
                </table>

                <p style="font-size:16px;line-height:1.6;color:#333;">
                You may now log in to your dashboard to manage and operate your account securely.
                </p>

                <!-- Button -->
                <div style="text-align:center;margin:30px 0;">
                <a href="{{dashboard_link}}"
                style="background:#0b3d91;color:#ffffff;text-decoration:none;
                padding:14px 30px;border-radius:6px;font-size:15px;font-weight:600;">
                Access Your Account
                </a>
                </div>

                <p style="font-size:14px;color:#6b7280;">
                If you did not request this account creation, please contact our support team immediately.
                </p>

                </td>
                </tr>

                <!-- Footer -->
                <tr>
                <td style="background:#f9fafb;padding:22px;text-align:center;
                font-size:12px;color:#8a8a8a;line-height:1.6;">
                © 2026 Bank-backend<br/>
                This is an automated message. Please do not reply directly to this email.
                </td>
                </tr>

                </table>
                <!-- End Container -->

                </td>
                </tr>
                </table>

                </body>
                </html>
       `;

    await sendEmail(email,subject,"",html)


}


export const sendTransactionEmail = async(email,amount,name,to,date,id)=>{
    const subject = "Transaction Successful | Bank-backend";

    const html = `
                <!DOCTYPE html>
                <html>
                <head>
                <meta charset="UTF-8" />
                <title>Transaction Successful</title>
                </head>

                <body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

                <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                <td align="center">

                <table width="620" cellpadding="0" cellspacing="0"
                style="background:#ffffff;margin-top:40px;border-radius:10px;overflow:hidden;
                box-shadow:0 6px 18px rgba(0,0,0,0.06);">

                <!-- Header -->
                <tr>
                <td style="background:#0b3d91;padding:28px;text-align:center;color:#ffffff;">
                <h1 style="margin:0;font-size:24px;">🏦 Bank-backend</h1>
                <p style="margin:6px 0 0 0;font-size:14px;opacity:0.9;">
                Secure Transaction Notification
                </p>
                </td>
                </tr>

                <!-- Body -->
                <tr>
                <td style="padding:40px;color:#1a1a1a;">

                <h2 style="margin-top:0;font-size:20px;color:#111;">
                ✅ Transaction Successful
                </h2>

                <p style="font-size:16px;line-height:1.6;color:#333;">
                Hello <strong>${name}</strong>,
                </p>

                <p style="font-size:16px;line-height:1.6;color:#333;">
                We’re pleased to inform you that your transaction has been processed successfully.
                </p>

                <!-- Transaction Details Box -->
                <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#f1f5f9;border-radius:8px;margin:25px 0;">
                <tr>
                <td style="padding:20px;font-size:15px;color:#333;line-height:1.6;">
                <strong>Transaction Details</strong><br/><br/>
                Transaction ID: ${id}<br/>
                Amount: ₹${amount}<br/>
                To : ${to}
                Date: ${date}<br/>
                </td>
                </tr>
                </table>

                <p style="font-size:15px;line-height:1.6;color:#333;">
                Your account balance has been updated accordingly.
                </p>

                <p style="font-size:14px;color:#6b7280;margin-top:20px;">
                If this transaction was not authorized by you, please contact our support team immediately.
                </p>

                </td>
                </tr>

                <!-- Footer -->
                <tr>
                <td style="background:#f9fafb;padding:22px;text-align:center;
                font-size:12px;color:#8a8a8a;line-height:1.6;">
                © 2026 Bank-backend<br/>
                This is an automated transaction notification. Please do not reply to this email.
                </td>
                </tr>

                </table>

                </td>
                </tr>
                </table>

                </body>
                </html>
        `  ;
 

    await sendEmail(email,subject,"",html);
}

export const sendTransactionFailEmail = async(email,date,id)=>{
    const subject = "Transaction Failed | Bank-backend";

    const html = `
            <!DOCTYPE html>
            <html>
            <head>
            <meta charset="UTF-8" />
            <title>Transaction Failed</title>
            </head>

            <body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
            <td align="center">

            <table width="620" cellpadding="0" cellspacing="0"
            style="background:#ffffff;margin-top:40px;border-radius:10px;overflow:hidden;
            box-shadow:0 6px 18px rgba(0,0,0,0.06);">

            <!-- Header -->
            <tr>
            <td style="background:#7c2d12;padding:28px;text-align:center;color:#ffffff;">
            <h1 style="margin:0;font-size:24px;">🏦 Bank-backend</h1>
            <p style="margin:6px 0 0 0;font-size:14px;opacity:0.9;">
            Transaction Notification
            </p>
            </td>
            </tr>

            <!-- Body -->
            <tr>
            <td style="padding:40px;color:#1a1a1a;">

            <h2 style="margin-top:0;font-size:20px;color:#b91c1c;">
            ⚠ Transaction Failed
            </h2>

            <p style="font-size:16px;line-height:1.6;color:#333;">
            Hello <strong>{{name}}</strong>,
            </p>

            <p style="font-size:16px;line-height:1.6;color:#333;">
            We regret to inform you that your recent transaction could not be completed.
            </p>

            <!-- Transaction Details Box -->
            <table width="100%" cellpadding="0" cellspacing="0"
            style="background:#fef2f2;border-radius:8px;margin:25px 0;">
            <tr>
            <td style="padding:20px;font-size:15px;color:#333;line-height:1.6;">
            <strong>Transaction Details</strong><br/><br/>
            Transaction ID: ${id}<br/>
            Amount: ₹${amount}<br/>
            Date: ${date}<br/>
            </td>
            </tr>
            </table>

            <p style="font-size:15px;line-height:1.6;color:#333;">
            Please note that no amount has been deducted from your account.
            </p>

            <p style="font-size:14px;color:#6b7280;margin-top:20px;">
            If the issue continues, you may try again later or contact our support team for assistance.
            </p>

            </td>
            </tr>

            <tr>
            <td style="background:#f9fafb;padding:22px;text-align:center;
            font-size:12px;color:#8a8a8a;line-height:1.6;">
            © 2026 Bank-backend<br/>
            This is an automated notification regarding your transaction attempt.
            </td>
            </tr>

            </table>

            </td>
            </tr>
            </table>

            </body>
            </html>
        `;

    await sendEmail(email,subject,"",html);

}


export const  sendIntialTransactionEmail = async(email,date,id,name,amount)=>{

    const subject = "Initial Funding Successful | Bank-backend";
 
    const html = `
            <!DOCTYPE html>
            <html>
            <head>
            <meta charset="UTF-8" />
            <title>Initial Funding Successful</title>
            </head>

            <body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
            <td align="center">

            <table width="620" cellpadding="0" cellspacing="0"
            style="background:#ffffff;margin-top:40px;border-radius:10px;overflow:hidden;
            box-shadow:0 6px 18px rgba(0,0,0,0.06);">

            <!-- Header -->
            <tr>
            <td style="background:#14532d;padding:28px;text-align:center;color:#ffffff;">
            <h1 style="margin:0;font-size:24px;">🏦 Bank-backend</h1>
            <p style="margin:6px 0 0 0;font-size:14px;opacity:0.9;">
            System Funding Confirmation
            </p>
            </td>
            </tr>

            <!-- Body -->
            <tr>
            <td style="padding:40px;color:#1a1a1a;">

            <h2 style="margin-top:0;font-size:20px;color:#166534;">
            💰 Initial Funding Successful
            </h2>

            <p style="font-size:16px;line-height:1.6;color:#333;">
            Hello <strong>${name}</strong>,
            </p>

            <p style="font-size:16px;line-height:1.6;color:#333;">
            We confirm that the initial system funding has been successfully credited to your administrative account.
            </p>

            <!-- Funding Details Box -->
            <table width="100%" cellpadding="0" cellspacing="0"
            style="background:#ecfdf5;border-radius:8px;margin:25px 0;">
            <tr>
            <td style="padding:20px;font-size:15px;color:#333;line-height:1.6;">
            <strong>Funding Details</strong><br/><br/>
            Transaction ID: ${id}<br/>
            Amount Credited: ₹${amount}<br/>
            Date: ${date}<br/>
            Reference: Initial System Funding
            </td>
            </tr>
            </table>

            <p style="font-size:15px;line-height:1.6;color:#333;">
            This transaction activates operational liquidity within the Bank-backend platform.
            </p>

            <p style="font-size:14px;color:#6b7280;margin-top:20px;">
            If this action was not authorized, please contact system support immediately.
            </p>

            </td>
            </tr>

            <!-- Footer -->
            <tr>
            <td style="background:#f9fafb;padding:22px;text-align:center;
            font-size:12px;color:#8a8a8a;line-height:1.6;">
            © 2026 Bank-backend<br/>
            Automated System Funding Notification
            </td>
            </tr>

            </table>

            </td>
            </tr>
            </table>

            </body>
            </html>
        `;

    await sendEmail(email,subject,"",html);


    
}
