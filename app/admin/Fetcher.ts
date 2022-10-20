// ORIGINAL: https://github.com/marmelab/react-admin/blob/master/packages/ra-data-json-server/src/index.ts

import { stringify } from "query-string";
import { fetchUtils, DataProvider, Options } from "ra-core";

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

export const Fetcher = (): DataProvider => ({
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      ...fetchUtils.flattenObject(params.filter),
      _sort: field,
      _order: order,
      _start: (page - 1) * perPage,
      _end: page * perPage,
    };
    const url = `${location.origin}/api/${resource}/list?${stringify(query)}`;

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

  getOne: (resource, params) =>
    httpClient(`${location.origin}/api/${resource}/info/${params.id}`).then(
      ({ json }) => ({
        data: json,
      })
    ),

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

  update: (resource, params) =>
    httpClient(`${location.origin}/api/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json })),

  // json-server doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
  updateMany: (resource, params) =>
    Promise.all(
      params.ids.map((id) =>
        httpClient(`${location.origin}/api/${resource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(params.data),
        })
      )
    ).then((responses) => ({ data: responses.map(({ json }) => json.id) })),

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
