import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';

// Vérification des variables d'environnement
if (!process.env.TOKEN || !process.env.CLIENT_ID) {
  console.error("Erreur : Les variables d'environnement 'TOKEN' et 'CLIENT_ID' doivent être définies.");
  process.exit(1);
}

// Création du client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Commande pour changer le statut
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Vérification de l'ID de l'utilisateur
  if (message.content.startsWith('!setstatus') && message.author.id === process.env.CLIENT_ID) {
    const args = message.content.split(' ').slice(1);
    const newStatus = args.join(' ');

    if (newStatus) {
      await client.user.setPresence({
        activities: [{ name: newStatus, type: 0 }],
        status: 'online'
      });
      message.reply(`Statut mis à jour : ${newStatus}`);
    } else {
      message.reply("Veuillez fournir un statut.");
    }
  }
});

// Connexion du client
client.login(process.env.TOKEN)
  .then(() => {
    console.log('Bot connecté avec succès.');
  })
  .catch(err => {
    console.error('Erreur de connexion :', err);
    process.exit(1);
  });
