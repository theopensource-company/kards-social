import { Success, Error, Redirect } from '../../constants/ApiResponse';
import jwt from '@tsndr/cloudflare-worker-jwt'

async function allowedByRateLimit(rl, key, max = 5, period = 1) {
  key = `${key.split(':')[0]}:${await createSha256Hash(key.split(':')[1])}`;
  const requests = ((await rl.get(key)) ?? '')
    .split(',')
    .map((r) => parseInt(r))
    .filter((r) => r + 3600000 * period > new Date().getTime())
    .slice(~max + 1);
  requests.push(new Date().getTime());
  await rl.put(key, requests.join(','));
  return !(requests.length > max);
}

async function createSha256Hash(str) {
  return btoa(
    new Uint8Array(
      await crypto.subtle.digest(
        {
          name: 'SHA-256',
        },
        new TextEncoder().encode(str)
      )
    ).toString()
  );
}

function verificationEmailConfig(body, link) {
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

export async function onRequest(context) {
    const {
        request,
        env
    } = context;
    
    const token = new URL(request.url).searchParams?.get('token');
    if (!token) return Error({ error: "missing_token", message: "No confirmation token was provided" });
    if (!await jwt.verify(token, env.WAITLIST_JWT_SECRET ?? 'very-secret-local-testing-secret')) return Error({ error: "invalid_token", message: "An invalid confirmation token was provided" });
    const { payload } = jwt.decode(token);
    await env.WAITLIST.put(payload.email, payload.name);
    return Redirect({ location: `${payload.origin ?? "https://kards.social"}/joined-waitlist` });
}

export async function onRequestPost(context) {
    const {
      request,
      env
    } = context;

    const body = await request.json();
    if (!body) return Error({ error: "incorrect_body", message: "An incorrect body was provided" });
    if (!body.name || !body.email) return Error({ error: "missing_data", message: "One or more body properties are missing" });
    if (!/^[A-ZÀ-ÖØ-öø-ÿ]+ [A-ZÀ-ÖØ-öø-ÿ][A-ZÀ-ÖØ-öø-ÿ ]*$/i.test(body.name)) return Error({ error: "incorrect_name", message: "Please enter both your first and last name" });
    if (!/^[A-ZÀ-ÖØ-öø-ÿ0-9._%+-]+@[A-ZÀ-ÖØ-öø-ÿ0-9.-]+\.[A-Z]{2,}$/i.test(body.email)) return Error({ error: "incorrect_email", message: "Please enter a valid email" });
    if (!env.SENDGRID_API_KEY) return Error({ error: "incorrect_server_configuration", message: "The server is configured incorrectly", status: 500 });
    if (!await allowedByRateLimit(env.WAITLIST_RL, `mail:${body.email}`)) return Error({ error: "too_many_requests", message: "This request has been performed too often, please try again later.", status: 429 });
    if (!await allowedByRateLimit(env.WAITLIST_RL, `ip:${request.headers['cf-connecting-ip'] || request.headers['x-real-ip']}`, 15, 24)) return Error({ error: "too_many_requests", message: "This request has been performed too often, please try again later.", status: 429 });

    const token = await jwt.sign({ name: body.name, email: body.email, origin: body.origin ?? 'https://kards.social' }, env.WAITLIST_JWT_SECRET ?? 'very-secret-local-testing-secret');
    await fetch('https://api.sendgrid.com/v3/mail/send', {
        body: verificationEmailConfig(body, `${(new URL(request.url)).origin}/api/join-waitlist?token=${token}`),
        headers: {
            'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
        },
        method: 'POST',
    });    

    return Success({ message: "Check your email!" });
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