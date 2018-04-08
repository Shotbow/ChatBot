module.exports.execute = function(message, argument) {
	require("https").get("https://status.mojang.com/check", res => {
		var status = "";
		res.setEncoding("utf8");
		res.on("data", data => {
			status += data;
		});
		res.on("end", () => {
			status = JSON.parse(status);
			var formattedStatus = {};
			for (var i = 0; i < status.length; i ++) {
				for (var key in status[i]) {
					formattedStatus[key] = status[i][key];
				}
			}
			var errors = [];
			for (var key in formattedStatus) {
				if (formattedStatus[key] == "yellow") errors.push(`- \`${key}\` is having some issues`);
				else if (formattedStatus[key] == "red") errors.push(`- \`${key}\` is completely down`);
			}
			if (errors.length == 0) message.channel.send("I just checked Mojang's servers, and everything seems to be working fine!");
			else message.channel.send(`I just checked Mojang's servers, and there appear to be some issues:\n${errors.join("\n")}`);
		});
	});
}