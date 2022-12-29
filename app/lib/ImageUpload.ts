import { SurrealQuery } from './Surreal';

export const CREATE_IMAGE_REFETCH_INTERVAL = 200;
export const CREATE_IMAGE_REFETCH_LIMIT = 5;

export async function requestImageUploadURL() {
    const request = await SurrealQuery<{
        id: `create_image:${string}`;
        owner: `user:${string}`;
    }>(`CREATE create_image`);

    if (!request || !request[0]?.result || !request[0]?.result[0]?.id) {
        console.error(
            'Failed to initiate create image request, probably unauthenticated'
        );
        return false;
    }

    const createRecordID = request[0]?.result[0]?.id;
    const result = await fetchImageRecordByCreateRecordID(createRecordID);
    if (result)
        return {
            id: result.id,
            uploadURL: result.endpoint.uploadURL,
        };

    return new Promise<
        | {
              id: string;
              uploadURL: string;
          }
        | false
    >((resolve) => {
        let retries = 0;
        const refetchInterval = setInterval(async () => {
            retries++;
            const result = await fetchImageRecordByCreateRecordID(
                createRecordID
            );

            if (result) {
                clearInterval(refetchInterval);
                resolve({
                    id: result.id,
                    uploadURL: result.endpoint.uploadURL,
                });
            } else if (retries == CREATE_IMAGE_REFETCH_LIMIT) {
                console.error(
                    `Failed to fetch uploadURL after and ${retries} retries`
                );

                clearInterval(refetchInterval);
                resolve(false);
            }
        }, CREATE_IMAGE_REFETCH_INTERVAL);
    });
}

export async function fetchImageRecordByCreateRecordID(
    id: `create_image:${string}`
) {
    const result = await SurrealQuery<{
        id: `image:${string}`;
        owner: `user:${string}`;
        from_create_record: `create_image:${string}`;
        endpoint: {
            id: string;
            success: boolean;
            uploadURL: string;
        };
    }>(`SELECT * FROM image WHERE from_create_record=$create_record_id`, {
        create_record_id: id,
    });

    if (!result || !result[0]?.result || !result[0]?.result[0]) return false;

    return result[0]?.result[0];
}
