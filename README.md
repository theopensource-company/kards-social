<br><br>

<p align="center">
    <img src="public/Logo.svg" width="250">
</p>

<br><br>



# Kards social

Hiya! 👋 <br>
Welcome to the Kards social GitHub repo! We have a little guide to get you started with our project.

<br>

## Requirements

- The surreal CLI tool. Follow instructions via: https://surrealdb.com/install
  - Make sure the it's installed globally in your PATH.
- A sendgrid api key if you want to be able to send emails

## Getting started

**Warning:** Don't run the CLI tools directly. Use the pnpm scripts to run them to ensure that they will be properly executed.

- Install all the packages with `pnpm i`.
- Run `pnpm dev` in the root of the repo to spin up the full development stack. <br>
  This will launch the nextjs development server and a local surrealdb instance.
- Open the devtools (http://localhost:12000/dev) and run the database migration for the first run, or when you make changes to the schema.
- Go back to the devtools and open the admin panel. <br>
  The database migration created the following admin account for you: 
    - Email: `admin@kards.local`
    - Password: `Password1!`
- Edit the environment keys. Don't touch the origin key though, this is only needed to enfore a domain for production instances!
- Create a user account for yourself, you can now sign into the account and use the full application!

<br>

---

## Contributing

We would love it if you have something to add to our platform, please do! ❤️

You can Fork the repository for yourself, and feel free to open a **draft** PR (Pull Request) so we can keep an eye out and help you when we notice something.

Once your code is ready for review, convert mark it as ready for review and assign somebody from the team to take a look at it.

<br>

## Pull requests, issues: commenting.

Feel free to leave a comment or to create an issue but please, before you post it: Review it for yourself, check if it was posted before, check if it adds value for the greater good. 

We want to keep our inbox clean so we respond to emerging issues quickly. <br>
If everybody asks when an issue is gonna be implemented **every day** we will need to lock the conversation. 

If it has been a long time and the issue / PR seems to become inactive, definitely feel free to post a comment or even check in on us on our [Discord server](https://discord.gg/DRCV4g7Bmy).