import { useContext } from 'react';
import { MeetingContext } from '../lib/context/token';
import Room from '../components/room';
import { useRouter } from 'next/router';

const Meet = () => {
	const { token } = useContext(MeetingContext);
	const { query } = useRouter();

	return (
		<div>
			<Room roomName={query.id} token={token} />
		</div>
	);
};

export default Meet;
