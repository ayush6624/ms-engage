import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import '../components/whiteboard.css';

import { GeistProvider, CssBaseline, Page } from '@geist-ui/react';
import { useState, useEffect } from 'react';
import { Provider } from 'next-auth/client';
import { Header } from '../components/Header';
import { MeetingProvider } from '../lib/context/token';

function MyApp({ Component, pageProps }) {
	const [themeType, setThemeType] = useState('light');

	useEffect(() => {
		let currentTheme = window.localStorage.getItem('theme');
		currentTheme
			? setThemeType(currentTheme)
			: window.localStorage.setItem('theme', 'light');
	}, []);

	useEffect(
		() => window.localStorage.setItem('theme', themeType),
		[themeType]
	);

	const switchThemes = () =>
		setThemeType((lastThemeType) =>
			lastThemeType === 'dark' ? 'light' : 'dark'
		);

	const [token, setToken] = useState('');
	const [roomName, setRoomName] = useState('');

	return (
		<GeistProvider themeType={themeType}>
			<CssBaseline />
			<MeetingProvider value={{ token, setToken, roomName, setRoomName }}>
				<Provider session={pageProps.session}>
					<Page>
						{/* <Script
							src="https://twilio.github.io/twilio-video-processors.js/examples/virtualbackground/twilio-video-processors.min.js"
							strategy="beforeInteractive"
						/> */}
						<Page.Header>
							<Header
								themeType={themeType}
								switchTheme={switchThemes}
							/>
						</Page.Header>
						<Page.Content>
							<Component {...pageProps} />
						</Page.Content>
					</Page>
				</Provider>
			</MeetingProvider>
		</GeistProvider>
	);
}

export default MyApp;
