DEFINE TABLE verify_email SCHEMAFULL
    PERMISSIONS 
        FOR update, select, update NONE;

DEFINE FIELD created ON verify_email TYPE datetime VALUE $before OR time::now();
DEFINE FIELD email ON verify_email TYPE string ASSERT is::email($value);
DEFINE FIELD recipient ON verify_email TYPE string ASSERT $value != "NONE";
DEFINE FIELD secret ON verify_email TYPE string VALUE $before OR rand::string(32) PERMISSIONS NONE; #Otherwise key will be returned on record creation.
DEFINE FIELD template ON verify_email TYPE string ASSERT $value = 'waitlist';

DEFINE EVENT email ON TABLE verify_email WHEN $after.template = 'waitlist' THEN (
    CREATE send_email CONTENT {
        to_name: $after.recipient,
        to_email: $after.email,
        subject: "Confirm your entry on the waitlist!",
        content: [
            {
                type: "text/plain",
                value: "Confirm your email on the waitlist with the following link: https://kards.social/join-waitlist?email=" + $after.email + "&secret=" + $after.secret
            },
            {
                type: "text/html",
                value: string::replace(
                    string::slice((select content from email_templates:waitlist), 2, (string::length((select content from email_templates:waitlist)) - 4)),
                    "{{verificationlink}}",
                    "https://kards.social/join-waitlist?email=" + $after.email + "&secret=" + $after.secret
                )
            }
        ]
    }
);