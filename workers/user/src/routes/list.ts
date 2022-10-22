import Surreal from '@theopensource-company/surrealdb-cloudflare';
import { List, IdFromToken } from '../../../../shared/KardsUser';
import { Env } from '..';
import { Success, Error } from '../../../../shared/ApiResponse';
import { IdFromHeaders } from '../../../../shared/AdminUser';
import { FiltersObjectFromURL } from '../../../../shared/SurrealHelpers';
import { TFilterKardsUser } from '../../../../shared/Types';

export default (db: Surreal) => ({
    list: async function ListRoute(
        request: Request,
        env: Env
    ): Promise<Response> {
        let filters: TFilterKardsUser;
        try {
            filters = FiltersObjectFromURL<TFilterKardsUser>(request.url);
        } catch(e) {
            return Error({
                status: 400,
                error: "invalid_filters",
                message: e.message
            });
        }
        
        const id = await IdFromHeaders(request, env);
        if (id) {
            const result = (await List(db, filters)) ?? false;
            if (result) {
                const responsea = Success({
                    result: result[0],
                });

                responsea.headers.set('X-Total-Count', `${result[1]}`);
                return responsea;
            }
        }

        const response = Error({
            status: 401,
            error: 'not_authenticated',
            message: 'No valid authentication has been provided.',
        });

        response.headers.set('X-Total-Count', '1');
        return response;
    },
});
