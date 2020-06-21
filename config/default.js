module.exports = {
    token: 'KEEP_YOUR_TOKEN_SECRET',
    languages: {
        locales: ['en', 'ja'],
        default: 'en',
        channels: {
            '368751492963893248': 'ja'
        }
    },
    swearRegexes: [
        {
            regex: "([s5ｓ]+(ｈ|h|\\|\\-\\|n)+[ｉi1|]+[ｔt7]+|[ｋk]+[uｕ]+[ｓs5]+[ｏo0]+|クソ|ｸｿ|シット|しっと)+(([ｂb8]|\\|3)+[ｏo0]+[wｗ]+|弓|ボウ|ぼう)+",
            stripWhitespace: true
        },
        {
            regex: "(?<!mi)[s\\$5ｓ]+(ｈ|h|\\|\\-\\|n)+[ｉi1|]+[ｔt7]+(?!(tah|tim|ake))",
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
    moderationLogsRoom: '468053291717361664',
    deletedLogsRoom: '615737464643911680',
    games: {
        aliases: {
            'hcf': 'hcfactions',
            'anni': 'annihilation',
            'minetheftauto': 'mta',
            'gc': 'ghostcraft',
            'ghost': 'ghostcraft',
            'mine theft auto': 'mta',
            'death by void': 'dbv',
            'when in rogue': 'wir'
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
            'mta': 'Mine Theft Auto',
            'ghostcraft': 'GhostCraft',
            'lobby': 'Lobby',
            'wir': 'When in Rogue'
        },
        rooms: {
            '228706232133746688': 'annihilation',
            '228706390883958784': 'dbv',
            '228706280951382016': 'gg',
            '368735807345000449': 'ghostcraft',
            '228706314233184256': 'mta',
            '228706218351394816': 'minez',
            '228706292913537027': 'slaughter',
            '228706345807904768': 'smash',
            '703452304493510757': 'wir'
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
        'Minecraft Forum': 'http://minecraftforum.net/servers/160-shotbow',
        'MinecraftServers.org': 'http://minecraftservers.org/server/267066'
    },
    messageRemoveDelay: 60000,
    pingspam: {
        threshold: 5,
        timespan: 30000,
        cooldown: 60000
    }
}
