DEFINE TABLE image SCHEMAFULL
    PERMISSIONS
        FOR create NONE,
        FOR select, update, delete WHERE $scope = 'admin' OR ($scope = 'user' AND owner = $auth.id);

DEFINE FIELD owner ON TABLE image TYPE string    ASSERT $value = /^user:.*/ VALUE $before OR $value;
DEFINE FIELD from_create_record   ON TABLE image TYPE string ASSERT $value = /^create_image:.*/ VALUE $before OR $value;
DEFINE FIELD endpoint.success     ON TABLE image TYPE bool   ASSERT $value != NONE;
DEFINE FIELD endpoint.id          ON TABLE image TYPE string ASSERT $value != NONE;
DEFINE FIELD endpoint.uploadURL   ON TABLE image TYPE string ASSERT $value != NONE;
DEFINE FIELD endpoint             ON TABLE image TYPE object VALUE  $before OR $value;