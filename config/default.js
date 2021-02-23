const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const ONE_MINUTE_IN_MS = 60 * 1000;

module.exports = {
    token: 'KEEP_YOUR_TOKEN_SECRET', /* Do not remove this line */
    languages: {
        locales: ['en', 'ja', 'es'],
        default: 'en',
        channels: {
            '368751492963893248': 'ja',
            '800562396275540019': 'es'
        }
    },
    swearRegexes: [
        {
            regex: "([s5ｓ]+(ｈ|h|\\|\\-\\|n)+[ｉi1|]+[ｔt7]+|[ｋk]+[uｕ]+[ｓs5]+[ｏo0]+|クソ|ｸｿ|シット|しっと)+(([ｂb8]|\\|3)+[ｏo0]+[wｗ]+|弓|ボウ|ぼう)+",
            stripWhitespace: true
        },
        {
            regex: "(?<!mi)[s\\$5ｓ]+(ｈ|h|\\|\\-\\|n)+[ｉi1|]+[ｔt7]+(?!(tah|tim|ake|ai|akunai|a|sureishimasu|sureisuru|sureishimashita|sureishita))",
            stripWhitespace: false
        },
        {
            regex: "[fｆ]+[uｕ]+[cｃ]+[ｋk]+",
            stripWhitespace: false
        }
    ],
    zaplist: ['173556767383355392'],
    administratorRoles: {
        'Moderator': '258257313448722434',
        'Administrator': '223821346763833344',
        'Server Administrator': '223820787784744960',
        'Network Leadership': '440505209580683274',
        'Network Owner': '441611057878794240'
    },
    mutedRole: '468154703138521088',
    moderationLogsRoom: '468053291717361664',
    deletedLogsRoom: '615737464643911680',
    trickcordTreatRoom: '766318346424680460',
    trickcordTreatDeleteTime: ONE_MINUTE_IN_MS,
    games: {
        aliases: {
            'hcf': 'hcfactions',
            'anni': 'annihilation',
            'minetheftauto': 'mta',
            'gc': 'ghostcraft',
            'ghost': 'ghostcraft',
            'mine theft auto': 'mta',
            'death by void': 'dbv',
            'when in rogue': 'wir',
            'wasted': 'wasted_sandbox',
            'miner problems': 'minerproblems',
            'miner': 'minerproblems',
            'mp': 'minerproblems'
        },
        names: {
            'all': 'Shotbow',
            'annihilation': 'Annihilation',
            'minez': 'MineZ',
            'hcfactions': 'HCFactions',
            'dbv': 'Death by Void',
            'smash': 'SMASH',
            'slaughter': 'Slaughter',
            'gg': 'GG',
            'minerproblems': 'Miner Problems',
            'mta': 'Mine Theft Auto',
            'ghostcraft': 'GhostCraft',
            'lobby': 'Lobby',
            'wir': 'When in Rogue',
            'wasted': 'Wasted',
            'warband': 'Warband'
        },
        rooms: {
            '228706232133746688': 'annihilation',
            '228706390883958784': 'dbv',
            '228706280951382016': 'gg',
            '368735807345000449': 'ghostcraft',
            '228706314233184256': 'mta',
            '772623043473702912': 'minerproblems',
            '228706218351394816': 'minez',
            '228706292913537027': 'slaughter',
            '228706345807904768': 'smash',
            '703452304493510757': 'wir',
            '812523519170314270': 'wasted_sandbox',
            '764945691348434976': 'warband'
        },
        forums: {
            'all': 'https://shotbow.net/forums/',
            'annihilation': 'https://shotbow.net/forum/forums/annihilation/',
            'minez': 'https://shotbow.net/forum/forums/minez/',
            'hcfactions': 'https://www.reddit.com/r/hcfactions/',
            'dbv': 'https://shotbow.net/forum/forums/dbv/',
            'smash': 'https://shotbow.net/forum/forums/smash/',
            'slaughter': 'https://shotbow.net/forum/forums/slaughter/',
            'gg': 'https://shotbow.net/forum/forums/gg/',
            'mta': 'https://shotbow.net/forum/forums/minetheftauto/',
            'ghostcraft': 'https://shotbow.net/forum/forums/ghostcraft/',
            'wir': 'https://shotbow.net/forum/forums/wheninrogue/'
        }
    },
    profiles: {
        'Facebook': 'https://facebook.com/TheShotbowNetwork',
        'Twitter': 'https://twitter.com/ShotbowNetwork',
        'Google+': 'https://google.com/+TheShotbowNetwork',
        'YouTube': 'https://gaming.youtube.com/user/ShotBowNetwork',
        'Player.me': 'https://player.me/?invite=shotbow',
        'Instagram': 'https://instagram.com/shotbownetworkmc/',
        'Tumblr': 'http://tumblr.shotbow.net/',
        'Youku': 'http://i.youku.com/shotbow'
    },
    votes: {
        'Planet Minecraft': 'http://www.planetminecraft.com/server/minez-1398788/',
        'NameMC': 'https://namemc.com/server/shotbow.net?q=Shotbow.net',
        'MinecraftServers.org': 'http://minecraftservers.org/server/267066',
        'Minecraft Server List': 'https://minecraft-server-list.com/server/419065/',
        'TopG': 'https://topg.org/Minecraft/server-608505',
        'Minecraft-MP': 'https://minecraft-mp.com/server-s260086',
        'Minecraft Servers': 'https://minecraft-server.net/details/Shotbow/'
    },
    support: {
        category: '740654285154549901',
        automaticDeletion: 3600000,
        types: {
            'minez': {
                description: "Support for MineZ: Stuck in a block; Broken dungeons; Death due to cheaters, bugs, and broken dungeons.",
                roles: ['618856455206076417']
            },
            'abuse': {
                description: "Open a private chat with the leadership team to report staff abuse.",
                roles: ['440505209580683274', '441611057878794240'],
                logRoom: '748963030888349736'
            }
        },
        autoClose: {
            warning: ONE_DAY_IN_MS,
            closing: 2 * ONE_DAY_IN_MS
        }
    },
    nitro: {
        channel: '585535847110017028',
        manualUpgradeStaffer: 'Navarr'
    },
    supportCategory: 'Support',
    messageRemoveDelay: 60000,
    pingspam: {
        threshold: 5,
        timespan: 30000,
        cooldown: 60000
    },
    notificationRoles: {
        warband: '792966769475321896',
        minez: '793166203782692884',
        wir: '793166266096418837'
    }
}
