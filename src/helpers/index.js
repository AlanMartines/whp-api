require('dotenv').config();
const whp = require('../config/whp');
const axios = require('axios').default;
const youtubedl = require('youtube-dl');

const setWhp = function(option, value) {
	if (!option) {
		return false;
	}
	return whp[option] = (value) ? value : false;
};

const getWhp = function(option) {
	return (option) ? whp[option] : whp;
};

const whpClient = function() {
	return getWhp('client');
};

const sessionStop = async function() {
	const client = await whpClient();
	console.log('sessionStop', 'init');
	if (client) {
		console.log('sessionStop', 'kill');
		await client.kill();
		setWhp('client', null);
	}
};

const sendGetStatus = function(send) {
	return send = (!send) ? false : true;
};

const getFileName = function(url) {
	return url.substring(url.lastIndexOf('/') + 1);
};

const getFile = async function(url) {
	return axios
		.get(url, {
			responseType: 'arraybuffer',
		})
		.then((r) => {
			if (process.env.ALLOW_TYPES.split(',').includes(r.headers['content-type'])) {
				return {
					type: r.headers['content-type'],
					base64: 'data:' + r.headers['content-type'] + ';base64,' + Buffer.from(r.data, 'binary').toString('base64'),
					name: getFileName(url),
				};
			}
			return false;
		});
};

const getMsgServer = function(isGroupMsg) {
	return (isGroupMsg) ? '@g.us' : '@c.us';
};

const getMsgServerFromNumber = function(number) {
	return number.slice(-4);
};

const getMessageID = function(id) {
	// return id = id.split('us_')[1].split('_')[0];
	return id.slice(id.indexOf('us_') + 3).split('_')[0];
};

const formatPhoneNumber = function(number) {
	return number.slice(0, -5);
};

async function getVideoInfo(url) {
	return new Promise((res, rej) => {
		youtubedl.getInfo(url, [], function(err, info) {
			if (err) {
				rej(err);
			}
			res(info);
		});
	});
}

async function getVideoFile(url, quality = 'best[mp4, height<=480]') {
	return new Promise((res, rej) => {
		youtubedl.exec(url, [ '-f', quality, '-o', '/whp/src/cdn/videos/%(id)s.%(ext)s' ], {}, function(err, output) {
			if (err) {
				rej(err);
			} else {
				res(output);
			}
		});
	});
}

module.exports = {
	setWhp,
	getWhp,
	whpClient,
	sessionStop,
	sendGetStatus,
	getFileName,
	getFile,
	getMsgServer,
	getMessageID,
	getMsgServerFromNumber,
	formatPhoneNumber,
	getVideoInfo,
	getVideoFile,
};

