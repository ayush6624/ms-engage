import { useContext, useEffect, useState } from 'react';
import { MeetingContext } from '../lib/context/token';
import Room from '../components/room';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { useConnectionContext } from '../lib/context/ConnectionContext';
import ChatPanel from '../components/chat';
import { PlusCircle } from '@geist-ui/react-icons';
import {
	Grid,
	Text,
	Card,
	Button,
	useToasts,
	Divider,
} from '@geist-ui/react';
import { InviteMember } from '../components/Invite';

const Meet = () => {
	const { query, push } = useRouter();
	const [session, loading] = useSession();
	const { token, setToken, showMeeting, setShowMeeting } =
		useContext(MeetingContext);

	const { socketConnected, joinRoom, setRoomId, receiveMessages, setUser } =
		useConnectionContext();
	const [_toasts, setToast] = useToasts();

	useEffect(() => {
		setRoomId(query.id);
		setUser({ user: session?.user });
	}, [query.id, setRoomId, session, setUser]);

	useEffect(() => {
		if (socketConnected.current) {
			joinRoom();
			receiveMessages();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socketConnected.current]);

	if (loading) return <div>Authenticating</div>;
	if (session === null) {
		push('/');
		return <div>Please login first!</div>;
	}
	if (token === '') {
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
			{!showMeeting && (
				<div>
					{<ChatPanel />}
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
								<InviteMember roomName={query.id} />
							</Card>
						</Grid>
					</Grid.Container>
				</div>
			)}
			{typeof token === 'string' && token.length > 10 && showMeeting && (
				<Room roomName={query.id} token={token} />
			)}
		</div>
	);
};

export default Meet;
