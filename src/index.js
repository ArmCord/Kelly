import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()
const config = new Configuration({ apiKey: process.env.AITOKEN });
export const openai = new OpenAIApi(config)

export const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.on("ready", function () {
    console.log("Ready");
    import("./support.js")
    import("./directQuestion.js")
    import("./playground.js")
    //import("./eval.js")
})
client.login(process.env.TOKEN);