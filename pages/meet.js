import { useRef } from 'react';
import { useEffect } from 'react';
import { connect, createLocalTracks } from 'twilio-video';
import {
	Row,
	Spacer,
	Page,
	Text,
	Image,
	Col,
	Card,
	Tabs,
	Button
} from '@geist-ui/react';
import VideoChat from '../components/videochat';

const Meet = () => {
	const videoContainerRef = useRef(null);
	return (
		<div>
			<VideoChat />
		</div>
	);
};

export default Meet;
