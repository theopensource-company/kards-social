import Surreal from "@theopensource-company/surrealdb-cloudflare";
import { List, IdFromToken } from '../../../../shared/KardsUser';
import { Env } from '..';
import { Success, Error } from "../../../../shared/ApiResponse";
import { IdFromHeaders } from "../../../../shared/AdminUser";

export default (db: Surreal) => ({
    list: async function ListRoute(request: Request, env: Env): Promise<Response> {
        const id = await IdFromHeaders(request, env);
        if (id) {
            const user = await List(db) ?? false;
            if (user) {
                const responsea = Success({
                    result: user
                });

                responsea.headers.set('X-Total-Count', '1');
                return responsea;
            }
        }

        const response = Error({
            status: 401,
            error: "not_authenticated",
            message: "No valid authentication has been provided."
        });

        response.headers.set('X-Total-Count', '1');
        return response;
    }
});