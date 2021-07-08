import {
	LocalAudioTrack,
	LocalAudioTrackPublication,
	LocalVideoTrack,
	LocalVideoTrackPublication,
	RemoteAudioTrack,
	RemoteAudioTrackPublication,
	RemoteVideoTrack,
	RemoteVideoTrackPublication
} from 'twilio-video';

export type ThemeType = 'light' | 'dark';
export type SwitchThemeType = () => void;
export interface MessageType {
	message: string;
	email: string;
	name: string;
	time: string;
}

export type bgType = 'blur' | any;

export type AllTrackTypes =
	| LocalAudioTrack
	| LocalVideoTrack
	| RemoteAudioTrack
	| RemoteVideoTrack;

export type AllTrackPublications =
	| LocalVideoTrackPublication
	| LocalAudioTrackPublication
	| RemoteVideoTrackPublication
	| RemoteAudioTrackPublication;

export interface TwilioConfigType {
	twilio: {
		accountSid: string;
		apiKey: string;
		apiSecret: string;
	};
}
