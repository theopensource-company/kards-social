import { TKardsUser } from '../constants/Types/KardsUser.types';
import { TPostRecord } from '../constants/Types/Post.types';

export function processKardsUserRecord(user: TKardsUser) {
    return {
        ...user,
        created: new Date(user.created),
        updated: new Date(user.updated),
    };
}

export function processPostRecord(post: TPostRecord) {
    return {
        ...post,
        created: new Date(post.created),
        updated: new Date(post.updated),
    };
}
