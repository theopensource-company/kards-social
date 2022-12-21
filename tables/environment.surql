DEFINE TABLE environment SCHEMAFULL PERMISSIONS
        FOR select, update WHERE $scope = 'admin'
        FOR create, delete NONE;

DEFINE FIELD value ON TABLE environment TYPE string ASSERT $value != NONE;

IF array::len((SELECT * FROM environment:sendgrid_key)) == 0 THEN
        ( CREATE environment:sendgrid_key SET value = "BLANK" )
END;

IF array::len((SELECT * FROM environment:origin)) == 0 THEN
        ( CREATE environment:origin SET value = "" )
END;

IF array::len((SELECT * FROM environment:cloudflare_account_id)) == 0 THEN
        ( CREATE environment:cloudflare_account_id SET value = "BLANK" )
END;

IF array::len((SELECT * FROM environment:cloudflare_account_hash)) == 0 THEN
        ( CREATE environment:cloudflare_account_hash SET value = "BLANK" )
END;

IF array::len((SELECT * FROM environment:cloudflare_images_api_token)) == 0 THEN
        ( CREATE environment:cloudflare_images_api_token SET value = "BLANK" )
END;