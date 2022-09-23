<br><br>

<p align="center">
    <img src="app/public/Logo.svg" width="180">
</p>

<br><br>



# Kards social

Hiya! 👋 <br>
Welcome to the Kards social GitHub repo! We have some little helpers to get you started with our project.

<br>

## CLI tools

**Warning:** Make sure to always run the cli tools from the root of the project. Don't CD into the cli folder to execute them!

We have written some cli tools to make it easier to get started with the project!

- `pnpm conf`: Run this as the first command and follow the instructions it provides you. This will setup all of the environments and config files.
- `pnpm dbshell`: It's a little tool to connect with the database that you configured with `pnpm conf`.
- `pnpm dev`: Spins up the full development stack.

## Database 

We use SurrealDB as our main database. Alongside that we also use cloudflare KV at times to store things.

For your development database, please **do not run it locally**. <br>
Even though you spin up a local working environment, the cloudflare worker still does some stuff on the edge. It will not be able to reach a local surrealdb instance!

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