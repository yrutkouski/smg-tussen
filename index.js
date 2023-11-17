import { Telegraf } from 'telegraf';
import { getNumberOfWeek } from './utils.js';
const { BOT_TOKEN, WEBHOOK } = process.env;

const bot = new Telegraf(BOT_TOKEN);

const weeks = [
    'Olia + Pasha',
    'Anton',
    'Chechen',
    'Viktar',
    'Shooters',
    'Nastassia + Stan(s)',
    'Volodya + Ira',
    'Pan + Jul',
    'Liza',
    'Max + Masha',
];

bot.command('pyatnichnaya', ctx => {
    const key = getNumberOfWeek() % weeks.length;

    return ctx.reply(weeks[key]);
});

bot.command('raspisanie', ctx => {
    return ctx.reply(weeks.join('\n'));
});

bot.command('beer', ctx => ctx.reply('🍻'));

bot.telegram.setWebhook(WEBHOOK);

export const webhook = async (req, res) => {
    const updates = req.body;
    try {
        await bot.handleUpdate(updates);
        res.status(200).send('OK');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
};
