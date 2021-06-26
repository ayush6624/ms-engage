import { useState, useEffect, useRef } from 'react';
import styles from './participant.module.css';

const Participant = ({ participant }) => {
	const [videoTracks, setVideoTracks] = useState([]);
	const [audioTracks, setAudioTracks] = useState([]);

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

	return (
		<div className="nes-container with-title is-rounded">
			<p className="title">{participant.identity}</p>
			<video className={styles.video} ref={videoRef} autoPlay={true} />
			<audio ref={audioRef} autoPlay={true} muted={true} />
		</div>
	);
};

export default Participant;
