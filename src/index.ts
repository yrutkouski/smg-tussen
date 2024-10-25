import { Telegraf, Context } from 'telegraf';
import { Update } from '@telegraf/types';
import { Request, Response } from '@google-cloud/functions-framework';

import { weeks, pollOptions } from './constants.js';
import { getNumberOfWeek } from './utils.js';

const { BOT_TOKEN, WEBHOOK, SMG_CHANNEL_ID, X_TOKEN, X_HEADER } = process.env;

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
        console.log(ctx.msgId);

        if (String(channelId) === String(SMG_CHANNEL_ID) && ctx.msgId === 0) {
            await ctx.reply(`Friday GOLOSOVANIE`);
        } else {
            const username = ctx.message?.from?.username;
            const firstName = ctx.message?.from?.first_name;
            const userDisplayName = username ? `@${username}` : firstName;

            const message = `${userDisplayName} started GOLOSOVANIE`;

            await ctx.reply(message);
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
}).then(r => console.log('setWebhook ', r));

export const webhook = async (req: Request, res: Response): Promise<Response<string>> => {
    console.log(JSON.stringify(req.headers, null, 2));

    if (req.headers[X_HEADER!] !== X_TOKEN) {
        return res.status(403).send('Not authorized');
    }

    try {
        const updates: Update = req.body;
        await bot.handleUpdate(updates);

        return res.status(200).send('OK');
    } catch (error) {
        console.error(error);

        return res.status(500).send('Error');
    }
};
