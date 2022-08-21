require('dotenv').config()

const Canvas = require('canvas')
Canvas.registerFont('./fonts/Uni Sans Regular.ttf', { family: 'Uni Sans Regular' })

const Discord = require('discord.js')
const KatheryneClient = require('./client/katheryne.client')

const katheryne = new KatheryneClient()

const OfficialServer = "848169570954641438"
const Graey = "851062978416869377"


const GAME_ROLE = [
    {
        role: "926824113933283328",
        emoji: "926833395235950592"
    },
    {  
        role: "909380210703618078",
        emoji: "872048058966351913"
    },
    {  
        role: "916547312061407312",
        emoji: "916546495879213056"
    },
    {  
        role: "909380571812216862",
        emoji: "872048059545169920"
    },
    {  
        role: "1010732522805669969",
        emoji: "1010732307759497299"
    },
    {  
        role: "909380988285616129",
        emoji: "872048058945376257"
    },
]

katheryne.login(process.env.KATHERYNE)

katheryne.on('ready', async () => {
    katheryne.user.setPresence(
        { 
            activities: [
                { 
                name: `${katheryne.guilds.cache.get(OfficialServer).name} server`, //▶︎Henceforth
                type: 'WATCHING',
                }
            ],
            status: 'online'
        }
    )

    const GUILD = katheryne.guilds.cache.get(OfficialServer)

    GUILD.channels.cache.get('855318678991011840').messages.fetch('869505056096022538') // Rules - Main
    GUILD.channels.cache.get('855318678991011840').messages.fetch('869505416839700540') // Accept - Main
    GUILD.channels.cache.get('870934841263288330').messages.fetch('872085611757047848') // Self Roles - Main
    
    if(true) applyGameUpdates()
})

katheryne.on(`guildMemberRemove`, async member => {
    const user = member.user
    if(user.bot) return

    katheryne.users.cache.get(Graey).send({ content: `**${user.username}** leaves the server~`})
})

katheryne.on('messageReactionAdd', async (reaction, user) => {
    let msg = reaction.message, emoji = reaction.emoji
    const GUILD = katheryne.guilds.cache.get(OfficialServer)
    if(msg.channel.type === 'dm') return

    // Check for rules react with verify_teal in main & support
    if(msg.channel.id === `855318678991011840`){ // rules

        //** Restrict bot reacts */
        //** Prevent react from any other messages beside the registered message */
        //** Remove any other reaction except verify_teal */
        if(msg.author.bot) return
        if(msg.id !== `869505416839700540`) return reaction.users.remove(user.id)
        if(emoji.name !== `verify_teal`) return reaction.users.remove(user.id)

        const member = GUILD.members.cache.get(user.id)

        return member.roles.add("870746490451148858").then(async () => {
            await welcomeAtarashiNakama(member)
        })
    } else if (msg.channel.id === `870934841263288330`){ // self role

        if(msg.id === `872085611757047848`){
            const GUILD = katheryne.guilds.cache.get(OfficialServer)

            const GAME = GAME_ROLE.find(data => data.emoji === emoji.id)

            if(!GAME) return reaction.users.remove(user.id)
            
            GUILD.members.cache.get(user.id).roles.add(GAME.role)
        } 
    }
})

katheryne.on('messageReactionRemove', async (reaction, user) => {
    let msg = reaction.message, emoji = reaction.emoji

    if(msg.channel.id === `870934841263288330`){
        if(msg.id === `872085611757047848`){

            const GUILD = katheryne.guilds.cache.get(OfficialServer)

            const GAME = GAME_ROLE.find(data => data.emoji === emoji.id)

            if(!GAME) return
            
            GUILD.members.cache.get(user.id).roles.remove(GAME.role)
        }
    }

})

