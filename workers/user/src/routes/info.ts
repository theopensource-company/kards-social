import Surreal from "@theopensource-company/surrealdb-cloudflare";
import { Info, IdFromToken } from '../../../../shared/KardsUser';
import { Env } from '..';
import { Success, Error } from "../../../../shared/ApiResponse";

export default (db: Surreal) => ({
    me: async function MeRoute(request: Request, env: Env): Promise<Response> {
        const id = await IdFromToken(request, env);
        if (id) {
            const user = await Info(db, id) ?? false;
            if (user) return Success({
                result: user
            });
        }

        return Error({
            status: 401,
            error: "not_authenticated",
            message: "No valid authentication has been provided."
        });
    }
});