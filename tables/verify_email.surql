DEFINE TABLE verify_email SCHEMAFULL
    PERMISSIONS 
        FOR update, select, update NONE;

DEFINE FIELD created ON verify_email TYPE datetime VALUE $before OR time::now();
DEFINE FIELD email ON verify_email TYPE string ASSERT is::email($value);
DEFINE FIELD recipient ON verify_email TYPE string ASSERT $value != "NONE";
DEFINE FIELD secret ON verify_email TYPE string VALUE $before OR rand::string(32);
DEFINE FIELD template ON verify_email TYPE string ASSERT $value = 'waitlist';

DEFINE EVENT email ON TABLE verify_email WHEN $after.template = 'waitlist' THEN (
    SELECT * FROM http::post('https://api.sendgrid.com/v3/mail/send', {
        personalizations: [
            {
                from: {
                    email: "noreply@kards.social",
                    name: "Kards Social"
                },
                to: [{
                    email: $after.email,
                    name: $after.recipient
                }],
                subject: "Confirm your entry on the waitlist!",
            }
        ],
        from: {
            email: "noreply@kards.social",
            name: "Kards Social"
        },
        subject: "Confirm your entry on the waitlist!",
        content: [
            {
                type: "text/plain",
                value: string::replace(
                    string::replace(
                        string::replace(
                            "{{LINK}} and {{TEMPLATE}} and {{SECRET}}", 
                            "{{LINK}}", 
                            "https://google.com"
                        ),
                        "{{TEMPLATE}}",
                        $after.template
                    ),
                    "{{SECRET}}",
                    $after.secret
                )
            }
        ]
    }, {
        Authorization: "Bearer {{SENDGRID_API_TOKEN}}",
        "Content-Type": "application/json",
    })
);