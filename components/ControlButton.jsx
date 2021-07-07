/* eslint-disable @next/next/no-img-element */
import { Tooltip, useTheme } from '@geist-ui/react';
import { useContext } from 'react';
import { MeetingContext } from '../lib/context/token';

export const ChangeBackground = () => (
	<img
		src="/background.svg"
		className="stroke-current text-black"
		width="28px"
		height="28px"
		alt="change background"
	/>
);

export const EndCall = ({ room, setToast }) => {
	const { setShowMeeting } = useContext(MeetingContext);
	return (
		<button
			className="p-4 w-24 rounded-full shadow-xl bg-red-600"
			onClick={() => {
				room.disconnect();
				setToast({
					text: 'Meeting Exited Successfully',
					type: 'error'
				});
				setShowMeeting(false);
			}}
		>
			<img
				src="https://img.icons8.com/material-outlined/24/000000/end-call.png"
				className="mx-auto"
				alt="End Call"
			/>
		</button>
	);
};

const ControlButton = ({ toolTipText, state, onClick, icon, activeIcon }) => {
	const theme = useTheme();

	return (
		<Tooltip text={toolTipText}>
			<button
				className={`p-4 ${
					theme.type === 'dark' ? 'bg-gray-450' : 'bg-white'
				} rounded-full shadow-xl transition ease-in-out duration-300 ${
					state && 'bg-red-500'
				}`}
				onClick={onClick}
			>
				{typeof activeIcon === 'undefined' && icon}
				{typeof activeIcon !== 'undefined' &&
					(state ? activeIcon : icon)}
			</button>
		</Tooltip>
	);
};

export default ControlButton;
