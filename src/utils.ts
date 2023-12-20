import { Context } from "telegraf";
import { Update } from "@telegraf/types";

export const getCurrentWeekNumber = (): number => {
    const today: Date = new Date();
    const firstDayOfYear: Date = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear: number = (today.valueOf() - firstDayOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const logger = (): (ctx: Context<Update>, next: () => Promise<void>) => Promise<void> | void => {
    if (process.env.ENV === 'development') {
        return async (ctx, next) => {
            console.log(`Received update: ${ctx.update.update_id}`);
            await next();
        }
    }

    return () => {};
}

// TODO: add dynamic update without redeploy
export const schedule: string[] = ['Olia + Pasha','Anton','Chechen','Viktar','Shooters','Nastassia + Stan(s)','Volodya + Ira','Pan + Jul','Liza','Max + Masha'];