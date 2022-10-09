import { CreateSHA256Hash } from "./Hasher";

export async function allowedByRateLimit(rl, key, max = 5, period = 1) {
    key = `${key.split(':')[0]}:${key.split(':')[1]}:${await CreateSHA256Hash(key.split(':')[2])}`;
    const requests = ((await rl.get(key)) ?? '')
        .split(',')
        .map((r) => parseInt(r))
        .filter((r) => r + 3600000 * period > new Date().getTime())
        .slice(~max + 1);
    requests.push(new Date().getTime());
    await rl.put(key, requests.join(','));
    return !(requests.length > max);
}