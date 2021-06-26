import { useState, useEffect } from 'react';
import Video from 'twilio-video';
import Participant from './participant';
import styles from './room.module.css';
import { Row, Text, Image, Col, Card, Button } from '@geist-ui/react';

const Room = ({ roomName, token, handleLogout }) => {
	const [room, setRoom] = useState(null);
	const [participants, setParticipants] = useState([]);

	useEffect(() => {
		const participantConnected = (participant) => {
			setParticipants((prevParticipants) => [
				...prevParticipants,
				participant
			]);
		};
		const participantDisconnected = (participant) => {
			setParticipants((prevParticipants) =>
				prevParticipants.filter((p) => p !== participant)
			);
		};
		Video.connect(token, {
			name: roomName
		}).then((room) => {
			setRoom(room);
			room.on('participantConnected', participantConnected);
			room.on('participantDisconnected', participantDisconnected);
			room.participants.forEach(participantConnected);
		});

		return () => {
			setRoom((currentRoom) => {
				if (
					currentRoom &&
					currentRoom.localParticipant.state === 'connected'
				) {
					currentRoom.localParticipant.tracks.forEach(function (
						trackPublication
					) {
						trackPublication.track.stop();
					});
					currentRoom.disconnect();
					return null;
				} else {
					return currentRoom;
				}
			});
		};
	}, [roomName, token]);

	const remoteParticipants = participants.map((participant) => (
		<Participant key={participant.sid} participant={participant} />
	));

	return (
		<div className="nes-container with-title is-centered">
			<p className="title">Room: {roomName}</p>
			<button className="nes-btn is-primary">Log out</button>
			<div className={styles.parent}>
				{room && (
					<div className={styles.box}>
						<Participant
							key={room.localParticipant.sid}
							participant={room.localParticipant}
						/>
					</div>
				)}
				<div className={styles.box}>
					<h3>Opponent</h3>
					{remoteParticipants}
				</div>
			</div>
		</div>
	);
};

export default Room;
