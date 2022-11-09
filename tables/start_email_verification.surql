DEFINE TABLE start_email_verification SCHEMAFULL DROP;

DEFINE FIELD email ON start_email_verification TYPE string ASSERT is::email($value);
DEFINE FIELD recipient ON start_email_verification TYPE string ASSERT $value != "NONE";
DEFINE FIELD template ON start_email_verification TYPE string ASSERT $value = 'waitlist';

DEFINE EVENT email ON TABLE start_email_verification WHEN $after.template = 'waitlist' THEN (
    CREATE verify_email CONTENT {
        email: $after.email,
        recipient: $after.recipient,
        template: $after.template
    }
);
