import { TKardsUser } from '../constants/Types/KardsUser.types';

export function processKardsUserRecord(user: TKardsUser) {
    return {
        ...user,
        created: new Date(user.created),
        updated: new Date(user.updated),
    };
}
