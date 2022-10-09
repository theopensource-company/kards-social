import Surreal from "@theopensource-company/surrealdb-cloudflare";
import jwt from '@tsndr/cloudflare-worker-jwt'
import { VerifyCredentials } from '../../../../shared/KardsUser';

import { Env } from '..';
import { Success, Error } from "../../../../shared/ApiResponse";
import { SetCookie } from "../../../../shared/Cookie";

export default (db: Surreal) => ({
    signin: async function SigninRoute(request: Request, env: Env): Promise<Response> {
        const body: {
            identifier?: string;
            password?: string;
        } = await request.json();

        if (!body.identifier || !body.password) return Error({
            status: 400,
            error: 'malformed_request',
            message: `Some properties are missing from the request body, please also provide the following: ${['identifier', 'password'].filter(a => !!body[a]).join(', ')}.`
        });

        const id = await VerifyCredentials(db, {
            identifier: body.identifier,
            password: body.password
        });

        if (typeof id == 'string') {
            const token = await jwt.sign({ id }, env.USER_JWT_SECRET ?? 'very-secret-local-testing-secret');
            const response = Success({});

            SetCookie({
                request,
                env,
                response,
                name: 'kusrsess',
                value: btoa(token),
                Expires: new Date('Fri, 31 Dec 9999 23:59:59 GMT')
            });

            return response;
        } else {
            return id;
        }
    }
})