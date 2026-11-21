const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const TOKEN = '-'; // NOT  a discord token
const CHANNEL_ID = '1406355508494860339'; // Discord channel to post usernames
const ROBLOX_TOKEN = ''; // Optional, for authenticated requests

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Generate random username of 3–5 characters
function generateRandomUsername() {
    const length = Math.floor(Math.random() * 3) + 3; // 3–5 characters
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let username = '';
    for (let i = 0; i < length; i++) {
        username += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return username;
}

// Check username availability
async function checkUsername(username) {
    try {
        const url = `https://auth.roblox.com/v1/usernames/validate?Username=${encodeURIComponent(username)}&Birthday=2000-01-01`;
        const headers = { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' };
        if (ROBLOX_TOKEN) headers['Cookie'] = `.ROBLOSECURITY=${ROBLOX_TOKEN}`;

        const res = await axios.get(url, { headers });
        const code = res.data.code;

        if (code === 0) return 'VALID';
        if (code === 1) return 'TAKEN';
        if (code === 2) return 'CENSORED';
        return 'SKIPPED';
    } catch (err) {
        console.error(`Error checking ${username}:`, err.message);
        return 'ERROR';
    }
}

// Post only VALID usernames to Discord
async function postRandomUsernames() {
    try {
        const channel = await client.channels.fetch(CHANNEL_ID);
        const count = Math.floor(Math.random() * 5) + 1; // 1–5 usernames per interval

        for (let i = 0; i < count; i++) {
            const username = generateRandomUsername();
            const status = await checkUsername(username);

            if (status === 'VALID') {
                await channel.send(`Rare Roblox username available: \`${username}\``);
                console.log(`VALID: ${username}`);
            } else {
                console.log(`${status}: ${username}`); // log but do not send
            }

            await new Promise(r => setTimeout(r, 500)); // small delay
        }
    } catch (err) {
        console.error('Discord error:', err.message);
    }
}

// Bot ready
client.once('ready', () => {
    console.log(`${client.user.tag} is online!`);
    setInterval(postRandomUsernames, 15000); // every 15 seconds
});

client.login(TOKEN);
