require('dotenv').config()

const Canvas = require('canvas')
Canvas.registerFont('./fonts/Uni Sans Regular.ttf', { family: 'Uni Sans Regular' })

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

const GAME_UPDATES = [
    {
        emoji: '895638285647495218',
        role: '909380401355718737'
    },
    {
        emoji: '872048058966351913',
        role: '909380210703618078'
    },
    {
        emoji: '872048059545169920',
        role: '909380571812216862'
    },
    {
        emoji: '872048060002353152',
        role: '909380766440501288'
    },
    {
        emoji: '872048058945376257',
        role: '909380988285616129'
    },
    {
        emoji: '916546698480873534',
        role: '916546962755563540'
    },
    {
        emoji: '916546495879213056',
        role: '916547312061407312'
    },
    {
        emoji: '872048059238973471',
        role: '926823487023226890'
    },
    {
        emoji: '926833395235950592',
        role: '926824113933283328'
    },
    {
        emoji: '927080870500786186',
        role: '927080949886365747'
    }
]

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
        const account = katheryne.users.cache.get(user.id) 

        return GUILD.members.cache.get(account.id).roles.add("870746490451148858")
    } else if (msg.channel.id === `870934841263288330`){ // self role

        if(msg.id === `872085611757047848`){
            const GAMES = await AtarashiGemu.find()

            const GUILD = katheryne.guilds.cache.get(OfficialServer)

            const GAME = GAMES.find(data => data.emoji === emoji.id)

            if(!GAME) return reaction.users.remove(user.id)
            
            GUILD.members.cache.get(user.id).roles.add(GAME.role)
        } 
    }
})