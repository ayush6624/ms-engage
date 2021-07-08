import twilio from 'twilio';
import {
	uniqueNamesGenerator,
	adjectives,
	colors,
	animals
} from 'unique-names-generator';
import { twilioConfig as config } from '../../lib/config';
import { TwilioConfigType } from '../../lib/types';
import type { NextApiRequest, NextApiResponse } from 'next';

const AccessToken = twilio.jwt.AccessToken;
const { VideoGrant } = AccessToken;

/**
 * Generates a new JWT Token to join a video room
 *
 * @param {TwilioConfigType} config
 */
const generateToken = (config: TwilioConfigType) => {
	return new AccessToken(
		config.twilio.accountSid,
		config.twilio.apiKey,
		config.twilio.apiSecret
	);
};

/**
 * Helper function which
 * Generates a 3 word random worded room name using the JWT Token
 *
 * @param {string} identity
 * @param {string} room
 * @param {TwilioConfigType} config
 * @return {*}
 */
const videoToken = (
	identity: string,
	room: string,
	config: TwilioConfigType
) => {
	let videoGrant: any;
	let uniqueName: string;
	if (typeof room !== 'undefined') {
		videoGrant = new VideoGrant({ room });
	} else {
		uniqueName = uniqueNamesGenerator({
			dictionaries: [adjectives, colors, animals],
			separator: '-',
			length: 3
		});
		videoGrant = new VideoGrant({ room: uniqueName });
	}

	const token = generateToken(config);
	token.addGrant(videoGrant);
	token.identity = identity;
	return { token, room: room ? room : uniqueName };
};

/**
 * Returns the token along with the room name
 *
 * @export
 * @param {NextApiRequest} req
 * @param {NextApiResponse<{ token: string; room: string; identity: string }>} res
 */
export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<{ token: string; room: string; identity: string }>
) {
	const identity = req.body.identity;
	const room = req.body.room;
	const { token, room: meetingRoom } = videoToken(identity, room, config);
	res.statusCode = 200;
	res.json({ token: token.toJwt(), room: meetingRoom, identity });
}
