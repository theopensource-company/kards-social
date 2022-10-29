import { TKardsUserDetails } from "../constants/Types";
import { SurrealQuery } from "./Surreal";

export const UserDetails = async (): Promise<TKardsUserDetails | null> => {
    const result = await SurrealQuery<TKardsUserDetails>("SELECT * FROM user");
    const preParse = result && result[0].result ? result![0].result[0] : null ?? null;
    if (preParse) {
        preParse.created = new Date(preParse.created);
        preParse.updated = new Date(preParse.updated);
    }

    return preParse;
}