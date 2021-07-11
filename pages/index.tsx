import {
	Row,
	Spacer,
	Grid,
	Text,
	Col,
	Card,
	Button,
	Input,
	Image,
	Divider,
	useToasts
} from '@geist-ui/react';
import { XCircleFill, PlusCircle } from '@geist-ui/react-icons';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useContext, useEffect, useState } from 'react';
import { FaRegKeyboard } from 'react-icons/fa';
import { MeetingContext } from '../lib/context/MeetingContext';
import Head from 'next/head';

const Home = (): JSX.Element => {
	const [session] = useSession(); // Fetches the (logged-in) user's session, otherwise null
	const { push, query } = useRouter(); // Client side router pusher
	const [_toasts, setToast] = useToasts(); // Toasts Alerts
	const { setToken } = useContext(MeetingContext); // Sets the token on joining a meeting
	const [joinRoom, setJoinRoom] = useState<string>(''); // Manages user entered room name
	const [prevMeeting, setPrevMeeting] = useState<string | undefined>(); // Manages any previous meetings of a user

	/**
	 * Fetches room details and token from the API
	 *
	 * @param {string} username
	 * @param {string} [roomName]
	 */
	const handleSubmit = async (username: string, roomName?: string) => {
		const data = await fetch('/api/room', {
			method: 'POST',
			body: JSON.stringify({
				identity: username,
				room: roomName ?? undefined
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => res.json());
		setToken(data.token);
		push(`/${data.room}`);
	};

	const showErrorToast = useCallback(async () => {
		setToast({
			text: 'Please log in first!',
			type: 'error'
		});
	}, [setToast]);

	useEffect(() => {
		// Shows previous meeting if any
		if (query.login === 'false') showErrorToast();
		let prevMeeingId = window.localStorage.getItem('prevMeeting');
		if (prevMeeingId) setPrevMeeting(prevMeeingId);
	}, [query.login]);

	return (
		<>
			<Head>
				<title>Microsoft Teams</title>
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</Head>
			<Row>
				<Col>
					<Text h2>Microsoft Teams</Text>
				</Col>
			</Row>
			<Spacer y={3} />
			<Grid.Container gap={2} direction="row">
				<Grid md={12}>
					<Card shadow>
						<Text>Start a new Meeting</Text>
						<Button
							icon={<PlusCircle />}
							type="success-light"
							shadow
							onClick={async () => {
								if (session) {
									await handleSubmit(session.user.name);
									setToast({
										text: 'Meeting Started',
										type: 'success'
									});
								} else void showErrorToast();
							}}
						>
							New Meeting
						</Button>
						<Divider y={4} />
						<form
							className="flex flex-row justify-between"
							onSubmit={async (e) => {
								e.preventDefault();
								if (session) {
									setToast({
										text: 'Meeting Joined Successfully',
										type: 'success'
									});
									push(`/${joinRoom}`);
								} else void showErrorToast();
							}}
						>
							<Input
								width="90%"
								icon={<FaRegKeyboard />}
								placeholder="Room Name"
								size="large"
								onChange={(e) => setJoinRoom(e.target.value)}
							/>
							<Button
								htmlType="submit"
								type="success"
								ghost
								auto
								icon={<PlusCircle />}
								shadow
							>
								Join
							</Button>
						</form>
						{prevMeeting && (
							<>
								<Divider y={2} />
								<div className="inline-flex gap-2">
									<Button
										type="secondary-light"
										shadow
										onClick={() => {
											push(`/${prevMeeting}`);
										}}
										ghost
									>
										Rejoin Meeting
									</Button>
									<button
										onClick={() => {
											window.localStorage.removeItem(
												'prevMeeting'
											);
											setPrevMeeting('');
										}}
									>
										<XCircleFill />
									</button>
								</div>
							</>
						)}
					</Card>
				</Grid>
				<Grid md={12}>
					<Image
						src="/homepageimg.jpg"
						alt="Promotional Image"
						width={500}
						height={300}
					/>
				</Grid>
			</Grid.Container>
		</>
	);
};

export default Home;
