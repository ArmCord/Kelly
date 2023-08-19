import { client, openai } from "./index.js"
var prompt = "I want you to act as a linux terminal. I will type commands and you will reply with what the terminal should show. I want you to only reply with the terminal output inside one unique code block (for example ```ls```), and nothing else. do not write explanations. do not type commands unless I instruct you to do so. When I need to tell you something in English, I will do so by putting text inside curly brackets {like this}. My first command is pwd"
client.on("messageCreate", async function (message) {
    if (message.author.bot) return;
    if (message.channelId == "1142486655765332060") {
        if (message.content.startsWith("-set")) {
            prompt = message.content.replace("-set ", "").trim()
            message.reply("Prompt set to: " + prompt)
        }
        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: prompt }, { role: "user", content: message.content }],
        });
        var response = chatCompletion.data.choices[0].message.content
        message.reply(response)
    }
})