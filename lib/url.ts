let BASE_URL: string = '';

// Used for next-auth callbacks

BASE_URL =
	process.env.NODE_ENV === 'production'
		? 'https://ms-enage.vercel.app'
		: 'http://localhost:3000';

export { BASE_URL };