async function welcomeAtarashiNakama(member){
    try{
        const user = member.user
        const GUILD = katheryne.guilds.cache.get(OfficialServer)

        const random = Math.floor(Math.random() * 19) + 1

        const canvas = Canvas.createCanvas(1100, 500)
        const context = canvas.getContext('2d')
        const background = await Canvas.loadImage(`./cards/${random}.jpg`)

        const adjusted_width = canvas.width
        const adjusted_height = (canvas.width / background.width) * background.height

        context.drawImage(background, 0, -Math.abs(canvas.height - adjusted_height), adjusted_width, adjusted_height)

        const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'png', size: 256, dynamic: true }))

        const x = 30
        const y = (canvas.height/2)-(avatar.height/2)
        const size = Math.min(avatar.width, avatar.height)

        context.font = applyText(canvas, user.tag)
        context.fillStyle = 'white'
        
        const text_size = context.measureText(user.tag)
        const text_height = text_size.actualBoundingBoxAscent + text_size.actualBoundingBoxDescent
        const text_x = 25 + x + avatar.width
        const text_y = ((canvas.height/2)-(text_height/2))+20
        context.strokeStyle = '#38363d'
        context.lineWidth = 5
        context.strokeText(user.tag, text_x, text_y)
        context.fillText(user.tag, text_x, text_y)

        context.font = `20px Uni Sans Regular`
        context.fillStyle = 'white'
        const discordText = context.measureText(`Discord ID: ${user.id}`)
        const discordText_height = discordText.actualBoundingBoxAscent + discordText.actualBoundingBoxDescent
        context.strokeStyle = '#38363d'
        context.lineWidth = 3
        context.strokeText(`Discord ID: ${user.id}`, text_x, text_y + text_height)
        context.fillText(`Discord ID: ${user.id}`, text_x, text_y + text_height)
        // context.strokeText(`αℓтяια Key: ${atarashi.user.id}`, text_x, text_y + text_height+discordText_height+10)
        // context.fillText(`αℓтяια Key: ${atarashi.user.id}`, text_x, text_y + text_height+discordText_height+10)

        context.beginPath()
        context.arc(x + (avatar.width/2), y + (avatar.height/2), size * 0.5, 0, 2 * Math.PI)
        context.closePath()
        context.clip()
        context.drawImage(avatar, x, y, avatar.width, avatar.height)

        context.beginPath()
        context.arc(x + (avatar.width/2), y + (avatar.height/2), size * 0.5, 0, 2 * Math.PI)
        context.strokeStyle = 'white'
        context.lineWidth = 10
        context.stroke()
        context.closePath()

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `welcome-${user.username}.png`)

        await GUILD.channels.cache.get("870747129499500595").send({
            content: `Hi ${user.toString()}, welcome to the **${GUILD.name}** server.\nWe're so glad to have you here. Be sure to check out the <#870934841263288330>, and please, Enjoy your stay.`,
            files: [attachment] 
        }).then(msg => {
            msg.react('👋')
        })
    } catch(e){
        console.log(e)
        await katheryne.users.cache.get(Graey).send({ content: `Failed to welcome users: \`\`\`${e}\`\`\`` })
    }
}

function applyText(canvas, text){
	const context = canvas.getContext('2d')
	let fontSize = 70;

	do {
		context.font = `${fontSize -= 10}px Uni Sans Regular`;
	} while (context.measureText(text).width > canvas.width - 375)

	return context.font;
}

async function applyGameUpdates(){
    const GUILD = katheryne.guilds.cache.get(OfficialServer)
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const d = new Date(new Date().toLocaleString('en-US',{ timeZone: 'Asia/Manila' }))

    const GAME_LIST = GAME_ROLE.map(i => {
        const role = GUILD.roles.cache.find(role => role.id === i.role)
        const emoji = katheryne.emojis.cache.find(emoji => emoji.id === i.emoji) 
        return `${emoji} ${role.name} → ${role}`
    })

    const embed = {
        title: `🎮️ Games`,
        color: 3092790,
        description: `To see specific game categories please react with the emotes below based on your preferences.\n\n**Note**:\n - You can react to multiple games. Reacting again will remove your role.\n - Do **NOT** react to a game that you don't have or haven't even played yet.`,
        fields: [
            {
                name: `Options`,
                value: GAME_LIST.join('\n')
            }
        ],
        footer: {
            icon_url: katheryne.users.cache.get(Graey).displayAvatarURL({ dynamic: true }),
            text: `Updated • ${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
        }
    }

    katheryne.guilds.cache.get(OfficialServer).channels.cache.get('870934841263288330').messages.fetch('872085611757047848')
    .then(async msg => {
        await msg.edit({ embeds: [embed] })
        GAME_ROLE.map(async i => {
            msg.react(i.emoji)
        })   
    })
}