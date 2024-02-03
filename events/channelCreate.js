﻿const { PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder } = require("discord.js");
const Discord = require("discord.js")
const louritydb = require("croxydb")

module.exports = async (client, channel) => {

    let kanalLog = louritydb.get(`kanalLog_${channel.guild.id}`)


    if (kanalLog) {
        const kontrol = channel.guild.channels.cache.get(kanalLog)

        if (!kontrol) {
            louritydb.delete(`kanalLog_${channel.guild.id}`)
            return;
        }

        let me = channel.guild.members.cache.get(client.user.id)
        if (!me.permissions.has(PermissionsBitField.Flags.Administrator)) return;

        var fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: Discord.AuditLogEvent.ChannelCreate,
        });

        var channelLog = fetchedLogs.entries.first();

        if (channelLog.executor?.bot) return;
        if (channel.guild.ownerId === channelLog.executor.id) return;


        let logEmbed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`<:plus:1049570579465912361> Sunucuda yeni bir kanal **oluşturuldu**: ${channel || "bulunamadı"}`)
            .addFields(
                { name: "Oluşturulduğu Zaman:", value: "<t:" + Math.floor(Date.now() / 1000) + ":F>" },
                { name: "Kullanıcı:", value: `${channelLog.executor} (${channelLog.executor.id})` },
            )
            .setThumbnail(channelLog.executor.avatarURL({ dynamic: true }))
            .setTimestamp()

        kontrol.send({ embeds: [logEmbed] }).catch((e) => { })
    }
}