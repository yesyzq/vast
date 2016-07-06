var WebSocket = require('ws');
/**
 *	Exports a constructor with arguments:
 *		uid: String UID for the team
 *		vastURL: URL for the VAST Challenge server
 *		messageHandler: message handling function, this is called once per message
 *			and the only argument provided is the message.
 */

module.exports = function(uid, vastURL, messageHandler) {
	var ws = new WebSocket('ws://' + vastURL);

	ws.on('message', function(data) {
		if (data.length > 0) {
			var message = JSON.parse(data.toString());

			if(messageHandler)
			{
				messageHandler(ws, message);
			}
		}
	});

	// Once the connection is open, send the UID
	ws.on('open', function() {

		// set test to true when running on the test stream
		// set test to false, or remove it, when ready to run the competition stream
		var test = true;
		ws.send(JSON.stringify({"uid": uid, test: test}));

		console.log ( "uid sent");
	});

	// If the connection closes, take note
	ws.on('close', function() {
		console.log('connection closed - complete');
	});
};