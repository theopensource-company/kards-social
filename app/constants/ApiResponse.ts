// Only use within the functions!

type ErrorProps = {
    status?: number;
    error: string;
    message: string;
}

type SuccessProps = {
    status?: number;
    result?: object;
    message?: string;
}

type RedirectProps = {
    location: string;
    permanent?: boolean;
}

export function Error({
    status = 400,
    error,
    message
}: ErrorProps) {
    return new Response(JSON.stringify({
        success: false,
        error,
        message
    }), {
        status,
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    })
}

export function Success({
    status = 200,
    result,
    message
}: SuccessProps) {
    return new Response(JSON.stringify({
        success: true,
        message,
        result
    }), {
        status,
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    })
}

export function Redirect({
    permanent = false,
    location
}: RedirectProps) {
    return new Response(`<a href="${location}">Navigate to the next page</a>`, {
        status: permanent ? 301 : 302,
        headers: {
            'Location': location
        }
    });
}