import maxmind, { AsnResponse, CityResponse } from 'maxmind';
import { Connection, Analytics, Invite } from './types';
import Bowser from 'bowser';
import { insertSession } from './db';
import { Request, Response } from 'express';
import Mailgun from './config';

const sendEmail = async (body: Invite) => {
  console.log(body);
  const data = {
    from: 'Ayush Goyal <ayush@ayushgoyal.dev>',
    to: body.email,
    subject: 'Invitation to Teams Call',
    html: `Hi!, You have been invited to join the Teams call. <a href="https://teams.ayushgoyal.dev/${body.id}">Join Now</a>`,
  };

  Mailgun.messages().send(data, function (err, body) {
    console.log(body);
  });
};

const getConnectionDetails = async (ip: string): Promise<Connection> => {
  const asn = await maxmind.open<AsnResponse>('geoip/asn.mmdb');
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
      city.get(ip)?.location?.longitude,
  };
  return data;
};

const pixelHelper = async (serviceId: string, req: Request, res: Response) => {
  const image_string: string =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const im = image_string.split(',')[1];
  const img = Buffer.from(im, 'base64');
  res.contentType('png');
  res.send(img);
  let ip_address = (req.headers['cf-connecting-ip'] as string) || req.ip;
  const network = await getConnectionDetails(ip_address);
  const headers: object = req.headers;
  const device = Bowser.parse(req.headers['user-agent']!);
  const query = req.query;

  const data: Analytics = {
    query,
    network,
    headers,
    serviceId,
    device,
  };
  await insertSession(data);
};

export { pixelHelper, sendEmail };
