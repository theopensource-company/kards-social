DEFINE TABLE waitlist SCHEMAFULL
  PERMISSIONS
    FOR select, update, delete, create WHERE $scope = 'admin';

DEFINE FIELD created ON waitlist TYPE datetime VALUE $before OR time::now();
DEFINE FIELD email ON waitlist TYPE string ASSERT is::email($value);
DEFINE FIELD name ON waitlist TYPE string;
DEFINE FIELD updated ON waitlist TYPE datetime VALUE time::now();

DEFINE INDEX email ON TABLE waitlist COLUMNS email UNIQUE;

DEFINE EVENT name ON TABLE waitlist WHEN $before.name != $after.name AND $before.name != NONE AND $after.name != NONE THEN ( 
  CREATE event SET from=$before.name, to=$after.name, event="waitlist_name_changed", field=$after.id
);