// TODO: provide defaults to shrink this part
var crutch = new Crutch({
	console: window.console,
	time: false,
	log: true,
	hush: false,
	hooks: {
		"X.prototype.allYourBase" : {
			warn: true,
			hush: true,
			time: false,
			log: false
		},
		"X.prototype.allYourBase1000": {
			action: "writing allYouBase a thousand time",
			hush: false,
			time: true,
			log: true
		}
	}
});
