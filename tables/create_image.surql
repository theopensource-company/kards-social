DEFINE TABLE create_image SCHEMAFULL
    PERMISSIONS
        FOR create WHERE $scope = 'user'
        FOR update, select, delete NONE
    DROP;

DEFINE FIELD owner ON TABLE create_image TYPE string VALUE $before OR $auth.id;
DEFINE FIELD type ON TABLE create_image TYPE string ASSERT $value != NONE AND ($value = 'profilepicture' OR $value = 'post');

# Always create the image :D    (1=1)
DEFINE EVENT email ON TABLE create_image WHEN 1=1 THEN (
    CREATE image CONTENT {
        owner: $after.owner,
        type: $after.type,
        from_create_record: $after.id,
        endpoint: function(http::post(string::replace(
            'https://api.cloudflare.com/client/v4/accounts/{{accountid}}/images/v2/direct_upload',
            '{{accountid}}',
            string::slice((select value from environment:cloudflare_account_id), 2, -2)
        ), NONE, {
            Authorization: 'Bearer ' + string::slice((select value from environment:cloudflare_images_api_token), 2, -2)
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
);
    

CREATE create_image SET type = 'profilepicture'