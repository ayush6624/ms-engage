import { useState, useEffect, useRef, useContext } from 'react';
import styles from './participant.module.css';
import { MeetingContext } from '../lib/context/token';
import { API_BASE_URL } from '../lib/config';

const Participant = ({
	meetingId,
	participant,
	isHost = false,
	setScreenTrack
}) => {
	function printNetworkQualityStats(networkQualityLevel, networkStats) {
		console.log(
			{
				1: '▃',
				2: '▃▄',
				3: '▃▄▅',
				4: '▃▄▅▆',
				5: '▃▄▅▆▇'
			}[networkQualityLevel] || ''
		);
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
	const { userBackground } = useContext(MeetingContext);

	const videoRef = useRef();
	const audioRef = useRef();

	const trackPubsToTracks = (trackMap) =>
		Array.from(trackMap.values())
			.map((publication) => publication.track)
			.filter((track) => track !== null);

	useEffect(() => {
		const trackSubscribed = (track) => {
			if (track.kind === 'video') {
				setVideoTracks((videoTracks) => [...videoTracks, track]);
			} else {
				setAudioTracks((audioTracks) => [...audioTracks, track]);
			}
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
			img.src = '/twilio-video-processor/vacation.jpg';
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
	}, []);

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
		<div className="relative border border-green-400 rounded-xl">
			<p className="absolute bottom-0 mb-3 ml-5 shadow-xl text-white">
				{participant.identity}
			</p>
			<video
				// src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
				className={styles.video}
				ref={videoRef}
				autoPlay={true}
				width="350px"
				height="350px"
			/>
			<audio ref={audioRef} autoPlay={true} muted={false} />
		</div>
	);
};

export default Participant;
