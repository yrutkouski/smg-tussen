module.exports.db = (client, bot) => {
    bot.command('list_users', ctx => {
        const selectQuery = {
            text: 'select * from users',
        }

        client.query(selectQuery,
            (err, res) => {
                if (err) {
                    console.error(err);
                } else {
                    ctx.reply(res.rows.map(item => JSON.stringify(item)).join('\n'));
                }
            });
    });

    bot.command('add_user', ctx => {
        const user = ctx.message.text.replace('/add_user ','')

        const insertQuery = {
            text: 'insert into users(name) values($1) returning *',
            values: [user],
        }

        client.query(insertQuery,
            (err, res) => {
                if (err) {
                    console.error(err);
                } else {
                    ctx.reply(res.rows.map(item => JSON.stringify(item)).join('\n'));
                }
            });
    });
};
