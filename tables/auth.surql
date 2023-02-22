DEFINE SCOPE user 
    SIGNIN ( SELECT * FROM user WHERE (email = $identifier OR username = $identifier) AND crypto::argon2::compare(password, $password) )
;

DEFINE SCOPE admin SESSION 1h
    SIGNIN ( SELECT * FROM admin WHERE email = $identifier AND crypto::argon2::compare(password, $password) )
;

DEFINE SCOPE waitlist SESSION 1s
    SIGNUP ( 
        INSERT IGNORE INTO waitlist (
            SELECT email, recipient as name FROM send_email_verification WHERE template = 'waitlist' AND created + 1h > time::now() AND email = $email AND secret = $secret 
        )
    )
;

REMOVE SCOPE verify_reset_password;