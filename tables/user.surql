DEFINE TABLE user SCHEMAFULL 
  PERMISSIONS 
    FOR select, update WHERE ($scope = 'user' && id = $auth.id) 
      OR $scope = 'admin' 
      OR ($scope = 'verify_reset_password' && id = $auth.id)
    FOR delete WHERE ($scope = 'user' && id = $auth.id) OR $scope = 'admin' 
    FOR create WHERE $scope = 'admin';

DEFINE FIELD name ON TABLE user TYPE string ASSERT $value != NONE AND array::len(string::words($value)) > 1;
DEFINE FIELD email ON TABLE user TYPE string ASSERT is::email($value);
DEFINE FIELD username ON TABLE user TYPE string ASSERT $value != NONE AND $value = /^[a-z0-9](?:[a-z0-9._-]{1,18}[a-z0-9.])$/;
DEFINE FIELD password ON TABLE user TYPE string ASSERT $value != NONE
  PERMISSIONS 
    FOR select NONE 
    FOR update WHERE $scope = 'admin' 
      OR ($scope = 'verify_reset_password' && id = $auth.id)
      OR string::len(<string> (select * from user where id = $auth.id and crypto::argon2::compare(password, $oldpassword))) > 2
;

// A user can set the ID of an image record as the value for "picture", and the VALUE query block will either convert this to a nullish value or to a picture base url
// This process happens when authenticated as a scope user, which results in a user only being able to select their own pictures.
// Two flies in one hit :D
DEFINE FIELD picture ON TABLE user VALUE {
  LET $url = SELECT endpoint.accessURL as url FROM $value;
  RETURN $url[0].url;
};

REMOVE FIELD picture_base_url ON TABLE user;

DEFINE FIELD created ON TABLE user TYPE datetime VALUE $before OR time::now();
DEFINE FIELD updated ON TABLE user TYPE datetime VALUE time::now();

REMOVE INDEX email ON TABLE user;
REMOVE INDEX username ON TABLE user;
DEFINE INDEX email ON TABLE user COLUMNS email UNIQUE;
DEFINE INDEX username ON TABLE user COLUMNS username UNIQUE;

DEFINE EVENT name ON TABLE user WHEN $before.name != $after.name AND $before.name != NONE AND $after.name != NONE THEN ( 
  CREATE event SET from=$before.name, to=$after.name, event="user_name_changed", field=$after.id
);

DEFINE EVENT email ON TABLE user WHEN $before.email != $after.email AND $before.email != NONE AND $after.email != NONE THEN ( 
  CREATE event SET from=$before.email, to=$after.email, event="user_email_changed", field=$after.id
);

DEFINE EVENT username ON TABLE user WHEN $before.username != $after.username AND $before.username != NONE AND $after.username != NONE THEN ( 
  CREATE event SET from=$before.username, to=$after.username, event="user_username_changed", field=$after.id
);

DEFINE EVENT password ON TABLE user WHEN $before.password != $after.password AND $before.password != NONE AND $after.id != NONE THEN ( 
  CREATE event SET event="user_password_changed", field=$after.id
);