DEFINE TABLE post SCHEMAFULL
    PERMISSIONS
        FOR select WHERE published = true
        FOR create WHERE $scope = 'user'
        FOR update, delete WHERE ($scope = 'user' && author = $auth.id) OR $scope = 'admin';

DEFINE FIELD author ON TABLE post TYPE record(user) VALUE $auth.id;
DEFINE FIELD published ON TABLE post TYPE bool ASSERT $value != NONE VALUE $value OR $before OR true;
DEFINE FIELD description ON TABLE post TYPE string ASSERT string::len($value) <= 250;
DEFINE FIELD picture ON TABLE post ASSERT $value != NONE VALUE {
  LET $url = SELECT endpoint.accessURL as url FROM $value;
  RETURN $url[0].url;
};

DEFINE FIELD created ON TABLE post VALUE $before OR time::now();
DEFINE FIELD updated ON TABLE post VALUE time::now();