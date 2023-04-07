# Moodisc
Discord bot for moodle

<img src="img/moodisc.png" width="30%" alt="Logo">

## Available commands

- `/help`: See a help page listing all available commands. Dynamically generated.
- `/thang`: See all upcoming events for the next month.
- `/tuan`: See all upcoming events for the next week

![image](https://user-images.githubusercontent.com/75104235/230538327-c7403582-40a5-44cc-9f6a-7c813227b931.png)

## Setup

There are 2 options for deploying moodisc:

1. [Bare Metal](#bare-metal)
2. [Docker](#docker)

### Bare metal

First, clone this repository, `cd` into it and install dependencies
```bash
https://github.com/timoxoszt/moodle-discord-bot
cd moodle-discord-bot
npm install
```
Then get your discord and moodle tokens, and add them to your environnement
```bash
export DISCORD_TOKEN=<your discord token here>
export MOODLE_TOKEN=<your moodle token here>
export MOODLE_ID=<your moodle account id here>
export GUILD_ID=<your discord server id here>
export CLIENT_ID=<your discord bot id here>
export MOODLE_URL=<your moodle url here> # example: https://courses.uit.edu.vn/
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
GUILD_ID=<your discord server id here>
CLIENT_ID=<your discord bot id here>
MOODLE_URL=<your moodle url here> # example: https://courses.uit.edu.vn/
```
Start docker container
```bash
docker compose up -d --build
```
### Get moodle token and id
- Only UIT moodle
1. Truy cập https://courses.uit.edu.vn/calendar/export.php
2. Chọn `Các sự kiện được xuất` và `Khoảng thời gian`
![image](https://user-images.githubusercontent.com/75104235/230539058-d5d0bb38-3990-4ec1-a337-5229375e437d.png)
3. Chọn <b>Xuất</b> và theo dõi phần `Network` tại `dev tool`
![image](https://user-images.githubusercontent.com/75104235/230539605-87d3ee21-0d8a-4bf5-b6f6-37c539922dac.png)
