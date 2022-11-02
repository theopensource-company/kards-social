// ORIGINAL: https://github.com/marmelab/react-admin/blob/master/packages/ra-data-json-server/src/index.ts

import { stringify } from "query-string";
import { fetchUtils, DataProvider, Options, UpdateResult, RaRecord, UpdateManyResult } from "ra-core";
import { SurrealQueryAdmin } from "./Surreal";

const httpClient = async (url: string, options: Options = {}) => {
  let token = localStorage.getItem("kadmxs");
  if (!token || token.length < 1) {
    //Token might be empty just after signin in, so needs a little timeout to be sure that the token is populated.
    await new Promise<void>((r) =>
      setTimeout(() => {
        token = localStorage.getItem("kadmxs");
        r();
      }, 500)
    );
  }

  options.headers = new Headers({
    ...options.headers,
    Authorization: `Bearer ${localStorage.getItem("kadmxs") || ""}`,
  });

  const response = await fetchUtils.fetchJson(url, options);
  if (response.json.success) response.json = response.json.result;
  return response;
};

export function SelectFilterBuilder(
  filters: any
) {
  let result = `ORDER BY ${filters._sort} ${filters._order ?? 'DESC'}`;
  if (filters.end) result += ` LIMIT BY ${filters.end}`;
  if (filters.start) result += ` START AT ${filters.start}`;
  return result;
}

export function ParseUpdatedData<TData extends RaRecord = any>(data: TData) {
  return Object.keys(data).map(key => {
    const val = data[key];
    switch(key) {
      case 'id':
      case 'created':
      case 'updated':
        return null;
      case 'password':
        return val ? `password=crypto::argon2::generate("${val}")` : null;
      default:
        return `${key}=${JSON.stringify(val)}`;
    }
  }).filter(a => !!a);
}

export const Fetcher = (): DataProvider => ({
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const start = (page - 1) * perPage;
    const limit = (page * perPage) - start;
    const query = 
      `SELECT *, count((select id from ${resource})) as total FROM ${resource} ORDER BY ${field} ${order} LIMIT BY ${limit} START AT ${start}`;

    return SurrealQueryAdmin(query).then(result => {
      if (result[0]?.result) {
        let total = 0;
        const data = result && result[0].result && result[0].result.map((user: any) => {
          total = user.total;
          delete user.total;
          return user;
        });       

        return {
          data,
          total
        };
      } else {
        throw new Error("An issue occured while fetching data");
      }
    });
  },

  getOne: (resource, params) => {
    const query = 
      `SELECT * FROM ${resource} WHERE id="${params.id}"`;
    return SurrealQueryAdmin(query).then(result => {
      if (result[0]?.result) {
        return {
          data: result[0]?.result[0] as any ?? {}
        };
      } else {
        throw new Error("An issue occured while fetching data");
      }
    });
  },

  getMany: (resource, params) => {
    const url = `${location.origin}/api/${resource}/info/${params.ids.join(
      ";"
    )}`;
    return httpClient(url).then(({ json }) => ({ data: json }));
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      ...fetchUtils.flattenObject(params.filter),
      [params.target]: params.id,
      _sort: field,
      _order: order,
      _start: (page - 1) * perPage,
      _end: page * perPage,
    };
    const url = `${location.origin}/api/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ headers, json }) => {
      if (!headers.has("x-total-count")) {
        throw new Error(
          "The X-Total-Count header is missing in the HTTP Response. The jsonServer Data Provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?"
        );
      }
      return {
        data: json,
        total: parseInt(
          (headers.get("x-total-count") || "").split("/").pop() || "1",
          10
        ),
      };
    });
  },

  update: (_resource, params) => {
    const query =
      `UPDATE ${params.data.id} SET ${ParseUpdatedData(params.data as RaRecord).join(', ')}`;

    return SurrealQueryAdmin(query).then(result => {
      if (result[0]?.result) {
        return Promise.resolve({
          data: result[0]?.result[0]
        } as UpdateResult);
      } else {
        console.error(result);
        throw new Error("An issue occured while updating data");
      }
    });
  },

  // json-server doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
  updateMany: (resource, params) => {
    const query =
      `UPDATE ${resource} SET ${ParseUpdatedData(params.data as RaRecord).join(', ')} WHERE ${JSON.stringify(params.ids)} CONTAINS id`;

    return SurrealQueryAdmin<{
      id?: string;
    }>(query).then(result => {
      if (result[0]?.result) {
        return Promise.resolve({
          data: result[0]?.result.map(rec => rec.id).filter(a => !!a)
        } as UpdateManyResult);
      } else {
        console.error(result);
        throw new Error("An issue occured while updating data");
      }
    });
  },

  create: (resource, params) =>
    httpClient(`${location.origin}/api/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json.id },
    })),

  delete: (resource, params) =>
    httpClient(`${location.origin}/api/${resource}/${params.id}`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json })),

  // json-server doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
  deleteMany: (resource, params) =>
    Promise.all(
      params.ids.map((id) =>
        httpClient(`${location.origin}/api/${resource}/${id}`, {
          method: "DELETE",
        })
      )
    ).then((responses) => ({ data: responses.map(({ json }) => json.id) })),
});

export default Fetcher;
