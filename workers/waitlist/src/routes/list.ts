import Surreal from '@theopensource-company/surrealdb-cloudflare';
import { Env } from '..';
import { Success, Error } from '../../../../shared/ApiResponse';
import { IdFromHeaders } from '../../../../shared/AdminUser';
import { FiltersObjectFromURL, SelectFilterBuilder } from '../../../../shared/SurrealHelpers';
import { TFilterWaitlist, TWaitlistEntry } from '../../../../shared/Types';

export default (db: Surreal) => ({
    list: async function ListRoute(
        request: Request,
        env: Env
    ): Promise<Response> {
        const id = await IdFromHeaders(request, env);
        if (id) {
            let filters: TFilterWaitlist;
            try {
                filters = FiltersObjectFromURL<TFilterWaitlist>(request.url);
            } catch(e) {
                return Error({
                    status: 400,
                    error: "invalid_filters",
                    message: e.message
                });
            }

            if (!filters.field) filters.field = 'created';
            const query = `SELECT *, count((select id from waitlist)) as total FROM waitlist ${SelectFilterBuilder(
                filters
            )}`;

            const result = (
                await db.query<
                    Array<TWaitlistEntry & {
                        total: number;
                    }>
                >(query)
            ).slice(-1)[0];

            let total = 0;
            const final = result.status == 'ERR' ? [] : result.result.map((entry) => {
                total = entry.total;
                delete entry.total;
                return entry;
            });

            const response = Success({
                result: final,
            });

            response.headers.set('X-Total-Count', `${total}`);
            return response;
        }

        return Error({
            status: 401,
            error: 'not_authenticated',
            message: 'No valid authentication has been provided.',
        });
    },
});
