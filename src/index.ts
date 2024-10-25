import { Telegraf, Context } from 'telegraf';
import { Update } from '@telegraf/types';
import { Request, Response } from '@google-cloud/functions-framework';

import { weeks, pollOptions } from './constants.js';
import { getNumberOfWeek } from './utils.js';

const { BOT_TOKEN, WEBHOOK, SMG_CHANNEL_ID, X_TOKEN } = process.env;

const bot = new Telegraf(BOT_TOKEN!);

bot.command('pyatnichnaya', (ctx: Context) => {
    const key = getNumberOfWeek() % weeks.length;

    return ctx.reply(weeks[key]);
});

bot.command('raspisanie', (ctx: Context) => ctx.reply(weeks.join('\n')));

bot.command('piva', (ctx: Context) => ctx.reply('🍻'));

bot.command('golosovanie', async (ctx: Context) => {
    try {
        const channelId = ctx.chat?.id!;
        console.log(ctx);

        if (`${channelId}` === SMG_CHANNEL_ID && ctx.msgId === 0) {
            await ctx.reply(`Friday GOLOSOVANIE`);
        } else {
            await ctx.reply(`@${ctx.message?.from?.username} started GOLOSOVANIE`);
        }

        await ctx.telegram.sendPoll(channelId, pollOptions.question, pollOptions.options, {
            is_anonymous: pollOptions.is_anonymous,
            allows_multiple_answers: pollOptions.allows_multiple_answers,
        }).catch(e => {
            throw new Error(e);
        });
    } catch (error) {
        console.error('Error sending poll:', error);
        await ctx.reply('Failed to send poll.');
    }
});

bot.telegram.setWebhook(WEBHOOK!, {
    allowed_updates: ['message'],
    secret_token: X_TOKEN,
});

export const webhook = async (req: Request, res: Response) => {
    if (req.headers['X-Telegram-Bot-Api-Secret-Token'] !== X_TOKEN) {
        res.status(403).send('Not authorized');
    }

    try {
        const updates: Update = req.body;
        await bot.handleUpdate(updates);
        res.status(200).send('OK');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
};
