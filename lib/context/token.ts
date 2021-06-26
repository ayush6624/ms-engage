import { createContext, Dispatch, SetStateAction } from 'react';

export const MeetingContext = createContext<{
	token: string;
	setToken?: Dispatch<SetStateAction<number>>;
	roomName: string;
	setRoomName?: Dispatch<SetStateAction<number>>;
}>({
	token: '',
	roomName: ''
});

export const MeetingProvider = MeetingContext.Provider;
