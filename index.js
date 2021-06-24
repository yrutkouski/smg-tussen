require('dotenv').config()

const {Telegraf} = require('telegraf');
const {Client} = require('pg');

const {getNumberOfWeek} = require('./utils');
const {db} = require('./db');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.telegram.setWebhook(`${process.env.HEROKU_URL}/bot${process.env.BOT_TOKEN}`);
bot.startWebhook(`/bot${process.env.BOT_TOKEN}`, null, process.env.PORT);

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

db(client, bot);

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
