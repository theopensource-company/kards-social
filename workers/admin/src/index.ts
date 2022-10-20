import Surreal from '@theopensource-company/surrealdb-cloudflare';
import CreateAuthRoutes from './routes/auth';
import CreateInfoRoutes from './routes/info';
import CreateListRoutes from './routes/list';
import CreateTokenRoutes from './routes/token';
import { Router } from 'itty-router';

const db = new Surreal();
const AuthRoutes = CreateAuthRoutes(db);
const InfoRoutes = CreateInfoRoutes(db);
const ListRoutes = CreateListRoutes(db);
const TokenRoutes = CreateTokenRoutes(db);

const router = Router({ base: '/api/admin' });
router.post('/signin', AuthRoutes.signin);
router.get('/signout', AuthRoutes.signout);
router.get('/list', ListRoutes.list);
router.get('/me', InfoRoutes.me);
router.get('/token', TokenRoutes.token);

export type Env = {
	HOST: string;
    USER: string;
    PASS: string;
    NAMESPACE: string;
    DATABASE: string;

    SENDGRID_API_KEY: string;
    KARDS_ORIGIN?: string;
    
    RATELIMIT: KVNamespace;
    ADMIN_JWT_SECRET: string;
    ADMIN_ACCESS_JWT_SECRET: string;
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
