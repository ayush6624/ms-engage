/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import Video, { createLocalTracks, LocalVideoTrack } from 'twilio-video';

import Participant from './participant';
import {
	User,
	Text,
	Image,
	Col,
	Code,
	Button,
	useTheme,
	Input,
	Modal,
	useClipboard,
	useToasts
} from '@geist-ui/react';
import Confetti from 'react-confetti';
import { useRouter } from 'next/router';
import {
	Mic,
	MicOff,
	Camera,
	CameraOff,
	Share,
	Airplay,
	Clipboard,
	Headphones,
	Users,
	ThumbsUp
} from '@geist-ui/react-icons';
import { GiPartyPopper } from 'react-icons/gi';

const Room = ({ roomName, token, handleLogout }) => {
	const [room, setRoom] = useState(null);
	const [participants, setParticipants] = useState([]); // ['x', 'y']
	const [showConfetti, setShowConfetti] = useState(false);
	const [mic, setMic] = useState(true);
	const [camera, setCamera] = useState(true);
	const [shareModal, setShareModal] = useState(false);
	const { copy } = useClipboard();
	const [, setToast] = useToasts();

	const theme = useTheme();

	const { push } = useRouter();
	useEffect(() => {
		if (showConfetti) {
			setTimeout(() => {
				setShowConfetti(false);
			}, 5000);
		}
	}, [showConfetti]);

	useEffect(() => {
		async function helper() {
			// const VideoProcessors = await import('@twilio/video-processors');

			// const setProcessor = (processor, track) => {
			// 	if (track.processor) {
			// 		track.removeProcessor(track.processor);
			// 	}
			// 	if (processor) {
			// 		track.addProcessor(processor);
			// 	}
			// };

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
			// const tracks = await createLocalTracks({
			// 	audio: true,
			// 	video: { facingMode: 'user' }
			// });

			Video.connect(token, {
				name: roomName
				// tracks
			}).then((room) => {
				setRoom(room);
				room.on('participantConnected', participantConnected);
				room.on('participantDisconnected', participantDisconnected);
				room.participants.forEach(participantConnected);
			});

			// const {
			// 	GaussianBlurBackgroundProcessor,
			// 	VirtualBackgroundProcessor,
			// 	isSupported
			// } = VideoProcessors;

			// const gaussianBlurProcessor = new GaussianBlurBackgroundProcessor({
			// 	assetsPath: '',
			// 	maskBlurRadius: 1,
			// 	blurFilterRadius: 1
			// });
			// await gaussianBlurProcessor.loadModel();
			// setProcessor(gaussianBlurProcessor, videoTrack);
		}
		helper();

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
		<div>
			<Modal open={shareModal} onClose={() => setShareModal(false)}>
				<Modal.Title>Share</Modal.Title>
				<Modal.Subtitle>Invite your friends over!</Modal.Subtitle>
				<Modal.Content className="mx-auto">
					<div className="flex flex-row items-center justify-around">
						<Code>{roomName}</Code>
						<Button
							size="small"
							auto
							onClick={() => {
								copy(
									`https://teams.ayushgoyal.dev/${roomName}`
								);
								setToast({
									text: 'Copied to clipboard',
									type: 'secondary'
								});
							}}
						>
							Copy
						</Button>
					</div>

					<form
						onSubmit={(e) => {
							e.preventDefault();
							setToast({
								text: 'Invitation Sent Successfully',
								type: 'success'
							});
						}}
						className="mt-3 flex flex-row justify-around items-center"
					>
						<Input placeholder="Email ID" type="email"></Input>
						<Input type="submit" icon={<Share />} />
					</form>
					<div className="mt-3">
						{participants.map((d, i) => (
							<div key={i} className="my-1">
								<User
									src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png"
									name={d.identity}
								/>
							</div>
						))}
					</div>
				</Modal.Content>
				<Modal.Action passive onClick={() => setShareModal(false)}>
					Done
				</Modal.Action>
			</Modal>
			{showConfetti && <Confetti width={'1000px'} height={'800px'} />}
			<aside className="absolute bottom-0 w-full z-20 items-center text-gray-700 shadow-xl rounded-xl flex justify-center">
				<ul className="flex flex-row space-x-5">
					<li>
						<button
							className={`p-4 ${
								theme.type === 'dark'
									? 'bg-gray-450'
									: 'bg-white'
							} rounded-full shadow-xl transition ease-in-out duration-300 ${
								!mic && 'bg-red-500'
							}`}
							onClick={() => {
								room.localParticipant.audioTracks.forEach(
									(publication) => {
										mic
											? publication.track.disable()
											: publication.track.enable();
									}
								);
								setMic(!mic);
							}}
						>
							{mic ? <Mic /> : <MicOff />}
						</button>
					</li>
					<li>
						<button
							className={`p-4 ${
								theme.type === 'dark'
									? 'bg-gray-450'
									: 'bg-white'
							} rounded-full shadow-xl transition ease-in-out duration-300 ${
								!camera && 'bg-red-500'
							}`}
							onClick={() => {
								room.localParticipant.videoTracks.forEach(
									(publication) => {
										camera
											? publication.track.disable()
											: publication.track.enable();
									}
								);
								setCamera(!camera);
							}}
						>
							{camera ? <Camera /> : <CameraOff />}
						</button>
					</li>
					<li>
						<button
							className={`p-4 ${
								theme.type === 'dark'
									? 'bg-gray-450'
									: 'bg-white'
							} rounded-full shadow-xl transition ease-in-out duration-300  ${
								showConfetti && 'bg-red-500'
							}`}
							onClick={() => setShowConfetti(true)}
						>
							<GiPartyPopper size="25px" />
						</button>
					</li>
					<li>
						<button
							className={`p-4 ${
								theme.type === 'dark'
									? 'bg-gray-450'
									: 'bg-white'
							} rounded-full shadow-xl`}
							onClick={async () => {
								const stream =
									await navigator.mediaDevices.getDisplayMedia();
								const screenTrack = new LocalVideoTrack(
									stream.getTracks()[0]
								);
								room.localParticipant.publishTrack(screenTrack);
							}}
						>
							<Airplay />
						</button>
					</li>
					<li>
						<button
							className="p-4 w-24 rounded-full shadow-xl bg-red-600"
							onClick={() => {
								console.log('disconnect');
								// window.location.href = '/';
								push('/');
								room.disconnect();
							}}
						>
							<img
								src="https://img.icons8.com/material-outlined/24/000000/end-call.png"
								className="mx-auto"
								alt="End Call"
							/>
						</button>
					</li>
					<li>
						<button
							className={`p-4 ${
								theme.type === 'dark'
									? 'bg-gray-450'
									: 'bg-white'
							} rounded-full shadow-xl`}
							onClick={() => setShareModal(true)}
						>
							<Users />
						</button>
					</li>
				</ul>
			</aside>
			<div className="grid grid-cols-2 grid-flow-cols gap-3">
				{room && (
					<Participant
						isHost={true}
						key={room.localParticipant.sid}
						participant={room.localParticipant}
					/>
				)}
				{remoteParticipants}
			</div>
		</div>
	);
};

export default Room;
