DEFINE TABLE log SCHEMALESS;

DEFINE FIELD created ON log TYPE datetime VALUE $before OR time::now();
DEFINE FIELD details ON TABLE log TYPE object VALUE $value OR $before OR {};
DEFINE FIELD level ON TABLE log TYPE string ASSERT $value != NONE and $value = /(?:INFO|WARNING|ERROR)/;
DEFINE FIELD message ON TABLE log TYPE string ASSERT $value != NONE;
DEFINE FIELD service ON TABLE log TYPE string ASSERT $value != NONE AND $value = /^[a-z]+:[a-z]+\/[a-z]+$/;