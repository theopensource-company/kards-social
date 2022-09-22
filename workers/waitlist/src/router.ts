import Surreal from '@theopensource-company/surrealdb-cloudflare';
import { Router as IttyRouter } from 'itty-router';
import { Success, Error, Redirect } from '../../../app/constants/ApiResponse';
import jwt from '@tsndr/cloudflare-worker-jwt'

import { Env } from '.';
import { allowedByRateLimit } from './ratelimit';
import { verificationEmailConfig } from './verificationEmail';

export default function Router(db: Surreal) {
    const router = IttyRouter({ base: '/waitlist' });

    router.get('/join', async (request: Request, env: Env) => {        
        const token = new URL(request.url).searchParams?.get('token');
        if (!token) return Error({ error: "missing_token", message: "No confirmation token was provided" });
        if (!await jwt.verify(token, env.WAITLIST_JWT_SECRET ?? 'very-secret-local-testing-secret')) return Error({ error: "invalid_token", message: "An invalid confirmation token was provided" });
        
        const { payload: {
            email,
            name,
            origin
        } } = jwt.decode(token);

        await db.query(`
            LET $email = "${email}"; LET $name = "${name}";
            IF (SELECT $email FROM waitlist WHERE email=$email) CONTAINS $email THEN
                (UPDATE waitlist MERGE name=$name WHERE email=$email)
            ELSE
                (CREATE waitlist SET name=$name, email=$email)
            END
        `);
        
        return Redirect({ location: `${origin ?? "https://kards.social"}/joined-waitlist` });
    });

    router.post('/join', async (request: Request, env: Env) => {
        const body: {
            name: string;
            email: string;
            origin?: string;
        } = await request.json();
        if (!body) return Error({ error: "incorrect_body", message: "An incorrect body was provided" });
        if (!body.name || !body.email) return Error({ error: "missing_data", message: "One or more body properties are missing" });
        if (!/^[A-ZÀ-ÖØ-öø-ÿ]+ [A-ZÀ-ÖØ-öø-ÿ][A-ZÀ-ÖØ-öø-ÿ ]*$/i.test(body.name)) return Error({ error: "incorrect_name", message: "Please enter both your first and last name" });
        if (!/^[A-ZÀ-ÖØ-öø-ÿ0-9._%+-]+@[A-ZÀ-ÖØ-öø-ÿ0-9.-]+\.[A-Z]{2,}$/i.test(body.email)) return Error({ error: "incorrect_email", message: "Please enter a valid email" });
        if (!env.SENDGRID_API_KEY) return Error({ error: "incorrect_server_configuration", message: "The server is configured incorrectly", status: 500 });
        if (!await allowedByRateLimit(env.RATELIMIT, `waitlist:mail:${body.email}`)) return Error({ error: "too_many_requests", message: "This request has been performed too often, please try again later.", status: 429 });
        if (!await allowedByRateLimit(env.RATELIMIT, `waitlist:ip:${request.headers.get('cf-connecting-ip') || request.headers.get('x-real-ip')}`, 15, 24)) return Error({ error: "too_many_requests", message: "This request has been performed too often, please try again later.", status: 429 });
    
        const token = await jwt.sign({ name: body.name, email: body.email, origin: body.origin ?? 'https://kards.social' }, env.WAITLIST_JWT_SECRET ?? 'very-secret-local-testing-secret');
        await fetch('https://api.sendgrid.com/v3/mail/send', {
              body: verificationEmailConfig(body, `${env.KARDS_API ?? (new URL(request.url)).origin}/waitlist/join?token=${token}`),
              headers: {
                  'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
                  'Content-Type': 'application/json',
              },
              method: 'POST',
        });    
      
        return Success({ message: "Check your email!" });
    });

    return router;
}
