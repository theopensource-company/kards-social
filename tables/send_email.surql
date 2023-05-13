DEFINE TABLE send_email SCHEMALESS
    PERMISSIONS NONE DROP;

DEFINE FIELD from_name ON TABLE send_email TYPE string VALUE $value OR 'Kards Social';
DEFINE FIELD from_email ON TABLE send_email TYPE string VALUE $value OR 'noreply@kards.social' ASSERT is::email($value);
DEFINE FIELD to_name ON TABLE send_email TYPE string;
DEFINE FIELD to_email ON TABLE send_email TYPE string ASSERT is::email($value);
DEFINE FIELD subject ON TABLE send_email TYPE string;
DEFINE FIELD content ON TABLE send_email TYPE array ASSERT array::len($value) > 0;

# Always send the email :D    (1=1)
DEFINE EVENT email ON TABLE send_email WHEN 1=1 THEN {
    LET $bearer_token = SELECT value FROM environment:sendgrid_key;

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
        Authorization: "Bearer " + $bearer_token.value,
        "Content-Type": "application/json",
    })
};