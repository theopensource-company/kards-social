DEFINE TABLE environment SCHEMAFULL PERMISSIONS
        FOR select, update WHERE $scope = 'admin'
        FOR create, delete NONE;

DEFINE FIELD value ON TABLE environment TYPE string ASSERT $value != NONE;

CREATE environment:sendgrid_key SET value = "BLANK";
CREATE environment:origin SET value = "";