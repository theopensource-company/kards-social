import { useMutation, useQuery } from '@tanstack/react-query';
import { UnexpectedResponse } from '../../constants/Errors';
import { TImageID } from '../../constants/Types/Image.types';
import { TPostRecord } from '../../constants/Types/Post.types';
import { processPostRecord } from '../../lib/ProcessDatabaseRecord';
import { SurrealInstance } from '../../lib/Surreal';

export const useCreatePost = () =>
    useMutation({
        mutationKey: ['post', 'mutate', 'create'],
        mutationFn: async (post: {
            description?: string;
            picture: TImageID;
        }): Promise<TPostRecord> => {
            const result = await SurrealInstance.opiniatedQuery<TPostRecord>(
                `CREATE post CONTENT {
                    description: $description,
                    picture: $picture
                }`,
                post
            );

            if (!result?.[0]?.result?.[0])
                throw new UnexpectedResponse('Failed to create post');

            return processPostRecord(result[0].result[0]);
        },
    });

export const usePosts = () =>
    useQuery({
        queryKey: ['post', 'query', 'list'],
        queryFn: async (): Promise<TPostRecord[]> => {
            const result = await SurrealInstance.opiniatedQuery<TPostRecord>(
                `SELECT * FROM post WHERE published = true`
            );

            if (!result?.[0]?.result)
                throw new UnexpectedResponse('Failed to create post');

            return result[0].result.map(processPostRecord);
        },
    });
