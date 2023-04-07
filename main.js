import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import Calendar from './getEvents.js';
import {Client, Intents, MessageEmbed} from 'discord.js';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const GUILD_ID = process.env.GUILD_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const TOKEN = process.env.DISCORD_TOKEN;
const MOODLE_URL = process.env.MOODLE_URL;

const commands = [
    {
        name: 'help',
        description: "Hướng dẫn sử dụng"
    }, {
        name: 'thang',
        description: 'Deadline trong tháng'
    }, {
        name: 'tuan',
        description: 'Deadline trong tuần'
    }
];

/**
 * Fetch and format upcoming events
 * @param timeframe "week" or "month"
 * @returns {Promise<MessageEmbed>} MessageEmbed object to directly send to discord
 */
async function createEventsEmbeds(timeframe) {
    let calendar = await new Calendar;

    switch (timeframe) {
        case "week":
            await calendar.fetch_week();
            break;
        case "month":
            await calendar.fetch_month();
            break;
    }

    return new MessageEmbed()
        .setColor('#f58820')
        .setTitle(`Deadline trong tuần ${calendar.week_number()}`)
        .setURL(MOODLE_URL)
        .setThumbnail(MOODLE_URL.concat('pluginfile.php/1/core_admin/logo/0x150/1667485444/logo-header.png'))
        .addFields(calendar.events)
        .setTimestamp();
}


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('Moodle', { type: 'WATCHING' });
});

client.on('interactionCreate', async interaction => {
    let res;

    if (!interaction.isCommand()) return;

    switch (interaction.commandName) {
        case "help":
            let msg = [];
            commands.forEach(command => {
                msg.push({
                    name: `\`${command.name}\``,
                    value: command.description,
                    inline: true
                });
            })
            res = new MessageEmbed()
                .setColor('#f58820')
                .setTitle("Trang hỗ trợ")
                .setDescription(`Có ${commands.length} lệnh đang được hỗ trợ :`)
                .setURL('https://github.com/timoxoszt/moodle-discord-bot')
                .setThumbnail(MOODLE_URL.concat('pluginfile.php/1/core_admin/logo/0x150/1667485444/logo-header.png'))
                .addFields(msg)
                .setTimestamp();
            await interaction.reply({ embeds: [res] });
            break;

        case "thang":
            res = await createEventsEmbeds("month");
            await interaction.reply({ embeds: [res] });
            break;

        case "tuan":
            res = await createEventsEmbeds("week");
            await interaction.reply({ embeds: [res] });
            break;

        default:
            break;
    }
});

client.login(TOKEN);

const rest = new REST({ version: '9' }).setToken(TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
