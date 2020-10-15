var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var https = require('https');





// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !hug
            case 'hug':
                bot.sendMessage({
                    to: channelID,
                    message: ':hugging:'
                });
            break;
            // !needsupport
			case 'needsupport':
				bot.sendMessage({
					to: channelID,
					message: 'You can do it, ' + user + '!'
				});
			// !dkt kanji searching 
			case 'dkt':
				// combine searches with two words to one 
				let keyword = args.join(' ');
				//http request
				https.get('https://jisho.org/api/v1/search/words?keyword=' + keyword, (resp) =>{
					//load all the data
					let data = '';
					resp.on('data', (chunk) => {
						data += chunk;
					});
	
					//return the result
					resp.on('end', () => {
						//console.log(JSON.parse(data));
						
						data = JSON.parse(data)
						data = data.data[0].japanese;
						let kanji = data[0].word;
						let reading = data[0].reading;
						console.log(JSON.stringify(kanji));
						bot.sendMessage({
							to: channelID,
							message: 'Word: ' + JSON.stringify(kanji) + ' , reading: ' + JSON.stringify(reading)
						});
					});
					
					
	
				});
			case 'decide':
				var pdata = JSON.stringify(args);
				//decide2 options
				var options = {
					hostname: 'decide2.herokuapp.com',
					port: 443,
					path: '/chooseOne',
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Content-Length': pdata.length
					}
				};
				var req = https.request(options, (res) => {
					console.log(res.statusCode);
					res.on('data', (d) => {
						bot.sendMessage({
							to: channelID,
							message: d
						});
					})
				});
				req.write(pdata);
				req.end();
				
			case 'chose':
				let chanid = "262320272642801664";
				if(args[0] == "poorly"){
					bot.sendMessage({
						to: chanid,
						message: "You chose... poorly."
					});
				}
				if(args[0] == "wisely"){
					bot.sendMessage({
						to: chanid,
						message: "You chose... wisely."
					});					
				}
				
         }
     }
});


