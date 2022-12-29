import { TKardsProfile } from '../constants/Types';
import { SurrealQuery } from './Surreal';

export const KardsProfileDetails = async (
    username: string
): Promise<TKardsProfile | null> => {
    const result = await SurrealQuery<TKardsProfile>(
        'SELECT * FROM profile WHERE username=$username',
        { username }
    );

    const preParse =
        result && result[0].result ? result[0].result[0] : null ?? null;
    if (preParse) {
        preParse.created = new Date(preParse.created);
    }

    return preParse;
};
