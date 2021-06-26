import { useState, useCallback } from 'react';
import Lobby from './lobby';
import Room from './room';

const VideoChat = () => {
	const [username, setUsername] = useState('');
	const [roomName, setRoomName] = useState('');
	const [token, setToken] = useState(null);

	const handleUsernameChange = useCallback((event) => {
		setUsername(event.target.value);
	}, []);

	const handleRoomNameChange = useCallback((event) => {
		setRoomName(event.target.value);
	}, []);

	const handleSubmit = useCallback(
		async (event) => {
			event.preventDefault();
			const data = await fetch('/api/room', {
				method: 'POST',
				body: JSON.stringify({
					identity: username,
					room: roomName
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			}).then((res) => res.json());
			setToken(data.token);
			console.log(data);
		},
		[username, roomName]
	);

	const handleLogout = useCallback((event) => {
		setToken(null);
	}, []);

	return token ? (
		<div>
			<Room
				roomName={roomName}
				token={token}
				handleLogout={handleLogout}
			/>
		</div>
	) : (
		<Lobby
			username={username}
			roomName={roomName}
			handleUsernameChange={handleUsernameChange}
			handleRoomNameChange={handleRoomNameChange}
			handleSubmit={handleSubmit}
		/>
	);
};

export default VideoChat;
