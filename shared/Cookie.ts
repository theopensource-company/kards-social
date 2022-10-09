import RequestOrigin from "./RequestOrigin";
import { TSetCookie } from "./Types";

export function SetCookie(options: TSetCookie) {
    let cookieString = `${options.name}=${options.value};`;
    if (options.Expires) {
        cookieString += ` expires=${options.Expires.toUTCString()};`;
    } else if (options.MaxAge) {
        cookieString += ` max-age=${options.MaxAge};`;
    }

    cookieString += ` domain=${(options.Domain || RequestOrigin(options.request, options.env)).split('/').slice(-1)[0].split(':')[0]};`;
    cookieString += ` path=${options.Path || '/api/'};`;
    cookieString += ` secure=${(options.Secure ?? (new URL(options.request.url)).protocol == 'https:').toString()};`;
    cookieString += ` httpOnly=${(options.HttpOnly ?? true).toString()};`;
    cookieString += ` sameSite=${options.SameSite || 'Strict'};`;
    options.response.headers.set('Set-Cookie', cookieString);
}