import { useEffect, useRef } from 'react';
import { LocalVideoTrack } from 'twilio-video';
import { Card } from '@geist-ui/react';

interface ScreenShareProps {
	/* Controls the video track (of the screenshare) */
	screenTrack: LocalVideoTrack;
}

const ScreenShare: React.FC<ScreenShareProps> = ({ screenTrack }) => {
	const screenRef = useRef<HTMLVideoElement>(null); // reference to the video element

	useEffect(() => {
		if (screenTrack) {
			// Attach the video element to the DOM
			screenTrack.attach(screenRef.current);
		}
	}, [screenTrack]);

	return (
		<Card hoverable shadow className="relative rounded-xl">
			<video
				ref={screenRef}
				autoPlay={true}
				className="max-h-100 max-w-md"
			/>
			<div className="mb-3 mt-3 flex flex-row space-x-3 items-center w-full">
				<span>Screen Share</span>
			</div>
		</Card>
	);
};

export default ScreenShare;
