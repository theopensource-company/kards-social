DEFINE TABLE create_image SCHEMAFULL
    PERMISSIONS
        FOR create WHERE $scope = 'user'
        FOR update, select, delete NONE
    DROP;

DEFINE FIELD owner ON TABLE create_image TYPE string VALUE $before OR $auth.id;

# Always create the image :D    (1=1)
DEFINE EVENT request_image_record ON TABLE create_image WHEN 1=1 THEN {
    LET $accounthash = SELECT value FROM environment:cloudflare_account_hash;
    LET $accountid = SELECT value FROM environment:cloudflare_account_id;
    LET $apitoken = SELECT value FROM environment:cloudflare_images_api_token;
    LET $link = 'https://api.cloudflare.com/client/v4/accounts/' + $accountid.value + '/images/v2/direct_upload';
    LET $result = http::post($link, NONE, {
        Authorization: 'Bearer ' + $apitoken.value
    });

    IF ($result.success) THEN 
        {
            LET $accessURL = "https://imagedelivery.net/" + $accounthash.value + "/" + <string> $result.result.id;
            CREATE image CONTENT {
                owner: $after.owner,
                from_create_record: $after.id,
                endpoint: {
                    id: $result.result.id,
                    accessURL: $accessURL,
                    uploadURL: $result.result.uploadURL
                }
            };
        } 
    END;
};

// Remove old event
REMOVE EVENT email ON TABLE create_image;