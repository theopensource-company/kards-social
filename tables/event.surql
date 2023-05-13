DEFINE TABLE event SCHEMALESS
    PERMISSIONS
        FOR select WHERE ($scope = 'user' && field = $auth.id) OR $scope = 'admin'
        FOR update, delete, create NONE;

DEFINE FIELD created ON event TYPE datetime VALUE $before OR time::now();
DEFINE FIELD from ON TABLE event;
DEFINE FIELD to ON TABLE event;
DEFINE FIELD details ON TABLE event FLEXIBLE TYPE object VALUE $value OR $before OR {};
DEFINE FIELD event ON TABLE event TYPE string ASSERT $value != NONE AND $value = /^[a-zA-Z](?:[-_.]?[a-zA-Z0-9])+$/;
DEFINE FIELD field ON TABLE event TYPE string ASSERT $value != NONE AND $value = /.+:.+/;