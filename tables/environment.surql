DEFINE TABLE environment SCHEMAFULL PERMISSIONS
        FOR select WHERE $scope = 'admin' OR public = true
        FOR update WHERE $scope = 'admin'
        FOR create, delete NONE;

DEFINE FIELD value ON TABLE environment TYPE string ASSERT $value != NONE;
DEFINE FIELD public ON TABLE environment TYPE bool ASSERT $value != NONE;

IF SELECT * FROM environment:sendgrid_key == null THEN
        ( CREATE environment:sendgrid_key SET value = "BLANK", public = false )
END;

IF SELECT * FROM environment:origin == null THEN
        ( CREATE environment:origin SET value = "", public = true )
END;

IF SELECT * FROM environment:cloudflare_account_id == null THEN
        ( CREATE environment:cloudflare_account_id SET value = "BLANK", public = false )
END;

IF SELECT * FROM environment:cloudflare_account_hash == null THEN
        ( CREATE environment:cloudflare_account_hash SET value = "BLANK", public = true )
END;

IF SELECT * FROM environment:cloudflare_images_api_token == null THEN
        ( CREATE environment:cloudflare_images_api_token SET value = "BLANK", public = false )
END;

// Patches for DB migrations for records that we're created before the public field was introduced.
UPDATE environment:sendgrid_key                 SET public = false;
UPDATE environment:origin                       SET public = true;
UPDATE environment:cloudflare_account_id        SET public = false;
UPDATE environment:cloudflare_account_hash      SET public = true;
UPDATE environment:cloudflare_images_api_token  SET public = false;