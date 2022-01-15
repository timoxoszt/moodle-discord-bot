import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import Calendar from './getEvents.js';
import {Client, Intents, MessageEmbed} from 'discord.js';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const GUILD_ID = "927943017468416030";
const CLIENT_ID = "928685167034376233";
const TOKEN = process.env.DISCORD_TOKEN;

const commands = [
    {
        name: 'help',
        description: "Voir la page d'aide"
    }, {
        name: 'mois',
        description: 'Voir les rendus pour le mois'
    }, {
        name: 'semaine',
        description: 'Voir les rendus pour la semaine'
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
        .setTitle(`Rendus pour la semaine ${calendar.week_number()}`)
        .setURL('https://moodle.univ-ubs.fr/')
        .setThumbnail('https://ozna.me/moodle_logo.png')
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
                .setTitle("Page d'aide")
                .setDescription(`Vous avez ${commands.length} commandes à votre disposition :`)
                .setURL('https://github.com/finxol/moodisc')
                .setThumbnail('https://ozna.me/moodle_logo.png')
                .addFields(msg)
                .setTimestamp();
            await interaction.reply({ embeds: [res] });
            break;

        case "mois":
            res = await createEventsEmbeds("month");
            await interaction.reply({ embeds: [res] });
            break;

        case "semaine":
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
