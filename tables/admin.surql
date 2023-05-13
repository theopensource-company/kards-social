DEFINE TABLE admin SCHEMAFULL
  PERMISSIONS
    FOR select, update, delete, create WHERE $scope = 'admin';

DEFINE FIELD name ON TABLE admin TYPE string ASSERT array::len(string::words($value)) > 1;
DEFINE FIELD email ON TABLE admin TYPE string ASSERT is::email($value);
DEFINE FIELD password ON TABLE admin TYPE string PERMISSIONS FOR select NONE;

DEFINE FIELD created ON TABLE admin TYPE datetime VALUE $before OR time::now();
DEFINE FIELD updated ON TABLE admin TYPE datetime VALUE time::now();

DEFINE INDEX email ON TABLE admin COLUMNS email UNIQUE;

DEFINE EVENT name ON TABLE admin WHEN $before.name != $after.name AND $before.name != NONE AND $after.name != NONE THEN ( 
  CREATE event SET from=$before.name, to=$after.name, event="admin_name_changed", field=$after.id
);

DEFINE EVENT email ON TABLE admin WHEN $before.email != $after.email AND $before.email != NONE AND $after.email != NONE THEN ( 
  CREATE event SET from=$before.email, to=$after.email, event="admin_email_changed", field=$after.id
);

DEFINE EVENT password ON TABLE admin WHEN $before.password != $after.password AND $before.password != NONE AND $after.id != NONE THEN ( 
  CREATE event SET event="admin_password_changed", field=$after.id
);