import twilio from 'twilio';
const AccessToken = twilio.jwt.AccessToken;
const { VideoGrant } = AccessToken;

const config = {
	twilio: {
		accountSid: process.env.TWILIO_AC_SID,
		apiKey: process.env.TWILIO_SID,
		apiSecret: process.env.TWILIO_SECRET
	}
};

const generateToken = (config) => {
	return new AccessToken(
		config.twilio.accountSid,
		config.twilio.apiKey,
		config.twilio.apiSecret
	);
};

const videoToken = (identity, room, config) => {
	let videoGrant;
	if (typeof room !== 'undefined') {
		videoGrant = new VideoGrant({ room });
	} else {
		videoGrant = new VideoGrant();
	}

	const token = generateToken(config);
	token.addGrant(videoGrant);
	token.identity = identity;
	return token;
};

export default function handler(req, res) {
	const identity = req.body.identity;
	const room = req.body.room;
	const token = videoToken(identity, room, config);
	res.statusCode = 200;
	res.json({ token: token.toJwt() });
}