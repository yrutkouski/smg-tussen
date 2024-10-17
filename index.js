import { Telegraf } from 'telegraf';
import { getNumberOfWeek } from './utils.js';
const { BOT_TOKEN, WEBHOOK } = process.env;

const bot = new Telegraf(BOT_TOKEN);

const weeks = [
    'Olia + Pasha',
    'Chechen',
    'Viktar',
    'Shooters',
    'Nastassia + Stan(s)',
    'Volodya + Ira',
    'Pan + Jul',
    'Liza',
    'Max + Masha',
];

const pollOptions = {
  question: '???',
  options: ['+++', '---'],
  is_anonymous: false,
  allows_multiple_answers: false,
};

bot.command('pyatnichnaya', ctx => {
    const key = getNumberOfWeek() % weeks.length;

    return ctx.reply(weeks[key]);
});

bot.command('raspisanie', ctx => ctx.reply(weeks.join('\n')));

bot.command('piva', ctx => ctx.reply('🍻'));

bot.command('pishu', ctx => {
    const message = ctx.message.text.replace(/^\/(\w+) /, '');

    return ctx.reply(message);
});

bot.command('golosovanie', async (ctx) => {
    try {
        const channelId = ctx.chat?.id;
        ctx.reply(`${ctx.message?.from?.first_name} ${ctx.message?.from?.username} started GOLOSOVANIE`);
        await ctx.telegram.sendPoll(channelId, pollOptions.question, pollOptions.options, {
            is_anonymous: pollOptions.is_anonymous,
            allows_multiple_answers: pollOptions.allows_multiple_answers,
        });
    } catch (error) {
        console.error('Error sending poll:', error);
        ctx.reply('Failed to send poll.');
    }
});

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
