export function verificationEmailConfig(body, link) {
    return JSON.stringify({
        personalizations: [
            {
                from: {
                    email: 'noreply@kards.social',
                    name: "Kards Social"
                },
                to: [{
                    email: body.email,
                    name: body.name
                }],
                subject: "Confirm your entry on the waitlist!",
            }
        ],
        from: {
            email: 'noreply@kards.social',
            name: "Kards Social"
        },
        subject: "Confirm your entry on the waitlist!",
        content: [
            {
                type: "text/plain",
                value: "Use the following link to confirm your entry on the waitlist: " + link
            },
            {
                type: "text/html",
                value: verificationEmail.replace('{{firstname}}', body.name.split(' ')[0]).replace('{{verificationlink}}', link)
            }
        ]
    });
}

const verificationEmail = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link target="_blank" href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <title>Confirm your entry on the waitlist!</title>
  </head>
  <body>
    <table
      width="100%"
      style="
        border-spacing: 0;
        color: #F7F3E3;
        background-color: #0C1618;
        font-family: 'Poppins', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        margin: 30px auto;
        max-width: 600px;
        padding: 24px;
        table-layout: fixed;
        width: 100%;
        border-radius: 10px;
      "
    >
      <!-- LOGO SECTION -->
      <tr>
        <td
          style="
            background-attachment: scroll;
            height: 84px;
            text-align: center;
            padding-top: 20px;
          "
        >
          <img
            src="https://kards.social/Logo.png"
            alt="Kards logo"
            style="border-width: 0; display: inline-block; max-width: 250px; vertical-align: middle"
          />
        </td>
      </tr>
      <!-- MESSAGE SECTION -->
      <tr>
        <td style="padding: 0;">
          <p style="
            color: #F7F3E3; 
            font-size: 32px; 
            font-weight: 800; 
            text-align: center; 
            margin: 36px;
            margin-bottom: 36px;
          ">
            Hey {{firstname}}! 👋
          </p>
        </td>
      </tr>
      <tr>
        <td>
            <p style="
                max-width: 420px;
                margin: 0 auto;
                text-align: center;
            ">
                Thanks so much for signin up! Be sure to confirm your email so we can place you on the waitlist. <br> 
                We promise to keep your inbox safe and clean!
            </p>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 50px 0px;">
            <a href="{{verificationlink}}" style="
              background-color: #F7F3E3;
              color: #0C1618;
              width: 250px;
              height: 50px;
              line-height: 49px;
              display: block;
              text-decoration: none;
              border-radius: 15px;
            ">
                Confirm your entry
            </a>
        </td>
      </tr>
    </table>
  </body>
</html>`;