import { useContext, useEffect } from 'react';
import { MeetingContext } from '../lib/context/token';
import Room from '../components/room';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { useConnectionContext } from '../lib/context/ConnectionContext';

const Meet = (props) => {
	const { query, push } = useRouter();
	const [session, loading] = useSession();
	const { token, setToken } = useContext(MeetingContext);
	const { socketConnected, joinRoom, setRoomId, receiveMessages, setUser } =
		useConnectionContext();

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
			{typeof token === 'string' && token.length > 10 && (
				<Room roomName={query.id} token={token} />
			)}
		</div>
	);
};

export default Meet;
