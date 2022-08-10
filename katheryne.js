require('dotenv').config()
const Discord = require('discord.js')
const KatheryneClient = require('./client/katheryne.client')

const katheryne = new KatheryneClient()

const OfficialServer = "848169570954641438"
const Graey = "851062978416869377"

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

})



katheryne.on(`guildMemberRemove`, async member => {
    const user = member.user
    if(user.bot) return

    katheryne.users.cache.get(Graey).send({ content: `**${user.username}** leaves the server~`})
})