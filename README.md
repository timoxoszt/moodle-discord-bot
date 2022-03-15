# Moodisc
Discord bot for moodle

<img src="img/moodisc.png" width="30%" alt="Logo">

## Available commands

- `/help`: See a help page listing all available commands. Dynamically generated.
- `/mois`: See all upcoming events for the next month.
- `/semaine`: See all upcoming events for the next week

<img src="img/moodisc_example.png" alt="example">

## Setup

There are 2 options for deploying moodisc:

1. [Bare Metal](#bare-metal)
2. [Docker](#docker)

### Bare metal

First, clone this repository, `cd` into it and install dependencies
```bash
git clone https://github.com.finxol/moodisc
cd moodisc
npm install
```
Then get your discord and moodle tokens, and add them to your environnement
```bash
export DISCORD_TOKEN=<your discord token here>
export MOODLE_TOKEN=<your moodle token here>
export MOODLE_ID=<your moodle account id here>
```

You may also change the url for your moodle website in `getEvents.js`.

After you've added your discord bot to your desired server(s), you can start the bot.
```bash
npm run dev
```

If you want it to run continuously in the background and have [forever](https://www.npmjs.com/package/forever) installed,
you can directly start the forever process with
```bash
npm start
```
The `restart` and `stop` scripts are also available for easily managing the process.


### Docker

To deploy with docker, you need to install `podman` (or `docker` but the scripts work with podman)

Create a file called `.env` in which you will enter your discord and moodle details. *Don't include quotes*

```bash
DISCORD_TOKEN=<your discord token here>
MOODLE_TOKEN=<your moodle token here>
MOODLE_ID=<your moodle account id here>
```

Then you can simply use the npm scripts provided to build and run with podman

```bash
npm run docker
```

*You can also only build with `npm run docker:build` or only run with `npm run docker:run`.*

Once the build and run processes have finished, check everything is running smoothly with `podman ps`.
You should get an output like this:

```bash
CONTAINER ID  IMAGE                     COMMAND      CREATED       STATUS             PORTS       NAMES
b5d7fbde9ab2  localhost/moodisc:latest  npm run dev  1 minute ago  Up 1 minute ago                moodisc
```
