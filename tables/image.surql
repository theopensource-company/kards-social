DEFINE TABLE image SCHEMAFULL
    PERMISSIONS
        FOR create WHERE $scope = 'user'
        FOR select WHERE $scope = 'admin' 
                      OR ($scope = 'user' AND owner = $auth.id) 
                      OR (id = $imageid AND array::len((SELECT id from post WHERE published = true AND image = $imageid)) > 0)
        FOR update, delete WHERE $scope = 'admin' OR ($scope = 'user' AND owner = $auth.id);

DEFINE FIELD owner ON TABLE image TYPE string VALUE $before OR $auth.id;
DEFINE FIELD type ON TABLE image TYPE string ASSERT $value != NONE AND ($value = 'profilepicture' OR $value = 'post');
DEFINE FIELD endpoint.result            ON TABLE image TYPE object ASSERT $value != NONE;
DEFINE FIELD endpoint.result.id         ON TABLE image TYPE string ASSERT $value != NONE;
DEFINE FIELD endpoint.result.uploadURL  ON TABLE image TYPE string ASSERT $value != NONE;
DEFINE FIELD endpoint                   ON TABLE image TYPE object VALUE $before OR http::post(string::replace(
    'https://api.cloudflare.com/client/v4/accounts/{{accountid}}/images/v2/direct_upload',
    '{{accountid}}',
    string::slice((select value from environment:cloudflare_account_id), 2, -2)
), NONE, {
    Authorization: 'Bearer ' + string::slice((select value from environment:cloudflare_images_api_token), 2, -2)
});