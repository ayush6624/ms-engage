import maxmind, { AsnResponse, CityResponse } from 'maxmind';
import { Connection, Analytics, Invite } from './types';
import Bowser from 'bowser';
import { insertSession } from './db';
import { Request, Response } from 'express';
import Mailgun from './config';

/**
 * Sends an email using Mailgun ot the user
 *
 * @param {Invite} body
 */
const sendEmail = async (body: Invite) => {
	const data = {
		from: 'Ayush Goyal <ayush@ayushgoyal.dev>',
		to: body.email,
		subject: 'Invitation to Teams Call',
		html: `Hi!, You have been invited to join the Teams call. <a href="https://teams.ayushgoyal.dev/${body.id}">Join Now</a>`
	};

	Mailgun.messages().send(data, function (err, body) {
		console.log(body);
	});
};

/**
 * Populate Network details from IP Address
 * ASN, ISP, Coordinates, etc.
 *
 * @param {string} ip IP Address
 * @return {*}  {Promise<Connection>}
 */
const getConnectionDetails = async (ip: string): Promise<Connection> => {
	const asn = await maxmind.open<AsnResponse>('geoip/asn.mmdb'); // use the maxmind database to retrieve the information
	const city = await maxmind.open<CityResponse>('geoip/city.mmdb');
	const data: Connection = {
		ip,
		asn:
			asn.get(ip)?.autonomous_system_organization! +
			' AS' +
			asn.get(ip)?.autonomous_system_number,
		city: city.get(ip)?.city?.names.en!,
		country: city.get(ip)?.country?.names.en!,
		map:
			city.get(ip)?.location?.latitude +
			',' +
			city.get(ip)?.location?.longitude
	};
	return data;
};

/**
 * Generates a 1x1 pixel and
 *
 * @param {string} serviceId
 * @param {Request} req
 * @param {Response} res
 */
const pixelHelper = async (serviceId: string, req: Request, res: Response) => {
	const image_string: string =
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
	// base64 1x1 pixel
	const im = image_string.split(',')[1];
	const img = Buffer.from(im, 'base64');
	res.contentType('png');
	res.send(img); // send the image
	let ip_address = (req.headers['cf-connecting-ip'] as string) || req.ip; // store the IP Address
	const network = await getConnectionDetails(ip_address); // store all the network details - ASN, IP Address, coordinates
	const headers: object = req.headers; // retrieves the header information
	const device = Bowser.parse(req.headers['user-agent']!); // store the device information - device, category, browser, engine
	const query = req.query; // the requested resource

	const data: Analytics = {
		query,
		network,
		headers,
		serviceId,
		device
	};
	await insertSession(data);
};

export { pixelHelper, sendEmail };
