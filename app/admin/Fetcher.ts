// ORIGINAL: https://github.com/marmelab/react-admin/blob/master/packages/ra-data-json-server/src/index.ts

import { stringify } from "query-string";
import { fetchUtils, DataProvider, Options, UpdateResult, RaRecord, UpdateManyResult, CreateResult, DeleteResult, DeleteManyParams, DeleteManyResult } from "ra-core";
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
    const query = 
      `SELECT * FROM ${resource} WHERE ${JSON.stringify(params.ids)} CONTAINS id`;
    return SurrealQueryAdmin(query).then(result => {
      if (result[0]?.result) {
        return {
          data: result[0]?.result as any ?? {}
        };
      } else {
        throw new Error("An issue occured while fetching data");
      }
    });
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const start = (page - 1) * perPage;
    const limit = (page * perPage) - start;
    const query = 
      `SELECT *, count((select id from ${resource} WHERE ${params.target} = ${JSON.stringify(params.id)})) as total FROM ${resource} WHERE ${params.target} = ${JSON.stringify(params.id)} ORDER BY ${field} ${order} LIMIT BY ${limit} START AT ${start}`;

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

  create: (resource, params) => {
    const query =
      `CREATE ${resource} SET ${ParseUpdatedData(params.data as RaRecord).join(', ')}`;

    return SurrealQueryAdmin(query).then(result => {
      if (result[0]?.result) {
        return Promise.resolve({
          data: result[0]?.result[0]
        } as CreateResult);
      } else {
        console.error(result);
        throw new Error("An issue occured while updating data");
      }
    });
  },

  delete: (_resource, params) => {
    const query =
      `DELETE ${params.id}`;

    return SurrealQueryAdmin(query).then(result => {
      if (result[0]?.result) {
        return Promise.resolve({
          data: result[0]?.result[0]
        } as DeleteResult);
      } else {
        console.error(result);
        throw new Error("An issue occured while updating data");
      }
    });
  },

  // json-server doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
  deleteMany: (resource, params) => {
    const query =
      `DELETE ${resource} WHERE ${JSON.stringify(params.ids)} CONTAINS id`;

    return SurrealQueryAdmin<{
      id?: string;
    }>(query).then(result => {
      if (result[0]?.result) {
        return Promise.resolve({
          data: result[0]?.result.map(rec => rec.id).filter(a => !!a)
        } as DeleteManyResult);
      } else {
        console.error(result);
        throw new Error("An issue occured while updating data");
      }
    });
  },
});

export default Fetcher;
