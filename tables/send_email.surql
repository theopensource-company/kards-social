DEFINE TABLE send_email SCHEMALESS
    PERMISSIONS NONE DROP;

DEFINE FIELD from_name ON TABLE send_email TYPE string VALUE $value OR 'Kards Social' ASSERT $value != NONE;
DEFINE FIELD from_email ON TABLE send_email TYPE string VALUE $value OR 'noreply@kards.social' ASSERT is::email($value);
DEFINE FIELD to_name ON TABLE send_email TYPE string ASSERT $value != NONE;
DEFINE FIELD to_email ON TABLE send_email TYPE string ASSERT is::email($value);
DEFINE FIELD subject ON TABLE send_email TYPE string ASSERT $value != NONE;
DEFINE FIELD content ON TABLE send_email TYPE array ASSERT array::len($value) > 0;

# Always send the email :D    (1=1)
DEFINE EVENT email ON TABLE send_email WHEN 1=1 THEN (
    SELECT * FROM http::post('https://api.sendgrid.com/v3/mail/send', {
        personalizations: [
            {
                from: {
                    email: $after.from_email,
                    name: $after.from_name
                },
                to: [{
                    email: $after.to_email,
                    name: $after.to_name
                }],
                subject: $after.subject,
            }
        ],
        from: {
            email: $after.from_email,
            name: $after.from_name
        },
        subject: $after.subject,
        content: $after.content
    }, {
        Authorization: "Bearer " + string::slice((select value from environment:sendgrid_key), 2, (string::length((select value from environment:sendgrid_key)) - 4)),
        "Content-Type": "application/json",
    })
);