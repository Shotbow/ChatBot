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
            'wasted_sandbox': 'Wasted',
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
            'wir': 'https://shotbow.net/forum/forums/wheninrogue/',
            'warband': 'https://shotbow.net/forum/forums/warband/',
            'minerproblems': 'https://shotbow.net/forum/forums/miner-problems/',
            'wasted_sandbox': 'https://shotbow.net/forum/forums/wasted/'
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
        types: {
            'minez': {
                description: "Support for MineZ: Stuck in a block; Broken dungeons; Death due to cheaters, bugs, and broken dungeons.",
                roles: [{ id: '618856455206076417', ping: true }],
                logRoom: '468053291717361664',
                autoClose: {
                    warning: ONE_DAY_IN_MS,
                    closing: 2 * ONE_DAY_IN_MS
                }
            },
            'abuse': {
                description: "Open a private chat with the leadership team to report staff abuse.",
                roles: [
                    { id: '440505209580683274', ping: true },
                    { id: '441611057878794240', ping: true }
                ],
                logRoom: '748963030888349736',
                autoClose: {
                    warning: ONE_DAY_IN_MS,
                    closing: 2 * ONE_DAY_IN_MS
                }
            },
            'spamdm': {
                description: "Open a private chat with Moderators to report spam happening over DMs",
                roles: [{ id: "258257313448722434", ping: true }],
                logRoom: '468053291717361664',
            },
            'bug': {
                description: "Open a support channel to report a bug to the development team.",
                roles: [
                    { id: '223821346763833344', ping: false },
                    { id: '815871997871128576', ping: true }
                ],
                logRoom: '468053291717361664',
                rules: "Please describe the bug and provide as much detail as you can. You can answer the questions below as needed:\n\n**A) Where were you on the network** *(e.g. Lobby, Anni Lobby, MineZ, etc.)*:\n**B) What client were you using** *(e.g. LunarClient) and which version (e.g. 1.16.5)*:\n**C) Preconditions** *(what do you need to recreate the bug, e.g. be Acrobat class on Annihilation)*:\n**D) Recreation steps** *(in detail, what do you need to do to make the bug happen)*:\n**E) What was supposed to happen** *(if the bug wasn't there)*:\n**F) What actually happened** *(because of the bug)*:\n**G) Provide any supplemental information**:\n\nWhile we aim to get back to you as soon as possible, it may take time for us to verify the bug so **please don't ping staff about the issue**. In the meantime, please keep an eye on this support room as we may need to request more details."
            }
        }
    },
    nitro: {
        channel: '585535847110017028',
        manualUpgradeStaffer: 'Navarr'
    },
    messageRemoveDelay: 60000,
    pingspam: {
        threshold: 5,
        timespan: 30000,
        cooldown: 60000,
        ban: true
    },
    notificationRoles: {
        warband: '792966769475321896',
        minez: '793166203782692884',
        wir: '793166266096418837'
    }
}
