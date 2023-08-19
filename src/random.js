import { client, openai } from "./index.js"
import fs from "fs";
const lastMessages = [];
client.on("messageCreate", async function (message) {
    if (message.author.bot) return;
    if (lastMessages.length > 30) {
        lastMessages.length = 0;
    }
    if (message.channelId == "870980137007607858") { // only in general chat
        if (message.author.id == client.user.id) {
            lastMessages.push({ role: "assistant", content: message.content })
        } else {
            lastMessages.push({ role: "user", content: message.author.tag + ": " + message.content })
        }
        if (lastMessages.length > Math.floor(Math.random() * 30) + 5 ?? message.reference.author.id == client.user.id ?? message.mentions.has(client.user)) {
            console.log("random event")
            message.channel.sendTyping();
            lastMessages.unshift({ role: "system", content: fs.readFileSync("./src/randomPrompt.txt", "utf-8")});
            const chatCompletion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: lastMessages,
            });
            var response = chatCompletion.data.choices[0].message.content
            message.channel.send(response)
        }
    }
})