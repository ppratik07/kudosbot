import express from 'express';
import { BotFrameworkAdapter } from 'botbuilder';
import { config } from 'dotenv';
import { KudosBot } from './bot/kudosBot';

config();

const adapter = new BotFrameworkAdapter({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD,
});

const bot = new KudosBot();

const app = express();
app.use(express.json());

app.post('/api/messages', (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    await bot.run(context);
  });
});

const port = process.env.PORT || 3978;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});