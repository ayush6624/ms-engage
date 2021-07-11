import mg from 'mailgun-js';

const api_key = process.env.MAILGUN_API_KEY;
const domain = 'ayushgoyal.dev';

// Mailgun object
const Mailgun = new mg({ apiKey: api_key, domain: domain });

export default Mailgun;
