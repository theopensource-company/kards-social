import Surreal from "@theopensource-company/surrealdb-cloudflare";
import { Env } from '..';
import { Success, Error } from "../../../../shared/ApiResponse";
import { IdFromHeaders } from "../../../../shared/AdminUser";

export default (db: Surreal) => ({
    list: async function ListRoute(request: Request, env: Env): Promise<Response> {
        const id = await IdFromHeaders(request, env);
        if (id) {
            const query = `SELECT * FROM waitlist`;    
            const result = (await db.query<Array<{
                id: string;
                name: string;
                email: string;
            }>>(query)).slice(-1)[0];

            const final = result.status == "ERR" ? [] : result.result;
            const response = Success({
                result: final
            });

            response.headers.set('X-Total-Count', final.length.toString());
            return response;
        }

        return Error({
            status: 401,
            error: "not_authenticated",
            message: "No valid authentication has been provided."
        });
    }
});