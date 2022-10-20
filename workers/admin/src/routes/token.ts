import Surreal from "@theopensource-company/surrealdb-cloudflare";
import { IdFromToken, CreateAccessToken } from '../../../../shared/AdminUser';
import { Env } from '..';
import { Success, Error } from "../../../../shared/ApiResponse";

export default (db: Surreal) => ({
    token: async function MeRoute(request: Request, env: Env): Promise<Response> {
        const id = await IdFromToken(request, env);
        if (id) {
            const token = await CreateAccessToken(db, id, env) ?? false;
            if (token) return Success({
                result: {
                    token
                }
            });
        }

        return Error({
            status: 401,
            error: "not_authenticated",
            message: "No valid authentication has been provided."
        });
    }
});