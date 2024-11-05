const emotes = {
	":smile:": "😊",
	":thumbsup:": "👍",
	":heart:": "❤️",
};

const parseEmotes = (message) => {
	return message.replace(/:([a-z]+):/g, (match) => emotes[match] || match);
};

module.exports = parseEmotes;
