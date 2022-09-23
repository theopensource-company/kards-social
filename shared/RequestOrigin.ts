export function RequestOrigin(request: {
    url: string;
}, env: {
    KARDS_ORIGIN?: string;
}) {
    return env.KARDS_ORIGIN ?? (new URL(request.url)).origin;
}

export default RequestOrigin;