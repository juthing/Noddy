import { Client, GatewayIntentBits, ActivityType } from 'discord.js';

// --- Vérification des variables d'environnement ---
const { TOKEN, OWNER_ID } = process.env;

if (!TOKEN || !OWNER_ID) {
  console.error("Erreur : Les variables d'environnement 'TOKEN' et 'OWNER_ID' doivent être définies !");
  process.exit(1);
}

// --- Création du client ---
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// --- Quand le bot est prêt ---
client.once('ready', () => {
  console.log(`${client.user.tag} est en ligne !`);
});

// --- Commande pour changer le statut ---
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Vérifie que seul OWNER_ID peut changer le statut
  if (message.content.startsWith('!setstatus') && message.author.id === OWNER_ID) {
    const args = message.content.split(' ').slice(1);
    const newStatus = args.join(' ');

    if (!newStatus) return message.reply("Merci de fournir un statut !");

    try {
      await client.user.setActivity(newStatus, { type: ActivityType.Playing });
      message.reply(`✅ Statut changé en : ${newStatus}`);
    } catch (err) {
      console.error(err);
      message.reply("❌ Erreur lors du changement du statut.");
    }
  }
});

// --- Keep-alive simple ---
setInterval(() => console.log('Bot toujours actif'), 5 * 60 * 1000);

// --- Connexion du bot ---
client.login(TOKEN);
