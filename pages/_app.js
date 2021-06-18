// import '../styles/globals.css';
import 'tailwindcss/tailwind.css';

import { GeistProvider, CssBaseline } from '@geist-ui/react';
import { useState, useEffect } from 'react';
import { Provider } from 'next-auth/client';

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

	return (
		<GeistProvider themeType={themeType}>
			<CssBaseline />
			<Provider session={pageProps.session}>
				{/* <Navbar /> */}
				<Component {...pageProps} />
				{/* <Footer switchTheme={switchThemes} mode={themeType} /> */}
			</Provider>
		</GeistProvider>
	);
}

export default MyApp;
