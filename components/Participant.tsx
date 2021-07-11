import {
	useState,
	useEffect,
	useRef,
	useContext,
	Dispatch,
	SetStateAction
} from 'react';
import { MeetingContext } from '../lib/context/MeetingContext';
import { API_BASE_URL } from '../lib/config';
import { Mic, MicOff, Camera, CameraOff } from '@geist-ui/react-icons';
import { Card } from '@geist-ui/react';
import {
	LocalParticipant,
	LocalVideoTrack,
	NetworkQualityStats,
	RemoteParticipant,
	RemoteTrack
} from 'twilio-video';
import { AllTrackPublications, AllTrackTypes, bgType } from '../lib/types';

interface ParticipantProps {
	/* Current meeting / room id */
	meetingId: string;

	/* Participant (Remote/Local) */
	participant?: RemoteParticipant | LocalParticipant;

	/* If the currentparticipant is a local (and host) participant */
	isHost?: boolean;

	/* Sets the screen share track */
	setScreenTrack?: Dispatch<SetStateAction<LocalVideoTrack | RemoteTrack>>;
}

const Participant: React.FC<ParticipantProps> = ({
	meetingId,
	participant,
	isHost = false,
	setScreenTrack
}) => {
	const [videoTracks, setVideoTracks] = useState<AllTrackTypes[]>([]); // Manages the video tracks of a participant
	const [audioTracks, setAudioTracks] = useState([]); // Manages the audio tracks of a participant
	const { userBackground, userBgLink } = useContext(MeetingContext); // Manages the virtual background of a participant
	const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(true); // If the participant's video is enabled
	const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true); // If the participant's audio is enabled
	const [nwQuality, setNwquality] = useState<string>(''); // Manages the network quality of a participant
	const [virtualBackground, setVirtualBackground] = useState<any>();
	const [blurBackground, setBlurBackground] = useState<any>(); // Manages the blur background of a participant
	const videoRef = useRef<HTMLVideoElement>(); // Manages the video of a participant
	const audioRef = useRef<HTMLAudioElement>(); // Manages the audio of a participant

	const printNetworkQualityStats = (
		networkQualityLevel: number | string,
		networkStats: NetworkQualityStats
	) => {
		const quality =
			{
				1: '▃',
				2: '▃▄',
				3: '▃▄▅',
				4: '▃▄▅▆',
				5: '▃▄▅▆▇'
			}[networkQualityLevel] || '';
		setNwquality(quality);
		if (networkStats) {
			// Post the current network participants to the API (Scale of 1 - 5)
			fetch(`${API_BASE_URL}/health`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					meetingId,
					audioRecv: networkStats.audio.recv, // Audio received
					audioSend: networkStats.audio.send, // Audio sent
					videoRecv: networkStats.video.recv, // Video received
					videoSend: networkStats.video.send // Video sent
				})
			});
		}
	};

	// Keeps track of all the publications (audio + video) and also removes the ones that are not used anymore
	const trackPubsToTracks = (trackMap: Map<string, AllTrackPublications>) =>
		Array.from(trackMap.values())
			.map((publication) => publication.track)
			.filter((track) => track !== null);

	useEffect(() => {
		// Track Disabled Event Listener
		const trackDisabled = (track: RemoteTrack) => {
			track.on('disabled', () => {
				if (track.kind === 'video') {
					setIsVideoEnabled(false);
				}
				if (track.kind === 'audio') {
					setIsAudioEnabled(false);
				}
			});
		};

		// Track Enabled Event Listener
		const trackEnabled = (track: RemoteTrack) => {
			track.on('enabled', () => {
				if (track.kind === 'video') {
					setIsVideoEnabled(true);
				}
				if (track.kind === 'audio') {
					setIsAudioEnabled(true);
				}
			});
		};

		// Adds tracks to state
		const trackSubscribed = (track: RemoteTrack) => {
			if (track.kind === 'video') {
				setVideoTracks((videoTracks) => [...videoTracks, track]);
			} else {
				setAudioTracks((audioTracks) => [...audioTracks, track]);
			}
			trackDisabled(track);
			trackEnabled(track);
		};

		//  Removes unsubscribed tracks from state
		const trackUnsubscribed = (track: RemoteTrack) => {
			if (track.kind === 'video') {
				setVideoTracks((videoTracks) =>
					videoTracks.filter((v) => v !== track)
				);
			} else {
				setAudioTracks((audioTracks) =>
					audioTracks.filter((a) => a !== track)
				);
			}
		};

		setVideoTracks(trackPubsToTracks(participant.videoTracks));
		setAudioTracks(trackPubsToTracks(participant.audioTracks));
		participant.on('trackSubscribed', trackSubscribed);
		participant.on('trackUnsubscribed', trackUnsubscribed);
		participant.on('trackPublished', async (remoteTrackPublication) => {
			// Shows new video tracks from the same participant (in case of screen sharing)
			while (true) {
				if (remoteTrackPublication.track) break;
				await new Promise((res) => {
					setTimeout(res, 1);
				});
			}
			setScreenTrack(remoteTrackPublication.track);
		});

		// Loops through all the tracks and calls the appropirate functions
		participant.tracks.forEach((publication) => {
			if (publication.track) {
				trackDisabled(publication.track);
				trackEnabled(publication.track);

				publication.track.on('disabled', (track: RemoteTrack) =>
					trackDisabled(track)
				);
				publication.track.on('enabled', (track: RemoteTrack) =>
					trackEnabled(track)
				);
			}
		});

		// Listner for screenshare disabled
		participant.on('trackUnpublished', () => {
			setScreenTrack(null);
		});

		// Listner for change in network quality
		participant.on('networkQualityLevelChanged', printNetworkQualityStats);
		printNetworkQualityStats(
			participant.networkQualityLevel,
			//@ts-ignore
			participant.networkStats
		);

		// Cleanup all tracks on unmount
		return () => {
			setVideoTracks([]);
			setAudioTracks([]);
			participant.removeAllListeners();
		};
	}, [participant]);

	useEffect(() => {
		// Appends video to DOM
		const videoTrack = videoTracks[0];
		if (videoTrack) {
			videoTrack.attach(videoRef.current);
			return () => {
				videoTrack.detach();
			};
		}
	}, [videoTracks]);

	useEffect(() => {
		// Appends audio to DOM
		const audioTrack = audioTracks[0];
		if (audioTrack) {
			audioTrack.attach(audioRef.current);
			return () => {
				audioTrack.detach();
			};
		}
	}, [audioTracks]);

	useEffect(() => {
		// Dynamically import library client-side and sets a Gaussian Blur filter
		const blurBackgroundHelper = async () => {
			const { GaussianBlurBackgroundProcessor } = await import(
				'@twilio/video-processors'
			);
			const blurBg = new GaussianBlurBackgroundProcessor({
				assetsPath: ''
			});
			setBlurBackground(blurBg);
		};

		// Dynamic import library client-side and sets a Image as bg
		const virtualBackgroundHelper = async () => {
			const { VirtualBackgroundProcessor } = await import(
				'@twilio/video-processors'
			);

			const img = new Image();
			img.src = userBgLink ?? '/twilio-video-processor/vacation.jpg';
			img.onload = () => {
				const virtualBg = new VirtualBackgroundProcessor({
					assetsPath: '',
					backgroundImage: img
				});
				setVirtualBackground(virtualBg);
			};
		};

		virtualBackgroundHelper();
		blurBackgroundHelper();
	}, [userBgLink]);

	useEffect(() => {
		if (virtualBackground && blurBackground) {
			toggleBackground(userBackground);
		}
	}, [userBackground, virtualBackground, blurBackground]);

	// Sets an (intermediate) processor to the video stream
	const setProcessor = (processor: any, track) => {
		removeProcessor(track);
		if (processor) {
			track?.addProcessor(processor);
		}
	};

	// Removes the processor from the video stream
	const removeProcessor = (track) => {
		if (track?.processor) {
			track?.removeProcessor(track.processor);
		}
	};

	// Toggles between blur and virtual background
	const toggleBackground = (bgType: bgType) => {
		if (!isHost) return;
		if (!videoTracks[0]) return;
		const videoTrack = videoTracks[0];
		if (bgType === null || bgType === '') {
			removeProcessor(videoTrack);
			return;
		}

		const backgroundProcessor =
			bgType === 'blur' ? blurBackground : virtualBackground;

		backgroundProcessor
			.loadModel()
			.then(() => setProcessor(backgroundProcessor, videoTrack));
	};

	return (
		<Card hoverable shadow className="relative rounded-xl">
			<video
				ref={videoRef}
				autoPlay={true}
				className="max-h-100 max-w-md"
			/>
			<audio ref={audioRef} autoPlay={true} muted={false} />
			<div className="mb-3 mt-3 flex flex-row space-x-3 items-center w-full">
				{isAudioEnabled ? (
					<Mic className="h-5 w-5" />
				) : (
					<MicOff className="h-5 w-5" />
				)}
				{isVideoEnabled ? (
					<Camera className="h-5 w-5" />
				) : (
					<CameraOff className="h-5 w-5" />
				)}
				<span>{nwQuality}</span>
				<span>
					{participant.identity} {isHost ? '(You)' : ''}
				</span>
			</div>
		</Card>
	);
};

export default Participant;
