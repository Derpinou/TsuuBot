const Discord = require('discord.js')
const client = new Discord.Client();
const { prefix, token, owner} = require('./config')

client.on("ready", () =>{
    console.log('\x1b[33m%s\x1b[0m', '[!]', '\x1b[0m', 'Connexion en cours...');
    console.log('\x1b[32m', '[OK]', '\x1b[0m', 'Connexion à l\'API Discord effectuée !');
    console.log('\x1b[36m%s\x1b[0m', '[INFO]', '\x1b[0m', 'Connecté en tant que ' + client.user.username + '#' + client.user.discriminator);
    console.log('\x1b[36m%s\x1b[0m', '[INFO]', '\x1b[0m', 'Serveurs : ' + client.guilds.cache.size + ' | Membres : ' + client.users.cache.size);
    console.log('\x1b[36m%s\x1b[0m', '[INFO]', '\x1b[0m', 'Préfix : '+ prefix);
    console.log('\x1b[33m%s\x1b[0m', '[!]', '\x1b[0m', 'Ready');
    client.user.setPresence({ activity: { name: 'Modérer' }, status: 'dnd' })
})

client.on("message", async message =>{
    if (message.author.bot) return;
    if (message.channel.type === "dm") { //Lorsqu'un mp est reçu
        if (message.author.bot) return; //Si le membre est un bot, return
            return message.reply('Aucune commande ne peut être envoyée en messages privés !');

    }
    if (message.content.includes(`<@${client.user.id}>`)) {
        message.channel.send(message.author + ", je t'ai entendu me mentionner... Une question ? Mon prefix est"+ prefix);
    }
    if (message.mentions.users.first() === client.user) {
        message.channel.send(message.author + ", je t'ai entendu me mentionner... Une question ? Mon prefix est"+ prefix);
    }
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix+"ban") {
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.reply(`:x: tu n'as pas la permission de bannir.`)
        var the_member = message.mentions.members.first();
        if (!the_member) return message.reply(`:x: Tu dois mentionner la personne a bannir`)
        if(!the_member.bannable) return message.channel.send`:x: Ce membre ne peut pas être bannis, verifiez mes permission ou la hierarchie des roles`
        let raison = args.slice(1).join(' ');
        if(!raison) raison = "Pas de raison";
        raison = raison + "| Bannis par "+ message.author.username;
        await the_member.ban(raison);
        message.channel.send(`${the_member.user.username} a été bannis avec les raison suivantes:: \`${raison}\``)
    }
    if (args[0].toLowerCase() === prefix+"kick") {
        if (!message.member.hasPermission('KICK_MEMBERS')) return message.reply(`:x: tu n'as pas la permission d'expulser.`)
        var the_member = message.mentions.members.first();
        if (!the_member) return message.reply(`:x: Tu dois mentionner la personne a kick`)
        if(!the_member.kickable) return message.channel.send`:x: Ce membre ne peut pas être exclus, verifiez mes permission ou la hierarchie des roles`
        let raison = args.slice(1).join(' ');
        if(!raison) raison = "Pas de raison";
        raison = raison + "| Kick par "+ message.author.username;
        await the_member.kick(raison);
        message.channel.send(`${the_member.user.username} a été exclu avec les raison suivantes:: \`${raison}\``)
    }
    if (args[0].toLowerCase() === prefix+"say") {
        let cont = args.slice(1).join(' ');
        if (!cont) return message.channel.send(':x: Tu dois saisir un texte a dire')
        message.channel.send(cont)
    }
    if (args[0].toLowerCase() === prefix+"mute") {
        let tomute = message.guild.member(message.mentions.users.first());
        if (!tomute) return message.channel.send(`:x: Tu dois mentionner une personne a mute`)
        let raison = args.slice(1).join(' ');
        if(!raison) raison = "Pas de raison";
        let role = message.guild.roles.cache.find(r => r.name === "muted")
        if (!role) return message.channel.send(`:x: Je n'arrive pas a trouver le role appelé \`muted\``)
        if (tomute.roles.cache.has(role.id))  return message.channel.send('La personne est deja mute')
        raison = raison + "| Mute par "+ message.author.username;
        tomute.send(`Vous venez d'être mute sur le serveur ${message.guild.name} pour les raisons suivantes: ${raison}`);
        tomute.roles.add(role.id)
        message.channel.send(cont)
    }
    if (args[0].toLowerCase() === prefix+"unmute") {
        let tomute = message.guild.member(message.mentions.users.first());
        if (!tomute) return message.channel.send(`:x: Tu dois mentionner une personne a mute`)
        let role = message.guild.roles.cache.find(r => r.name === "muted")
        if (!role) return message.channel.send(`:x: Je n'arrive pas a trouver le role appelé \`muted\``)
        if (!tomute.roles.cache.has(role.id))  return message.channel.send('La personne n\'est pas mute');
        tomute.send(`Vous venez d'être demute sur le serveur ${message.guild.name} par ${message.author.user.username}`);
        tomute.roles.remove(role.id)
        message.channel.send('L\'utilisateur est demute')
    }
    if (args[0].toLowerCase() === prefix+"userinfo") {
        let member = message.guild.member(message.mentions.users.first());
        let avatar = member.displayAvatarURL({ dynamic: true, format: 'png', size: 1024})
        message.channel.send(new Discord.MessageEmbed()
            .setAuthor('UserInfo')
            .setThumbnail(avatar)
            .setColor('RANDOM')
            .setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024}))
            .addField("Nom:", member.user.username )
            .addField("Discriminant", member.user.discriminator)
            .addField("Id:", member.user.id)
        )

    }
})

client.login(token)