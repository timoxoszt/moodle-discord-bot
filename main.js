import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import Calendar from './getEvents.js';
import {Client, Intents, MessageAttachment, MessageEmbed} from 'discord.js';
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const GUILD_ID = "927943017468416030";
const CLIENT_ID = "928685167034376233";
const TOKEN = process.env.DISCORD_TOKEN;

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!'
    },
    {
        name: 'mois',
        description: 'Voir les rendus pour la mois'
    },
    {
        name: 'salepute',
        description: "Âmes sensibles s'abstenir"
    }
];


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');

    } else if (interaction.commandName === 'mois') {
        let calendar = await new Calendar;
        await calendar.fetch_week();
        let fields = calendar.empty ? {name: "Rendu", value: "Pas de rendus pour cette semaine", inline: true} : calendar.events;
        const res = new MessageEmbed()
                .setColor('#f58820')
                .setTitle(`Rendus pour la semaine ${calendar.week_number()}`)
                .setURL('https://moodle.univ-ubs.fr/')
                .setThumbnail('https://moodle.univ-ubs.fr/theme/image.php/classic/theme/1641688987/favicon')
                .addFields(fields)
                .setTimestamp()

        await interaction.reply({ embeds: [res] });

    } else if (interaction.commandName === 'salepute') {
        let min = Math.ceil(10);
        let max = Math.floor(212);
        let i = Math.floor(Math.random() * (max - min) + min);
        await interaction.reply({
            files: [{
                attachment: `http://salepute.fr/${i}.mp4`
            }]
        });
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
