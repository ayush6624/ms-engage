import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
	// Google OAuth Provider for singing in with Google
	providers: [
		Providers.Google({
			clientId: process.env.GOOGLE_OAUTH_KEY,
			clientSecret: process.env.GOOGLE_OAUTH_SECRET,
			authorizationUrl:
				'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code' // to persist
		})
	]
});
