DEFINE TABLE profile AS
    SELECT 
        name,
        username,
        created,
        description,
        website
    FROM user
    PERMISSIONS
        FOR create, update, delete NONE; 

DEFINE FIELD id ON TABLE profile PERMISSIONS NONE;