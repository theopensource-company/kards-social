# Database tables

we have not found a proper solution for this yet, so here you go:

## TABLE: Event

```sql
DEFINE TABLE event SCHEMAFULL;

DEFINE FIELD created ON event TYPE datetime VALUE $before OR time::now();
DEFINE FIELD from ON TABLE event ASSERT $value != NONE;
DEFINE FIELD to ON TABLE event ASSERT $value != NONE;
DEFINE FIELD details ON TABLE event TYPE object VALUE $before OR {};
DEFINE FIELD event ON TABLE event TYPE string ASSERT $value != NONE AND $value = /^[a-zA-Z](?:[-_.]?[a-zA-Z0-9])+$/;
DEFINE FIELD field ON TABLE event TYPE string ASSERT $value != NONE AND $value = /.+:.+/;
```

## TABLE: Waitlist

```sql
DEFINE TABLE waitlist SCHEMAFULL;

DEFINE FIELD created ON waitlist TYPE datetime VALUE $before OR time::now();
DEFINE FIELD email ON waitlist TYPE string ASSERT is::email($value);
DEFINE FIELD name ON waitlist TYPE string;
DEFINE FIELD updated ON waitlist TYPE datetime VALUE time::now();

DEFINE INDEX email ON TABLE waitlist COLUMNS email UNIQUE;

DEFINE EVENT name ON TABLE waitlist WHEN $before.name != $after.name THEN ( 
  CREATE event SET from=$before.name, to=$after.name, event="waitlist_name_changed", field=$before.id
);
```

