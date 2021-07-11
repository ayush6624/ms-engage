import { useState, useEffect, useContext } from 'react';
import Video, {
	LocalVideoTrack,
	RemoteParticipant,
	Room as RoomType
} from 'twilio-video';
import ScreenShare from './ScreenShare';
import Participant from './Participant';
import { User, Modal, useToasts } from '@geist-ui/react';
import Confetti from 'react-confetti';
import {
	Mic,
	MicOff,
	Camera,
	CameraOff,
	Airplay,
	Users,
	MessageSquare
} from '@geist-ui/react-icons';
import { GiPartyPopper } from 'react-icons/gi';
import { MeetingContext } from '../lib/context/MeetingContext';
import ControlButton, { ChangeBackground, EndCall } from './ControlButton';
import VirtualBackgroundModal from './VirtualBackground';
import ChatPanel from './Chat';
import { InviteMember } from './Invite';
import { useConnectionContext } from '../lib/context/ConnectionContext';

interface RoomProps {
	roomName: string;
	token: string;
}

const Room: React.FC<RoomProps> = ({ roomName, token }) => {
	const [room, setRoom] = useState<RoomType>(null);
	const [showBgModal, setShowBgModal] = useState(false);
	const [participants, setParticipants] = useState<RemoteParticipant[]>([]);
	const [mic, setMic] = useState<boolean>(true);
	const [camera, setCamera] = useState<boolean>(true);
	const [shareModal, setShareModal] = useState<boolean>(false);
	const [shareScreen, setShareScreen] = useState<boolean>(false);
	const [screenTrack, setScreenTrack] = useState<LocalVideoTrack>(null);
	const [showChatPanel, setShowChatPanel] = useState<boolean>(false);
	const [, setToast] = useToasts();
	const { userBackground } = useContext(MeetingContext);
	const { celebrate, showConfetti, setShowConfetti } = useConnectionContext();

	const shareScreenHandler = async () => {
		if (!screenTrack) {
			navigator.mediaDevices
				//@ts-ignore
				.getDisplayMedia()
				.then((stream: any) => {
					const temp = new LocalVideoTrack(stream.getTracks()[0]);
					setScreenTrack(temp);
					room.localParticipant.publishTrack(temp);
					temp.mediaStreamTrack.onended = () => {
						shareScreenHandler();
					};
				})
				.catch(() => setShareScreen(false));
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
			celebrate();
			setTimeout(() => {
				setShowConfetti(false);
			}, 5000);
		}
	}, [showConfetti]);

	useEffect(() => {
		async function helper() {
			const participantConnected = (participant: RemoteParticipant) => {
				setParticipants((prevParticipants) => [
					...prevParticipants,
					participant
				]);
			};
			const participantDisconnected = (
				participant: RemoteParticipant
			) => {
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
						//@ts-ignore
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
			<div className="flex right-0 absolute">
				{showChatPanel && <ChatPanel />}
			</div>
			<Modal open={shareModal} onClose={() => setShareModal(false)}>
				<Modal.Title>Share</Modal.Title>
				<Modal.Subtitle>Invite your friends over!</Modal.Subtitle>
				<Modal.Content className="mx-auto">
					<InviteMember roomName={roomName} />
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
			{showBgModal && (
				<VirtualBackgroundModal
					showModal={showBgModal}
					setShowModal={setShowBgModal}
				/>
			)}
			{showConfetti && <Confetti width={1000} height={800} />}
			<aside className="absolute bottom-0 w-full z-20 items-center text-gray-700 shadow-xl rounded-xl flex justify-center">
				<ul className="flex flex-row space-x-5 flex-wrap">
					<li>
						<ControlButton
							toolTipText={'Toggle Mic'}
							state={!mic}
							onClick={() => {
								room.localParticipant.audioTracks.forEach(
									(publication) =>
										mic
											? publication.track.disable()
											: publication.track.enable()
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
									(publication) =>
										camera
											? publication.track.disable()
											: publication.track.enable()
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
							onClick={async () =>
								setShowChatPanel(!showChatPanel)
							}
							icon={<MessageSquare />}
						/>
					</li>
					<li>
						<EndCall room={room} setToast={setToast} />
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
