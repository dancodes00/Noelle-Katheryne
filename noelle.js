require('dotenv').config()

const Canvas = require('canvas')
Canvas.registerFont('./fonts/Uni Sans Regular.ttf', { family: 'Uni Sans Regular' })

const Discord = require('discord.js')
const NoelleClient = require('./client/noelle.client')

const noelle = new NoelleClient()

const OfficialServer = "848169570954641438"
const Graey = "851062978416869377"

noelle.on('guildMemberUpdate', async (oldMember, newMember) => {
    try{
        const oldRoles = oldMember.roles.cache,
          newRoles = newMember.roles.cache;

        const oldHas = oldRoles.has('870746490451148858'), // farside of the moon
            newHas = newRoles.has('870746490451148858');

        if (!oldHas && newHas) return await welcomeAtarashiNakama(newMember)
    } catch(e) {
        console.log(e)
    }
})

noelle.on('ready', async () => {
    noelle.user.setPresence(
        { 
            activity: { 
                name: 'your orders~', //▶︎Henceforth
                type: 'LISTENING',
            },
            status: 'online'
        }
    )
})

noelle.login(process.env.Noelle)

async function welcomeAtarashiNakama(member){
    try{
        const user = member.user
        const GUILD = noelle.guilds.cache.get('848169570954641438')

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
        await noelle.users.cache.get(Graey).send({ content: `Failed to welcome users: \`\`\`${e}\`\`\`` })
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