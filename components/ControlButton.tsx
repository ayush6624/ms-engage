/* eslint-disable @next/next/no-img-element */
import { Tooltip, useTheme } from '@geist-ui/react';
import { Toast } from '@geist-ui/react/dist/use-toasts/use-toast';
import React, { useContext } from 'react';
import { Room } from 'twilio-video';
import { MeetingContext } from '../lib/context/MeetingContext';

interface EndCallProps {
	/* Current Room */
	room?: Room;

	/* Toast Alert */
	setToast?: (msg: Toast) => void;
}

interface ControlButtonProps {
	/* Sets the tooltip (shown on hover) */
	toolTipText?: string;

	/* Active / Inactive State */
	state?: boolean;

	/* onClick Handler */
	onClick?: () => void;

	/* Button Icon */
	icon?: React.ReactNode;

	/* Icon to be shown when state is active */
	activeIcon?: React.ReactNode;
}

// End Call Button
export const EndCall: React.FC<EndCallProps> = ({ room, setToast }) => {
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

const ControlButton: React.FC<ControlButtonProps> = ({
	toolTipText,
	state,
	onClick,
	icon,
	activeIcon
}) => {
	const theme = useTheme(); // Gets the current theme

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

// Changes Background Image
export const ChangeBackground = () => (
	<img
		src="/background.svg"
		className="stroke-current text-black"
		width="28px"
		height="28px"
		alt="change background"
	/>
);

export default ControlButton;
