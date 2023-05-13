DEFINE TABLE email_templates SCHEMAFULL
    PERMISSIONS NONE;

DEFINE FIELD content ON TABLE email_templates TYPE string; 

# Fallback template, should get overwritten
CREATE email_templates:waitlist         SET content = "Confirm your email on the waitlist with the following link: {{verificationlink}}";
CREATE email_templates:reset_password   SET content = "Reset your password with the following link: {{verificationlink}}";