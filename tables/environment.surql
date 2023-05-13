DEFINE TABLE environment SCHEMAFULL PERMISSIONS
        FOR select WHERE $scope = 'admin' OR public = true
        FOR update WHERE $scope = 'admin'
        FOR create, delete NONE;

DEFINE FIELD value ON TABLE environment TYPE string;
DEFINE FIELD public ON TABLE environment TYPE bool;

IF not(environment:sendgrid_key.id) THEN
        CREATE environment:sendgrid_key SET value = "BLANK", public = false;
END;

IF not(environment:origin.id) THEN
        CREATE environment:origin SET value = "", public = true;
END;

IF not(environment:cloudflare_account_id.id) THEN
        CREATE environment:cloudflare_account_id SET value = "BLANK", public = false;
END;

IF not(environment:cloudflare_account_hash.id) THEN
        CREATE environment:cloudflare_account_hash SET value = "BLANK", public = true;
END;

IF not(environment:cloudflare_images_api_token.id) THEN
        CREATE environment:cloudflare_images_api_token SET value = "BLANK", public = false;
END;

// Patches for DB migrations for records that we're created before the public field was introduced.
UPDATE environment:sendgrid_key                 SET public = false;
UPDATE environment:origin                       SET public = true;
UPDATE environment:cloudflare_account_id        SET public = false;
UPDATE environment:cloudflare_account_hash      SET public = true;
UPDATE environment:cloudflare_images_api_token  SET public = false;