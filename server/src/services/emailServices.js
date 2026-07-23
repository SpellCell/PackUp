import nodemailer from "nodemailer";
// console.log("EMAIL:", process.env.EMAIL);
// console.log(
//     "EMAIL_PASSWORD loaded:",
//     !!process.env.EMAIL_PASSWORD
// );
const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: process.env.EMAIL,

        pass: process.env.EMAIL_PASSWORD

    }

});

export const sendEmail = async ({

    to,

    username,

    subject,

    heading,

    message

}) => {

    const html = `
<!DOCTYPE html>
<html>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">

<tr>

<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="
background:#ffffff;
border-radius:12px;
overflow:hidden;
margin:40px auto;
">

<tr>

<td
style="
background:#2563eb;
padding:30px;
text-align:center;
color:white;
font-size:28px;
font-weight:bold;
">

✈️ PackUP

</td>

</tr>

<tr>

<td style="padding:40px;">

<h2>Hello ${username}, 👋</h2>

<h3>${heading}</h3>

<p style="font-size:16px;line-height:1.7;">

${message}

</p>

<hr>

<p style="color:#777;font-size:13px;">

This email was sent automatically by PackUP.

</p>

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`;

    await transporter.sendMail({

        from: `"PackUP" <${process.env.EMAIL}>`,

        to,

        subject,

        html

    });

};