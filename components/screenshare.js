import { useEffect, useRef } from 'react';

const ScreenShare = ({ screenTrack }) => {
	const screenRef = useRef();
	console.log('screntrack->', screenTrack);

	useEffect(() => {
		if (screenTrack) {
			screenTrack.attach(screenRef.current);
		}
	}, [screenTrack]);

	return (
		<div className="relative border border-green-400 rounded-xl">
			<p className="absolute bottom-0 mb-3 ml-5 shadow-xl text-white">
				Screen Share
			</p>
			<video ref={screenRef} autoPlay={true} />
		</div>
	);
};

export default ScreenShare;
