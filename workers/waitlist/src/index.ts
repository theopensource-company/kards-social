import Surreal from '@theopensource-company/surrealdb-cloudflare';
import Router from './router';

const db = new Surreal();
const router = Router(db);

export type Env = {
	HOST: string;
    USER: string;
    PASS: string;
    NAMESPACE: string;
    DATABASE: string;

    SENDGRID_API_KEY: string;
    KARDS_API?: string;
    
    WAITLIST_RL: KVNamespace;
    WAITLIST_JWT_SECRET?: string;
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
