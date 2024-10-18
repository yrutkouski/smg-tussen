import { Telegraf, Context } from 'telegraf';
import { Update } from '@telegraf/types';
import { Request, Response } from '@google-cloud/functions-framework';

import { weeks, pollOptions } from './constants.js';
import { getNumberOfWeek } from './utils.js';

const { BOT_TOKEN, WEBHOOK } = process.env;

const bot = new Telegraf(BOT_TOKEN!);

bot.command('pyatnichnaya', (ctx: Context) => {
    const key = getNumberOfWeek() % weeks.length;

    return ctx.reply(weeks[key]);
});

bot.command('raspisanie', (ctx: Context) => ctx.reply(weeks.join('\n')));

bot.command('piva', (ctx: Context) => ctx.reply('🍻'));

bot.command('golosovanie', async (ctx: Context) => {
    try {
        const channelId = ctx.chat?.id;

        if (channelId) {
            await ctx.reply(`${ctx.message?.from?.first_name} ${ctx.message?.from?.username} started GOLOSOVANIE`);

            await ctx.telegram.sendPoll(channelId, pollOptions.question, pollOptions.options, {
                is_anonymous: pollOptions.is_anonymous,
                allows_multiple_answers: pollOptions.allows_multiple_answers,
            });
        } else {
            throw new Error('channelId is empty');
        }
    } catch (error) {
        console.error('Error sending poll:', error);
        await ctx.reply('Failed to send poll.');
    }
});

bot.telegram.setWebhook(WEBHOOK!);

export const webhook = async (req: Request, res: Response) => {
    const updates: Update = req.body;
    try {
        await bot.handleUpdate(updates);
        res.status(200).send('OK');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
};
