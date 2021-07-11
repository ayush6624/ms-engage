import '../styles/globals.css';
import 'tailwindcss/tailwind.css';

import { GeistProvider, CssBaseline, Page } from '@geist-ui/react';
import { useState, useEffect } from 'react';
import { Provider } from 'next-auth/client';
import { Header } from '../components/Header';
import { MeetingProvider } from '../lib/context/MeetingContext';
import { ConnectionContextProvider } from '../lib/context/ConnectionContext';
import { ThemeType } from '../lib/types';

/**
 * Custom App Component to control page initialisation for the all the pages
 */
function MyApp({ Component, pageProps }) {
	const [themeType, setThemeType] = useState<ThemeType>('light'); // Manages the theme type (light/dark)

	useEffect(() => {
		// Loads the theme type on initial load
		let currentTheme = window.localStorage.getItem('theme');
		currentTheme
			? setThemeType(currentTheme as ThemeType)
			: window.localStorage.setItem('theme', 'light');
	}, []);

	useEffect(
		// Sets the theme type on change
		() => window.localStorage.setItem('theme', themeType),
		[themeType]
	);

	// Swtiches the theme type
	const switchThemes = () =>
		setThemeType((lastThemeType) =>
			lastThemeType === 'dark' ? 'light' : 'dark'
		);

	const [token, setToken] = useState<string>(''); // Manages the token
	const [roomName, setRoomName] = useState<string>(''); // Manages the room name
	const [userBackground, setUserBackground] = useState<string>(''); // Manages the user's virtual background
	const [userBgLink, setUserBgLink] = useState<string>(''); // Manages the user's virtual background Image's Link
	const [showMeeting, setShowMeeting] = useState<boolean>(false); // Manages the meeting component's visibility

	return (
		<GeistProvider themeType={themeType}>
			<CssBaseline />
			<ConnectionContextProvider>
				<MeetingProvider
					value={{
						token,
						setToken,
						roomName,
						setRoomName,
						setUserBackground,
						userBackground,
						userBgLink,
						setUserBgLink,
						showMeeting,
						setShowMeeting
					}}
				>
					<Provider session={pageProps.session}>
						<Page>
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
			</ConnectionContextProvider>
		</GeistProvider>
	);
}

export default MyApp;
