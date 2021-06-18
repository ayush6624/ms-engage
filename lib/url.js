let BASE_URL = '';

BASE_URL =
	process.env.NODE_ENV === 'production'
		? 'https://ms-enage.vercel.app'
		: 'http://localhost:3000';

export { BASE_URL };
