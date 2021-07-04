const API_BASE_URL = process.env.NEXT_PUBLIC_VERCEL_ENV
	? 'https://api-teams.ayushgoyal.dev'
	: 'http://localhost:3001';

export { API_BASE_URL };
