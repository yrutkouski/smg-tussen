import { Telegraf } from 'telegraf';
import { http, Request, Response } from "@google-cloud/functions-framework";
import { getCurrentWeekNumber, logger, schedule } from './utils';

const { BOT_TOKEN, WEBHOOK, ENV } = process.env;

const bot = new Telegraf(BOT_TOKEN as string);

bot.use(logger());

bot.command('pyatnichnaya', ctx => {
    const key = getCurrentWeekNumber() % schedule.length;

    return ctx.reply(schedule[key]);
});

bot.command('raspisanie', ctx => ctx.reply(schedule.join('\n')));

bot.command('piva', ctx => ctx.reply('🍻'));

bot.command('pishu', ctx => {
    const message = ctx.message.text.replace(/^\/(\w+) /, '');

    return ctx.reply(message);
});

bot.telegram.setWebhook(WEBHOOK as string);

if (ENV === 'development') {
    bot.launch();
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

http('TelegramWebhook', async (req: Request, res: Response): Promise<void> => {
    const updates = req.body;
    try {
        await bot.handleUpdate(updates);
        res.status(200).send('OK');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
});