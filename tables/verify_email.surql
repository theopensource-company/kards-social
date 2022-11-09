DEFINE TABLE verify_email SCHEMAFULL
    PERMISSIONS NONE;

DEFINE FIELD created ON verify_email TYPE datetime VALUE $before OR time::now();
DEFINE FIELD email ON verify_email TYPE string ASSERT is::email($value);
DEFINE FIELD recipient ON verify_email TYPE string ASSERT $value != "NONE";
DEFINE FIELD secret ON verify_email TYPE string VALUE $before OR rand::string(32);
DEFINE FIELD template ON verify_email TYPE string ASSERT $value = 'waitlist';

DEFINE EVENT email ON TABLE verify_email WHEN $after.template = 'waitlist' THEN (
    CREATE send_email CONTENT {
        to_name: $after.recipient,
        to_email: $after.email,
        subject: "Confirm your entry on the waitlist!",
        content: [
            {
                type: "text/plain",
                value: "Confirm your email on the waitlist with the following link: " + string::replace(
                    string::replace(
                        "https://kards.social/join-waitlist?email={{email}}&secret={{secret}}",
                        "{{secret}}",
                        $after.secret
                    ),
                    "{{email}}",
                    $after.email
                )
            },
            {
                type: "text/html",
                value: string::replace(
                    string::slice((select content from email_templates:waitlist), 2, (string::length((select content from email_templates:waitlist)) - 4)),
                    "{{verificationlink}}",
                    string::replace(
                        string::replace(
                            "https://kards.social/join-waitlist?email={{email}}&secret={{secret}}",
                            "{{secret}}",
                            $after.secret
                        ),
                        "{{email}}",
                        $after.email
                    )
                )
            }
        ]
    }
);