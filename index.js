const { Client, GatewayIntentBits, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.on('ready', () => {
    console.log(`البوت شغال بنجاح باسم: ${client.user.tag}`);

    const sendSongCmd = new SlashCommandBuilder()
        .setName('send-song')
        .setDescription('إهداء أغنية مع رسالة مخصصة')
        .addStringOption(opt => opt.setName('song').setDescription('اسم الأغنية').setRequired(true))
        .addUserOption(opt => opt.setName('target').setDescription('المستهدف').setRequired(true))
        .addStringOption(opt => opt.setName('message').setDescription('الرسالة').setRequired(false));

    client.application.commands.create(sendSongCmd);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'send-song') {
        const song = interaction.options.getString('song');
        const target = interaction.options.getUser('target');
        const message = interaction.options.getString('message') || 'بدون رسالة';

        const embed = new EmbedBuilder()
            .setTitle('🎵 طلب إهداء جديد')
            .setColor('#FF1493')
            .setDescription(`**المستهدف:** ${target}\n**الأغنية:** ${song}\n**الرسالة:** ${message}`)
            .setFooter({ text: 'يرجى إتمام الدفع لإرسال الإهداء' });

        const payButton = new ButtonBuilder()
            .setLabel('اضغط هنا للدفع لإرسال الإهداء 💳')
            .setURL('https://your-payment-link.com') // استبدل هذا برابط متجرك أو بوابتك
            .setStyle(ButtonStyle.Link);

        const row = new ActionRowBuilder().addComponents(payButton);

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }
});

// يقرأ التوكين بأمان من إعدادات الاستضافة
client.login(process.env.TOKEN);
