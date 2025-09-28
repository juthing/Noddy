// bot.js
import { Client, GatewayIntentBits, ActivityType, REST, Routes, SlashCommandBuilder } from 'discord.js';

// Crée le client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// ID autorisé à changer le statut
const OWNER_ID = '1164597199594852395';

// Crée la commande slash
const commands = [
    new SlashCommandBuilder()
        .setName('status')
        .setDescription('Change le statut du bot (réservé au propriétaire)')
        .addStringOption(option =>
            option.setName('texte')
                .setDescription('Texte du statut')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type du statut (PLAYING, LISTENING, WATCHING, COMPETING)')
                .setRequired(false))
].map(command => command.toJSON());

// Déploie la commande globalement
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
(async () => {
    try {
        console.log('Mise à jour des commandes...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );
        console.log('Commandes mises à jour !');
    } catch (error) {
        console.error(error);
    }
})();

// Quand le bot est prêt
client.once('ready', () => {
    console.log(`${client.user.tag} est en ligne !`);
});

// Commande pour changer le statut
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'status') {
        if (interaction.user.id !== OWNER_ID) {
            return interaction.reply({ content: 'Tu n’as pas la permission.', ephemeral: true });
        }

        const newStatus = interaction.options.getString('texte');
        const typeOption = interaction.options.getString('type') || 'PLAYING';

        try {
            await client.user.setActivity(newStatus, { type: ActivityType[typeOption.toUpperCase()] });
            interaction.reply({ content: `Statut changé en : ${typeOption} ${newStatus}`, ephemeral: true });
        } catch (err) {
            console.error(err);
            interaction.reply({ content: 'Erreur lors du changement du statut.', ephemeral: true });
        }
    }
});

// Keep-alive pour Railway ou uptime monitoring
setInterval(() => console.log('Bot toujours actif'), 5 * 60 * 1000);

// Connexion
client.login(process.env.TOKEN);
