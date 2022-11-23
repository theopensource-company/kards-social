import concurrently from 'concurrently';

const runners = concurrently(
    [
        {
            name: "kards-app",
            command: "cd app && pnpm run dev",
        },
        {
            name: "surrealdb",
            command: "surreal start --user root --pass root --bind 0.0.0.0:12001 file:dev.db"
        },
    ],
);

async function exit() {
    console.log("Caught interrupt signal");

    for(var i = 0; i < runners.commands.length; i++) {
        console.log(`Closing runner "${runners.commands[i].name}".`);
        await runners.commands[i].kill();
    }

    setTimeout(() => process.exit(0), 1000);
}

process.on('uncaughtException', exit);
process.on('SIGINT', exit);