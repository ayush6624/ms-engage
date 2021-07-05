import { createContext, Dispatch, SetStateAction } from 'react';
export const MeetingContext = createContext<{
	token: string;
	setToken?: Dispatch<SetStateAction<number>>;
	roomName: string;
	setRoomName?: Dispatch<SetStateAction<number>>;
	userBackground?: string;
	setUserBackground?: Dispatch<SetStateAction<string>>;
	userBgLink?: string;
	setUserBgLink?: Dispatch<SetStateAction<string>>;
}>({
	token: '',
	roomName: '',
	userBackground: '',
	userBgLink: ''
});

export const MeetingProvider = MeetingContext.Provider;
