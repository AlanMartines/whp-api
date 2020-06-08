const wa = require('@open-wa/wa-automate');
const helpers = require('./../helpers');
const webHook = require('./webHook');

const { setWhp } = helpers;

const whpServerStart = async function() {
	setWhp('isStarting', true);
	wa.create({
		headless: true,
		sessionId: process.env.SESSION_TOKEN,
	})
		.then(async (client) => await whpConfigureClient(client))
		.catch((error) => {
			console.log('Error', error.message);
		});
};

const whpConfigureClient = async function(client) {
	setWhp('client', client);

	client.onPlugged(webHook.post(await client.getMe()));
	client.onAck(webHook.event('ack'));
	client.onMessage(webHook.event('message'));

	// client.onAnyMessage(webHook('any_message'));
	// client.onAddedToGroup(webHook('added_to_group'));
	// client.onBattery(webHook('battery'));
	// client.onContactAdded(webHook('contact_added'));
	// client.onIncomingCall(webHook('incoming_call'));
	// client.onPlugged(webHook('plugged'));
	// client.onStateChanged(webHook('state'));

	setWhp('isStarting', false);
	console.log(`\n⚡ Listening on http://localhost:${process.env.PORT}!`);
};

module.exports = whpServerStart;
