/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useContext } from 'react';
import Video, { LocalVideoTrack } from 'twilio-video';
import ScreenShare from './screenshare';
import Participant from './participant';
import { API_BASE_URL } from '../lib/config';
import {
	User,
	Code,
	Button,
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
	MessageSquare,
	ThumbsUp
} from '@geist-ui/react-icons';
import { GiPartyPopper } from 'react-icons/gi';
import { FaChalkboardTeacher } from 'react-icons/fa';
import Whiteboard from './whiteboard';
import { MeetingContext } from '../lib/context/token';
import ControlButton, { ChangeBackground, EndCall } from './ControlButton';
import VirtualBackgroundModal from './VirtualBackground';
import ChatPanel from './chat';

const Room = ({ roomName, token }) => {
	const [room, setRoom] = useState(null);
	const [inviteEmail, setInviteEmail] = useState();
	const [showBgModal, setShowBgModal] = useState(false);
	const [participants, setParticipants] = useState([]); // ['x', 'y']
	const [showConfetti, setShowConfetti] = useState(false);
	const [mic, setMic] = useState(true);
	const [camera, setCamera] = useState(true);
	const [shareModal, setShareModal] = useState(false);
	const [shareScreen, setShareScreen] = useState(false);
	const [screenTrack, setScreenTrack] = useState(null);
	const [showWhiteboard, setShowWhiteboard] = useState(false);
	const [showChatPanel, setShowChatPanel] = useState(false);
	const { copy } = useClipboard();
	const [, setToast] = useToasts();
	const { userBackground } = useContext(MeetingContext);
	const { push } = useRouter();

	const shareScreenHandler = async () => {
		if (!screenTrack) {
			navigator.mediaDevices
				.getDisplayMedia()
				.then((stream) => {
					const temp = new LocalVideoTrack(stream.getTracks()[0]);
					setScreenTrack(temp);
					room.localParticipant.publishTrack(temp);
					temp.mediaStreamTrack.onended = () => {
						shareScreenHandler();
					};
				})
				.catch((err) => setShareScreen(false));
		} else {
			room.localParticipant.unpublishTrack(screenTrack);
			screenTrack.stop();
			setScreenTrack(null);
		}
	};

	useEffect(
		() => window.localStorage.setItem('prevMeeting', roomName),
		[roomName]
	);

	useEffect(() => {
		if (showConfetti) {
			setTimeout(() => {
				setShowConfetti(false);
			}, 5000);
		}
	}, [showConfetti]);

	useEffect(() => {
		async function helper() {
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
				name: roomName,
				networkQuality: {
					local: 1,
					remote: 2
				}
				// tracks
			}).then((room) => {
				setRoom(room);
				room.localParticipant.setNetworkQualityConfiguration({
					local: 2,
					remote: 1
				});
				room.on('participantConnected', participantConnected);
				room.on('participantDisconnected', participantDisconnected);
				room.participants.forEach(participantConnected);
			});
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
		<Participant
			meetingId={roomName}
			key={participant.sid}
			participant={participant}
			setScreenTrack={setScreenTrack}
		/>
	));

	return (
		<div>
			<div className="flex right-0 absolute">{showChatPanel && <ChatPanel />}</div>
			<Modal open={shareModal} onClose={() => setShareModal(false)}>
				<Modal.Title>Share</Modal.Title>
				<Modal.Subtitle>Invite your friends over!</Modal.Subtitle>
				<Modal.Content className="mx-auto">
					<div className="flex flex-row items-center justify-around">
						<Code>{roomName}</Code>
						<Button
							size="small"
							auto
							icon={<Clipboard />}
							onClick={() => {
								copy(
									`https://teams.ayushgoyal.dev/${roomName}`
								);
								setToast({
									text: 'Copied to clipboard',
									type: 'secondary'
								});
								setShareModal(false);
							}}
						>
							Copy
						</Button>
					</div>

					<form
						onSubmit={async (e) => {
							e.preventDefault();
							await fetch(`${API_BASE_URL}/invite`, {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({
									email: inviteEmail,
									id: roomName
								})
							});
							setToast({
								text: 'Invitation Sent Successfully',
								type: 'success'
							});
							setInviteEmail('');
							setShareModal(false);
						}}
						className="mt-3 flex flex-row justify-around items-center"
					>
						<Input
							placeholder="Email ID"
							type="email"
							onChange={(e) => setInviteEmail(e.target.value)}
						></Input>
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
			<Modal
				open={showWhiteboard}
				width="70vw"
				onClose={() => setShowWhiteboard(false)}
			>
				<Whiteboard />
			</Modal>
			{showBgModal && (
				<VirtualBackgroundModal
					showModal={showBgModal}
					setShowModal={setShowBgModal}
				/>
			)}
			{showConfetti && <Confetti width={'1000px'} height={'800px'} />}
			<aside className="absolute bottom-0 w-full z-20 items-center text-gray-700 shadow-xl rounded-xl flex justify-center">
				<ul className="flex flex-row space-x-5 flex-wrap">
					<li>
						<ControlButton
							toolTipText={'Toggle Mic'}
							state={!mic}
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
							icon={<Mic />}
							activeIcon={<MicOff />}
						/>
					</li>
					<li>
						<ControlButton
							toolTipText={'Toggle Camera'}
							state={!camera}
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
							icon={<Camera />}
							activeIcon={<CameraOff />}
						/>
					</li>
					<li>
						<ControlButton
							toolTipText={'Switch Background'}
							state={userBackground !== ''}
							onClick={() => {
								setShowBgModal(!showBgModal);
							}}
							icon={<ChangeBackground />}
						/>
					</li>
					<li>
						<ControlButton
							toolTipText={'Celebrate 🎉'}
							state={showConfetti}
							onClick={() => setShowConfetti(true)}
							icon={<GiPartyPopper size="25px" />}
						/>
					</li>
					<li className="hidden md:block">
						<ControlButton
							toolTipText={'Share your screen'}
							state={shareScreen}
							onClick={async () => {
								shareScreenHandler();
								setShareScreen(!shareScreen);
							}}
							icon={<Airplay />}
						/>
					</li>
					<li>
						<ControlButton
							toolTipText={'Chat'}
							state={showChatPanel}
							onClick={async () => {
								setShowChatPanel(!showChatPanel);
							}}
							icon={<MessageSquare />}
						/>
					</li>
					<li className="hidden md:block">
						<ControlButton
							toolTipText={'WhiteBoard'}
							state={showWhiteboard}
							onClick={() => setShowWhiteboard(true)}
							icon={<FaChalkboardTeacher size="25px" />}
						/>
					</li>
					<li>
						<EndCall room={room} push={push} />
					</li>
					<li>
						<ControlButton
							toolTipText={'Show Members & Invite Friends'}
							state={shareModal}
							onClick={() => setShareModal(true)}
							icon={<Users />}
						/>
					</li>
				</ul>
			</aside>
			<div className="grid grid-cols-2 grid-flow-cols gap-3">
				{room && (
					<Participant
						meetingId={roomName}
						isHost={true}
						key={room.localParticipant.sid}
						participant={room.localParticipant}
					/>
				)}
				{screenTrack && <ScreenShare screenTrack={screenTrack} />}
				{remoteParticipants}
			</div>
		</div>
	);
};

export default Room;
