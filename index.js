require('dotenv').config()

const { Telegraf } = require('telegraf');
const { getNumberOfWeek } = require('./utils');

const bot = new Telegraf(process.env.BOT_TOKEN);
const PORT = process.env.PORT;
const URL = process.env.HEROKU_URL;

bot.telegram.setWebhook(`${URL}/bot${process.env.BOT_TOKEN}`);
bot.startWebhook(`/bot${process.env.BOT_TOKEN}`, null, PORT);

const weeks = [
    'Nastassia',
    'Olia + Pasha',
    'Volodya + Ira',
    'Chechen + Viktar',
    'Anton + Pan'
];

bot.start(ctx => ctx.reply('Welcome'));

bot.command('pyatnichnaya', ctx => {
    const key = getNumberOfWeek() % weeks.length;

    return ctx.reply(weeks[key]);
});

bot.command('raspisanie', ctx => {
    return ctx.reply(weeks.join('\n'));
});

bot.command('beer', ctx => ctx.reply('🍻'));

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'))
