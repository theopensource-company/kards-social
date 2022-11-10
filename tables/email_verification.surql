DEFINE TABLE email_verification SCHEMAFULL DROP;

DEFINE FIELD email ON email_verification TYPE string ASSERT is::email($value);
DEFINE FIELD recipient ON email_verification TYPE string ASSERT $value != "NONE";
DEFINE FIELD template ON email_verification TYPE string ASSERT $value = 'waitlist';
DEFINE FIELD origin ON email_verification TYPE string ASSERT $value != NONE;

DEFINE EVENT email ON TABLE email_verification WHEN 1=1 THEN (
    CREATE send_email_verification CONTENT {
        email: $after.email,
        recipient: $after.recipient,
        template: $after.template,
        origin: $after.origin
    }
);


///////////////////////////////////
////  SEND EMAIL VERIFICATION  ////
///////////////////////////////////


DEFINE TABLE send_email_verification SCHEMAFULL
    PERMISSIONS NONE;

DEFINE FIELD created ON send_email_verification TYPE datetime VALUE $before OR time::now();
DEFINE FIELD email ON send_email_verification TYPE string ASSERT is::email($value);
DEFINE FIELD recipient ON send_email_verification TYPE string ASSERT $value != "NONE";
DEFINE FIELD secret ON send_email_verification TYPE string VALUE $before OR rand::string(32);
DEFINE FIELD template ON send_email_verification TYPE string ASSERT $value = 'waitlist';
DEFINE FIELD origin ON send_email_verification TYPE string ASSERT $value != NONE;

DEFINE EVENT email ON TABLE send_email_verification WHEN $after.template = 'waitlist' THEN (
    CREATE send_email CONTENT {
        to_name: $after.recipient,
        to_email: $after.email,
        subject: "Confirm your entry on the waitlist!",
        content: [
            {
                type: "text/plain",
                value: "Confirm your email on the waitlist with the following link: " + string::replace(
                    string::replace(
                        string::replace("{{origin}}/join-waitlist?email={{email}}&secret={{secret}}", "{{secret}}", $after.secret),
                        "{{origin}}",
                        string::slice((select value from environment:origin), 2, (string::length((select value from environment:origin)) - 4)) || $after.origin
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
                            string::replace("{{origin}}/join-waitlist?email={{email}}&secret={{secret}}", "{{secret}}", $after.secret),
                            "{{origin}}",
                            string::slice((select value from environment:origin), 2, (string::length((select value from environment:origin)) - 4)) || $after.origin
                        ),
                        "{{email}}",
                        $after.email
                    )
                )
            }
        ]
    }
);