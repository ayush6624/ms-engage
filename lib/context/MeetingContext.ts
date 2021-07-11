import { createContext, Dispatch, SetStateAction } from 'react';
export const MeetingContext = createContext<{
	/* JWT Token to join a meeting */
	token: string;

	/* Sets the token */
	setToken?: Dispatch<SetStateAction<string>>;

	/* 3 alphabet room name/id */
	roomName: string;

	/* Sets the current room name */
	setRoomName?: Dispatch<SetStateAction<string>>;

	/* Manages the user's virtual background */
	userBackground?: string;

	/* Sets the state */
	setUserBackground?: Dispatch<SetStateAction<string>>;

	/* Manages the user's virtual background's img link */
	userBgLink?: string;

	/* Sets the bg link */
	setUserBgLink?: Dispatch<SetStateAction<string>>;

	/* Manages the meeting component's visibility */
	showMeeting?: boolean;

	/* Sets the state for */
	setShowMeeting?: Dispatch<SetStateAction<boolean>>;
}>({
	token: '',
	roomName: '',
	userBackground: '',
	userBgLink: '',
	showMeeting: false // default to not show the meeting component
});

export const MeetingProvider = MeetingContext.Provider;
