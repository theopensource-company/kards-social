import { TKardsUserDetails } from "../constants/Types";
import { SurrealQuery } from "./Surreal";

export const UserDetails = async () => {
    const result = await SurrealQuery<TKardsUserDetails>("SELECT * FROM $auth");
    return result && result[0].result ? result![0].result[0] : null ?? null;
}