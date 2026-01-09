import { Bot, Context } from 'grammy';

import { weeks, pollOptions } from './constants.js';
import { getNumberOfWeek } from './utils.js';

const {
    BOT_TOKEN,
    SMG_CHANNEL_ID,
} = process.env;

const bot = new Bot<Context>(BOT_TOKEN!);

bot.command('pyatnichnaya', (ctx: Context) => {
    const key = getNumberOfWeek() % weeks.length;
    return ctx.reply(weeks[key]);
});

bot.command('raspisanie', (ctx: Context) => ctx.reply(weeks.join('\n')));

bot.command('piva', (ctx: Context) => ctx.reply('🍻'));

bot.command('golosovanie', async (ctx: Context) => {
    try {
        const channelId = ctx.chat?.id;
        
        if (!channelId) {
            await ctx.reply('Unable to determine channel ID.');
            return;
        }

        const username = ctx.message?.from?.username;
        const firstName = ctx.message?.from?.first_name;
        
        if (String(channelId) === String(SMG_CHANNEL_ID) && !(username && firstName)) {
            await ctx.reply('Friday GOLOSOVANIE');
        } else {
            const userDisplayName = username ? `@${username}` : firstName;
            const message = `${userDisplayName} started GOLOSOVANIE`;
            await ctx.reply(message);
        }

        const question = ctx.message?.text?.replace(/^\/golosovanie\s*/, '').trim() || pollOptions.question;

        await ctx.api.sendPoll(channelId, question, pollOptions.options, {
            is_anonymous: pollOptions.is_anonymous,
            allows_multiple_answers: pollOptions.allows_multiple_answers,
        });
    } catch (error: unknown) {
        console.error('Error poll: ', error instanceof Error ? error.message : JSON.stringify(error, null, 2));
        await ctx.reply('Failed to send poll.');
    }
});

bot.catch((err) => {
    console.error(`Error while handling update ${err.ctx.update.update_id}:`, err.error);
});

export default bot;

