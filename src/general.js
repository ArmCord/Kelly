import fs from "fs";
import { client, openai } from "./index.js"
const lastMessages = [];
async function setupArray(message) {
    let channel = client.channels.cache.get("1142418048607854714").messages;
    await channel.fetch({ limit: 15 }).then(messages => {
        messages.forEach(async pmessage => {
            if (!pmessage.content.startsWith("//") && pmessage.content != message.content) {
                if (pmessage.author.id == message.author.id) { // only get context from one user
                    lastMessages.push({ role: "user", content: pmessage.content })
                }
                if (pmessage.author.id == client.user.id) {
                    let repliedTo = await pmessage.fetchReference()
                    if (repliedTo.author.id == message.author.id) { // get context from bot responses too
                        lastMessages.push({ role: "assistant", content: pmessage.content })
                    }
                }
            }
        })
    })
        .catch(console.error);
    lastMessages.unshift({ role: "system", content: fs.readFileSync("./src/generalPrompt.txt", "utf-8").replace("<discordid>", message.author.id) });
}
client.on("messageCreate", async function (message) {
    if (message.author.bot) return;
    if (message.channelId == "1142757183335964732") {
        if (message.content.startsWith("//")) return;
        message.channel.sendTyping();
        await setupArray(message)
        lastMessages.push({ role: "user", content: message.content })
        console.log(lastMessages)
        try {
            const chatCompletion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                max_tokens: 400,
                messages: lastMessages,
            });
            var response = chatCompletion.data.choices[0].message.content
            message.reply(response)
        } catch (error) {
            message.reply("An error occured, please try again later")
        }
        lastMessages.length = 0;
    }
});