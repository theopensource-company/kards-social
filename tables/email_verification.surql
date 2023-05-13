DEFINE TABLE email_verification SCHEMAFULL DROP;

DEFINE FIELD email ON email_verification TYPE string ASSERT is::email($value);
DEFINE FIELD recipient ON email_verification TYPE string;
DEFINE FIELD template ON email_verification TYPE string ASSERT $value = 'waitlist' OR $value = 'reset_password';
DEFINE FIELD origin ON email_verification TYPE string;

DEFINE EVENT waitlist ON TABLE email_verification WHEN $after.template = 'waitlist' THEN (
    CREATE send_email_verification CONTENT {
        email: $after.email,
        recipient: $after.recipient,
        template: $after.template,
        origin: $after.origin
    }
);

DEFINE EVENT reset_password ON TABLE email_verification WHEN $after.template = 'reset_password' THEN {
    LET $user = SELECT name, email FROM user WHERE email = $after.email;

    IF ($user[0].email) THEN
        CREATE send_email_verification CONTENT {
            email: $user[0].email,
            recipient: $user[0].name,
            template: $after.template,
            origin: $after.origin
        };
    END;
};

///////////////////////////////////
////  SEND EMAIL VERIFICATION  ////
///////////////////////////////////


DEFINE TABLE send_email_verification SCHEMAFULL
    PERMISSIONS NONE;

DEFINE FIELD created ON send_email_verification TYPE datetime VALUE $before OR time::now();
// No verification here because it would leak if a user exists for the reset_password event :D
DEFINE FIELD email ON send_email_verification TYPE string;
DEFINE FIELD recipient ON send_email_verification TYPE string;
DEFINE FIELD secret ON send_email_verification TYPE string VALUE $before OR rand::string(32);
DEFINE FIELD template ON send_email_verification TYPE string ASSERT $value = 'waitlist' OR $value = 'reset_password';
DEFINE FIELD origin ON send_email_verification TYPE string;

DEFINE EVENT waitlist ON TABLE send_email_verification WHEN $after.template = 'waitlist' THEN {
    LET $env_origin = SELECT value FROM environment:origin;
    LET $origin = $env_origin.value || $after.origin;
    LET $link = $origin + "/join-waitlist?email=" + $after.email + "&secret=" + $after.secret;
    LET $template = SELECT content FROM email_templates:waitlist;
    LET $html = string::replace($template.content, "{{verificationlink}}", $link);

    CREATE send_email CONTENT {
        to_name: $after.recipient,
        to_email: $after.email,
        subject: "Confirm your entry on the waitlist!",
        content: [
            {
                type: "text/plain",
                value: "Confirm your email on the waitlist with the following link: " + $link
            },
            {
                type: "text/html",
                value: $html
            }
        ]
    }
};

DEFINE EVENT reset_password ON TABLE send_email_verification WHEN $after.template = 'reset_password' THEN {
    LET $env_origin = SELECT value FROM environment:origin;
    LET $origin = $env_origin.value || $after.origin;
    LET $link = $origin + "/auth/reset-password?email=" + $after.email + "&secret=" + $after.secret;
    LET $template = SELECT content FROM email_templates:reset_password;
    LET $html = string::replace($template.content, "{{verificationlink}}", $link);

    CREATE send_email CONTENT {
        to_name: $after.recipient,
        to_email: $after.email,
        subject: "Reset your password!",
        content: [
            {
                type: "text/plain",
                value: "Reset your password with the following link: " + $link
            },
            {
                type: "text/html",
                value: $html
            }
        ]
    }
};