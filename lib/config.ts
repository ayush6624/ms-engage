const API_BASE_URL = process.env.NEXT_PUBLIC_VERCEL_ENV
	? 'https://api-teams.ayushgoyal.dev'
	: 'http://localhost:3001';

const twilioConfig = {
	twilio: {
		accountSid: process.env.TWILIO_AC_SID,
		apiKey: process.env.TWILIO_SID,
		apiSecret: process.env.TWILIO_SECRET
	}
};

export { API_BASE_URL, twilioConfig };
