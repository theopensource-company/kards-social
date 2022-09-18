# Database tables

we have not found a proper solution for this yet, so here you go:

## TABLE: Waitlist

```sql
DEFINE TABLE waitlist SCHEMAFULL;
DEFINE FIELD created ON waitlist TYPE datetime VALUE $before OR time::now()
DEFINE FIELD email ON waitlist TYPE string
DEFINE FIELD name ON waitlist TYPE string
DEFINE FIELD updated ON waitlist TYPE datetime VALUE time::now()
```