const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const apiKey = 'zu-a99687fa277820012d992357f3b35416';
const baseUrl = 'https://zukijourney.xyzbot.net/v1';

client.once('ready', () => {
    console.log(`Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.content === '!modelos') {
        try {
            const response = await axios.get(`${baseUrl}/models`, {
                headers: { 'Authorization': `Bearer ${apiKey}` }
            });
            const models = response.data;
            message.channel.send(`Modelos disponibles: ${JSON.stringify(models, null, 2)}`);
        } catch (error) {
            console.error(error);
            message.channel.send('No se pudieron obtener los modelos.');
        }
    }

    if (message.content.startsWith('!info_modelo')) {
        const modelId = message.content.split(' ')[1];
        if (!modelId) {
            message.channel.send('Por favor, proporciona un ID de modelo.');
            return;
        }

        try {
            const response = await axios.get(`${baseUrl}/models/${modelId}`, {
                headers: { 'Authorization': `Bearer ${apiKey}` }
            });
            const modelInfo = response.data;
            message.channel.send(`Información del modelo: ${JSON.stringify(modelInfo, null, 2)}`);
        } catch (error) {
            console.error(error);
            message.channel.send('No se pudo obtener la información del modelo.');
        }
    }

    if (message.content === '!help') {
        const helpMessage = `
        **Comandos del Bot**:
        \`!modelos\` - Muestra la lista de modelos disponibles.
        \`!info_modelo <model_id>\` - Muestra información sobre un modelo específico.
        \`!gpt <mensaje>\` - Envia un mensaje al modelo de lenguaje GPT y recibe una respuesta.
        \`!help\` - Muestra este mensaje de ayuda.
        `;
        message.channel.send(helpMessage);
    }

    if (message.content.startsWith('!gpt')) {
        const userMessage = message.content.replace('!gpt ', '');
        try {
            const response = await axios.post(`${baseUrl}/chat`, {
                prompt: userMessage,
                max_tokens: 100
            }, {
                headers: { 'Authorization': `Bearer ${apiKey}` }
            });
            const gptResponse = response.data.choices[0].text;
            message.channel.send(gptResponse);
        } catch (error) {
            console.error(error);
            message.channel.send('No se pudo obtener una respuesta del modelo.');
        }
    }
});

client.login('MTI0MzkyMzMyMzkyNzM5NjM5Mw.GAgt7b.zslX0C8Y0uNX2Rr6QVR6MN4o0fqXod3GbM4G8o');

app.get('/', (req, res) => {
    res.send('Bot de Discord está ejecutándose.');
});

app.listen(port, () => {
    console.log(`Servidor de backend escuchando en el puerto ${port}`);
});
