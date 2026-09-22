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

    const response = await fetch(
        "https://api.brevo.com/v3/smtp/email",
        {
            method: "POST",

            headers: {
                "accept": "application/json",
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json"
            },

            body: JSON.stringify({
                sender: {
                    name: "PackUP",
                    email: process.env.EMAIL
                },

                to: [
                    {
                        email: to,
                        name: username
                    }
                ],

                subject,

                htmlContent: html
            })
        }
    );

    if (!response.ok) {

        const errorData =
            await response.text();

        console.error(
            "BREVO EMAIL ERROR:",
            errorData
        );

        throw new Error(
            `Email sending failed: ${response.status}`
        );
    }

    const data = await response.json();

    console.log(
        "Email sent successfully:",
        data.messageId
    );

    return data;
};