import { Text, Button, Grid, Input } from '@geist-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import { BASE_URL } from '../lib/url';
import { FcGoogle } from 'react-icons/fc';
import { LogIn, User, Lock, AlertCircle } from '@geist-ui/react-icons';
import { signin, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(false);
	const router = useRouter();
	const [session] = useSession();

	useEffect(() => {
		console.log(session);
		if (session) router.push('/');
	}, [session]);

	const Google_Login_Button = (props) => {
		return (
			<Button type="secondary" shadow onClick={props.onClick}>
				<FcGoogle />
			</Button>
		);
	};

	const emailCallback = useCallback(
		(e) => {
			setEmail(e.target.value);
			setError('');
		},
		[email]
	);

	const passwordCallback = useCallback(
		(e) => {
			setPassword(e.target.value);
			setError('');
		},
		[password]
	);

	const login_now = async (e) => {
		setLoaded(true);
		try {
			await login(email, password);
		} catch (err) {
			setError(true);
		}
		setLoaded(false);
	};

	return (
		<div
			style={{
				minHeight: '81vh',
				justifyContent: 'center',
				alignItems: 'center',
				display: 'flex',
				flexDirection: 'column'
			}}
		>
			<Grid.Container
				gap={1}
				justify="center"
				alignItems="center"
				direction="column"
			>
				<Grid>
					<Text h1>Sign In </Text>
				</Grid>
				<Grid>
					<Input
						type="email"
						icon={<User />}
						onChange={emailCallback}
						clearable
						placeholder="email@gmail.com"
						onClearClick={(_) => setEmail('')}
					>
						Username
					</Input>
				</Grid>
				<Grid>
					<Input.Password
						status={error ? 'warning' : 'default'}
						icon={<Lock />}
						onChange={passwordCallback}
						placeholder="********"
						onKeyDown={(e) =>
							e.key === 'Enter' ? login_now() : ''
						}
					>
						Password
					</Input.Password>
				</Grid>
				<Grid>
					<Button
						type={error ? 'error' : 'success'}
						size="large"
						loading={loaded}
						shadow
						onClick={(e) => login_now(e)}
					>
						<div
							style={{
								paddingTop: '5px',
								paddingBottom: '5px'
							}}
						>
							{error ? <AlertCircle /> : <LogIn />}
						</div>
					</Button>
				</Grid>
				{/* <Grid> */}
				{/* googlelogin */}
				{/* <GoogleLogin
						render={(props) => Google_Login_Button(props)}
						clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_KEY}
						onSuccess={(resp) => oauth_login(resp, 'google')}
						onFailure={(resp) => console.log(resp)}
						cookiePolicy={'single_host_origin'}
					/> */}
				{/* </Grid> */}
				<Button
					onClick={() => {
						signin('google', {
							callbackUrl: `${BASE_URL}`
						});
					}}
				>
					Sign In With Google
				</Button>
			</Grid.Container>
		</div>
	);
}

export default Login;
