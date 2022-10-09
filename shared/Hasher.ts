export async function CreateSHA1Hash(str): Promise<string> {
    return Array.from(new Uint8Array(
        await crypto.subtle.digest(
            {
                name: 'SHA-1',
            },
            new TextEncoder().encode(str)
        )
    )).map(a => a.toString(16).padStart(2, '0')).join('');
}

export async function CreateSHA256Hash(str): Promise<string> {
    return Array.from(new Uint8Array(
        await crypto.subtle.digest(
            {
                name: 'SHA-256',
            },
            new TextEncoder().encode(str)
        )
    )).map(a => a.toString(16).padStart(2, '0')).join('');
}