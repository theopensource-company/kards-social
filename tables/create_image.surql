DEFINE TABLE create_image SCHEMAFULL
    PERMISSIONS
        FOR create WHERE $scope = 'user'
        FOR update, select, delete NONE
    DROP;

DEFINE FIELD owner ON TABLE create_image TYPE string VALUE $before OR $auth.id;

# Always create the image :D    (1=1)
DEFINE EVENT email ON TABLE create_image WHEN 1=1 THEN {
    LET $accountid = SELECT value FROM environment:cloudflare_account_id;
    LET $apitoken = SELECT value FROM environment:cloudflare_images_api_token;
    LET $link = 'https://api.cloudflare.com/client/v4/accounts/' + $accountid.value + '/images/v2/direct_upload';

    CREATE image CONTENT {
        owner: $after.owner,
        from_create_record: $after.id,
        endpoint: function(http::post($link, NONE, {
            Authorization: 'Bearer ' + $apitoken.value
        })) {
            const parsed = JSON.parse(arguments[0]);
            return parsed.success ? {
                success: true,
                id: parsed.result.id,
                uploadURL: parsed.result.uploadURL
            } : {
                success: false,
                id: "REQUEST_FAILED",
                uploadURL: "REQUEST_FAILED"
            };
        }
    }
};