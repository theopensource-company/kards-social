import Surreal from '@theopensource-company/surrealdb-cloudflare';
import CreateSigninRoutes from './routes/signin';
import CreateInfoRoutes from './routes/info';
import { Router } from 'itty-router';

const db = new Surreal();
const SigninRoutes = CreateSigninRoutes(db);
const InfoRoutes = CreateInfoRoutes(db);

const router = Router({ base: '/api/user' });
router.post('/signin', SigninRoutes.signin);
router.get('/me', InfoRoutes.me);

export type Env = {
	HOST: string;
    USER: string;
    PASS: string;
    NAMESPACE: string;
    DATABASE: string;

    SENDGRID_API_KEY: string;
    KARDS_ORIGIN?: string;
    
    RATELIMIT: KVNamespace;
    USER_JWT_SECRET: string;
}

export default {
	async fetch(
		request: Request,
		env: Env
	): Promise<any> {
		if (!db.connected()) db.connect({
            host: env.HOST ?? '',
            username: env.USER ?? '',
            password: env.PASS ?? '',
            namespace: env.NAMESPACE ?? '',
            database: env.DATABASE ?? ''
        });
        
		return await router.handle(request, env) ?? new Response(null, {status: 404});
	},
};
