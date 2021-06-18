import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		Providers.Google({
			clientId: process.env.GOOGLE_OAUTH_KEY,
			clientSecret: process.env.GOOGLE_OAUTH_SECRET,
			authorizationUrl:
				'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code' // to persist
		})

		// ...add more providers here
	]
	// secret: process.env.JWT_SECRET,
	// jwt: {
	// 	signingKey: process.env.JWT_SIGNING_PRIVATE_KEY
	// },
	// debug: true
});
