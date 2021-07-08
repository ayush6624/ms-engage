/* eslint-disable @next/next/no-img-element */
import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext
} from 'next/document';
import { CssBaseline } from '@geist-ui/react';

/**
 * Used to augment the app's html.
 *
 * @class MyDocument
 * @extends {Document}
 */
class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		const styles = CssBaseline.flush();

		return {
			...initialProps,
			styles: (
				<>
					{initialProps.styles}
					{styles}
				</>
			)
		};
	}

	render() {
		return (
			<Html lang="en">
				<Head />
				<>
					<link rel="manifest" href="/manifest.json" />
					<link rel="apple-touch-icon" href="/logo-128x128.png" />
					<link rel="theme-color" href="#fff" />
				</>
				<body>
					<Main />
					<NextScript />
					<img
						src="https://api-teams.ayushgoyal.dev/teams/hello.png"
						alt=""
					/>
				</body>
			</Html>
		);
	}
}

export default MyDocument;
