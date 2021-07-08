import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Loading } from '@geist-ui/react';
const LoadingComponent = () => <Loading>Loading</Loading>;

const Excalidraw = dynamic(() => import('@excalidraw/excalidraw-next'), {
	ssr: false
});

export default function Whiteboard() {
	const excalidrawRef = useRef(null);
	const [canvasUrl, setCanvasUrl] = useState(null);

	return (
		<div className="App">
			<p className="font-bold">
				Scribble on the Whiteboard and share it with your friends!
			</p>
			<p>
				Click on export button in the top left toolbar and share it with
				your friends{' '}
			</p>
			<div className="excalidraw-wrapper">
				<Excalidraw ref={excalidrawRef} />
			</div>
		</div>
	);
}
