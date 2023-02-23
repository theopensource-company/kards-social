import { TRecordID } from './Common.types';
import { TKardsUserID } from './KardsUser.types';

export type TPostRecordID = TRecordID<'post'>;
export type TPostRecord = {
    id: TPostRecordID;
    author: TKardsUserID;
    description?: string;
    published: boolean;
    picture: string;
    created: Date;
    updated: Date;
};
