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
import { useContext, useEffect, useState } from 'react';
import { FaRegKeyboard } from 'react-icons/fa';
import { MeetingContext } from '../lib/context/token';

export default function Home() {
	const [session] = useSession();
	const { push } = useRouter();
	const [_toasts, setToast] = useToasts();
	const { setToken } = useContext(MeetingContext);
	const [joinRoom, setJoinRoom] = useState('');
	const [prevMeeting, setPrevMeeting] = useState();

	const handleSubmit = async (username, roomName) => {
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

	useEffect(() => {
		let prevMeeingId = window.localStorage.getItem('prevMeeting');
		if (prevMeeingId) setPrevMeeting(prevMeeingId);
	}, []);

	return (
		<>
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
								} else
									setToast({
										text: 'Please log in first!',
										type: 'error'
									});
							}}
						>
							New Meeting
						</Button>
						<Divider y={4} />
						<form
							className="flex flex-row justify-between"
							onSubmit={async (e) => {
								e.preventDefault();
								console.log(e.roomname);
								if (session) {
									setToast({
										text: 'Meeting Joined Successfully',
										type: 'success'
									});
									push(`/${joinRoom}`);
								} else
									setToast({
										text: 'Please log in first!',
										type: 'error'
									});
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
											setPrevMeeting();
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
						width="500px"
						height="300px"
					/>
				</Grid>
			</Grid.Container>
		</>
	);
}
