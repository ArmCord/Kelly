import { client, openai } from "./index.js"
import fs from "fs";
client.on("messageCreate", async function (message) {
    if (message.author.bot) return;
    if (message.mentions.has(client.user) && message.channelId !== "1142418048607854714") { // direct question
        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: fs.readFileSync("./src/directQuestionPrompt.txt", "utf-8").replace("<discordid>", message.author.id) }, { role: "user", content: message.content }],
        });
        var response = chatCompletion.data.choices[0].message.content
        message.reply(response)
    }
})