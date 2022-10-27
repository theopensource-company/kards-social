DEFINE SCOPE user 
    SIGNIN ( SELECT * FROM user WHERE (email = $identifier OR username = $identifier) AND crypto::argon2::compare(password, $password) )
;

DEFINE SCOPE admin SESSION 1h
    SIGNIN ( SELECT * FROM user WHERE email = $identifier AND crypto::argon2::compare(password, $password) )
;