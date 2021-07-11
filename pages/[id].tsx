import { useContext, useEffect } from 'react';
import { MeetingContext } from '../lib/context/MeetingContext';
import Room from '../components/Room';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { useConnectionContext } from '../lib/context/ConnectionContext';
import ChatPanel from '../components/Chat';
import { PlusCircle } from '@geist-ui/react-icons';
import { Grid, Text, Card, Button, useToasts, Divider } from '@geist-ui/react';
import { InviteMember } from '../components/Invite';
import Head from 'next/head';

// Renders the Meeting's Room
const RoomPage = (): JSX.Element => {
	const { query, push } = useRouter(); // manage client-side-routing
	const [session, loading] = useSession(); // manage session state
	const { token, setToken, showMeeting, setShowMeeting } =
		useContext(MeetingContext); // manage meeting context

	const {
		socketConnected,
		joinRoom,
		setRoomId,
		receiveMessages,
		receiveCelebration,
		setUser
	} = useConnectionContext();
	const [_toasts, setToast] = useToasts(); // Manage Toast notifications

	useEffect(() => {
		setRoomId(query.id);
		setUser({ user: session?.user });
	}, [query.id, setRoomId, session, setUser]);

	useEffect(() => {
		if (socketConnected.current) {
			joinRoom(); // joins the room
			receiveMessages(); // Socket listener for celebration events
			receiveCelebration(); // Socket listener for receiving messages
		}
	}, [socketConnected.current]);

	if (loading) return <div>Authenticating</div>; // If loading user auth state, return a loading message
	if (session === null) {
		window.location.replace('/?login=false');
		return <div>Please login first!</div>;
	}
	if (token === '') {
		// Fetch paticipants auth token to connect to the meeting
		fetch('/api/room', {
			method: 'POST',
			body: JSON.stringify({
				identity: session.user?.name ?? 'Anonymous Jimmy',
				room: query.id ?? undefined
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => res.json())
			.then((data) => setToken(data.token));
	}

	return (
		<div>
			<Head>
				<title>Teams - {query.id}</title>
			</Head>
			{!showMeeting && (
				// Show room metadata before joining the room
				<div>
					{
						<div className="hidden md:block">
							<ChatPanel />
						</div>
					}
					<Grid.Container gap={2} direction="row">
						<Grid md={12}>
							<Card shadow>
								<Text>Join the Room</Text>
								<Button
									icon={<PlusCircle />}
									type="success-light"
									shadow
									onClick={async () => {
										console.log('buton clciked');
										setShowMeeting(true);
										setToast({
											text: 'Meeting Started',
											type: 'success'
										});
									}}
								>
									Join Meeting
								</Button>
								<Divider y={3} />
								<Text>Invite your friends over!</Text>
								<InviteMember roomName={query.id} />
							</Card>
						</Grid>
					</Grid.Container>
				</div>
			)}
			{typeof token === 'string' && token.length > 10 && showMeeting && (
				// Render the meeting component if user joins the meeting
				<Room roomName={query.id as string} token={token} />
			)}
		</div>
	);
};

export default RoomPage;
