import { useState, useEffect, useRef, useContext } from 'react';
import { MeetingContext } from '../lib/context/token';
import { API_BASE_URL } from '../lib/config';
import { Mic, MicOff, Camera, CameraOff } from '@geist-ui/react-icons';
import { Card } from '@geist-ui/react';

const Participant = ({
	meetingId,
	participant,
	isHost = false,
	setScreenTrack
}) => {
	function printNetworkQualityStats(networkQualityLevel, networkStats) {
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
			fetch(`${API_BASE_URL}/health`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					meetingId,
					audioRecv: networkStats.audio.recv,
					audioSend: networkStats.audio.send,
					videoRecv: networkStats.video.recv,
					videoSend: networkStats.video.send
				})
			});
		}
	}
	const [videoTracks, setVideoTracks] = useState([]);
	const [audioTracks, setAudioTracks] = useState([]);
	const { userBackground, userBgLink } = useContext(MeetingContext);
	const [isVideoEnabled, setIsVideoEnabled] = useState(true);
	const [isAudioEnabled, setIsAudioEnabled] = useState(true);
	const [nwQuality, setNwquality] = useState('');

	const videoRef = useRef();
	const audioRef = useRef();

	const trackPubsToTracks = (trackMap) =>
		Array.from(trackMap.values())
			.map((publication) => publication.track)
			.filter((track) => track !== null);

	useEffect(() => {
		const trackDisabled = (track) => {
			track.on('disabled', () => {
				if (track.kind === 'video') {
					setIsVideoEnabled(false);
				}
				if (track.kind === 'audio') {
					setIsAudioEnabled(false);
				}
			});
		};

		const trackEnabled = (track) => {
			track.on('enabled', () => {
				if (track.kind === 'video') {
					setIsVideoEnabled(true);
				}
				if (track.kind === 'audio') {
					setIsAudioEnabled(true);
				}
			});
		};

		const trackSubscribed = (track) => {
			if (track.kind === 'video') {
				setVideoTracks((videoTracks) => [...videoTracks, track]);
			} else {
				setAudioTracks((audioTracks) => [...audioTracks, track]);
			}
			trackDisabled(track);
			trackEnabled(track);
		};

		const trackUnsubscribed = (track) => {
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
			while (true) {
				if (remoteTrackPublication.track) break;
				await new Promise((res) => {
					setTimeout(res, 1);
				});
			}
			setScreenTrack(remoteTrackPublication.track);
		});
		participant.tracks.forEach((publication) => {
			if (publication.track) {
				trackDisabled(publication.track);
				trackEnabled(publication.track);

				publication.track.on('disabled', (track) =>
					trackDisabled(track)
				);
				publication.track.on('enabled', (track) => trackEnabled(track));
			}
		});
		participant.on('trackUnpublished', (remoteTrackPublication) => {
			setScreenTrack(null);
		});
		participant.on('networkQualityLevelChanged', printNetworkQualityStats);
		printNetworkQualityStats(
			participant.networkQualityLevel,
			participant.networkStats
		);

		return () => {
			setVideoTracks([]);
			setAudioTracks([]);
			participant.removeAllListeners();
		};
	}, [participant]);

	useEffect(() => {
		const videoTrack = videoTracks[0];
		if (videoTrack) {
			videoTrack.attach(videoRef.current);
			return () => {
				videoTrack.detach();
			};
		}
	}, [videoTracks]);

	useEffect(() => {
		const audioTrack = audioTracks[0];
		if (audioTrack) {
			audioTrack.attach(audioRef.current);
			return () => {
				audioTrack.detach();
			};
		}
	}, [audioTracks]);

	const [virtualBackground, setVirtualBackground] = useState();
	const [blurBackground, setBlurBackground] = useState();

	useEffect(() => {
		const blurBackgroundHelper = async () => {
			const { GaussianBlurBackgroundProcessor } = await import(
				'@twilio/video-processors'
			);
			const blurBg = new GaussianBlurBackgroundProcessor({
				assetsPath: ''
			});
			setBlurBackground(blurBg);
		};

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

	const setProcessor = (processor, track) => {
		removeProcessor(track);
		if (processor) {
			track?.addProcessor(processor);
		}
	};

	const removeProcessor = (track) => {
		if (track?.processor) {
			track?.removeProcessor(track.processor);
		}
	};

	function toggleBackground(bgType) {
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
	}

	return (
		<Card hoverable shadow className="relative rounded-xl">
			<video
				// src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
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
