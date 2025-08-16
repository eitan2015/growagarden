const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const TOKEN = 'MTQwNjM3NjU4NjY1NTMwMTcwMw.GtlPjj.vp-PRI_VcJXO8SQLtKY6fyrC-5__GYFMaulWMk'; // NOT  a discord token
const CHANNEL_ID = '1406355508494860339'; // Discord channel to post usernames
const ROBLOX_TOKEN = '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_CAEaAhAB.E5AF1B3BA41487F81CA38AE550318160A24AD8D81F2F4524282BE81877EBF4F3B2C94801364AAA225F06ED9C6F9880DA356AC14572D0138A1E05BDEA2B83690B7D2D0F94EB29EF2F49776F2E96DDB01C231A8231AB8086839AEDFD598F925147541758098AD0FFC61CA4FA6628C4107E6411CACE16CA3D5422BD79D0DCDE5DB65289EE45056798D80E4D45DD4131789CE8E0837EBCA5AB66AB47F0210121937AF3DA44F2C62EA9CDB0170992D27137754F2EA32664356AC0B3FA5BD07987B93785DCEC233A69D7E20593C1CC93BF5A35E8DD148A45150DE8FD411828125D8BA423CA7C7182B5B55CAF3CD6E705E3F7B90001E1FD7BA0006E863EDA265B4A04C5ADCD1CDA8A5116D43CBA2AC7B1B2C55892869FBA03E81DCB02920764C2890530123695E7FA153C6EB561A7CB0D52DB2F2149C6EC168931BC59E02B035C9C324F74ACFF095745993AA7B8997E3F350BC059629C17428F0D048EFD7D226C24F6E94F901C67E3724AEC8A26C0999661AA9163411B5B33D1268470F0E241EDE360A8AF217AB81E854CB31833FDFBC6AA92568A645D537C1FBCC01207BE78EC439CE20A4BF7679A4D63C2988157D3B0288DEAA6CF25B2405B9FAF032ECC70B455C7E4BEA7879C9AB045B6FD65190C27EB7EFCBF989914F019155CEDB06736D15980D9A5E8A0EED714FEBDDBFFEBDF87DFE93CCF9DEB77831C31810594B3FCEC90994AA78A0E0AF17B2CCF837E422DAD54C44A53406E07852DCF9F17CF71583BA4BA9662C8652D5CABA70829B22F1F0E82693A78A3F8FC645871F0188942A413B7170B4B65CEF5F1E58F35771CF861D8CC73177770046CEFA53F81A3AC144CB7079568173127CFB5D41D207637BE5A40FA76C261B7C4E881F1264FCF6C593B32CAC4796EB0F808693B7B5A0736DA18169A0F9ECC7B0010D0973C09555D367715DEE6060482ED9B6C44A9318A1692F555C014DBFE01934691167B04856C79E8D6E2C8311A8DEFFAF3A17C54FF9D62524682C0CFCC55600FBF336385BA63AC459DC3C4A08755BDFC33B09187435AA8B8A1A61BDECC686DC9A4009CD2DC6286ED31F75302CD2171836C7B20B31C6EF9B99E132DA7D3222E43EF25E793F51DD7C2234A1108A9DCC1E511B076CB5E21317EB026A8986893E4D970040CAAC92EFB5EB46174ECEBD08DA6A2ACF9E6768C589E4CBFDCB1568B5ED197C74A312E3FF578E79F82A797ACCAF7'; // Optional, for authenticated requests

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
