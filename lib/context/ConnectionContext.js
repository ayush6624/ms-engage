import React, {
	useState,
	useEffect,
	useRef,
	useContext,
	createContext
} from 'react';
import io from 'socket.io-client';
import { API_BASE_URL } from '../config';

const ConnectionContext = createContext();

const ConnectionContextProvider = ({ children }) => {
	const [roomId, setRoomId] = useState(null);
	const [user, setUser] = useState(null); 
	const [chats, setChats] = useState([]); 
	const socketRef = useRef();
	const socketConnected = useRef(false); 

	useEffect(() => {
		if (roomId && API_BASE_URL) {
			socketRef.current = io(API_BASE_URL);
			socketConnected.current = true;
		}
	}, [roomId, user]);


	function joinRoom() {
		socketRef.current.emit('join-room', { roomId, user });
	}

	function sendMessage(e, message, email, name) {
		e.preventDefault();
		if (message === '') return;
		const pad = (n) => (n < 10 ? '0' + n : n);
		const msgData = {
			message,
			email,
			name,
			time: `${new Date().getHours()}:${pad(new Date().getMinutes())}`
		};
		socketRef.current.emit('send-message', {
			roomId,
			msgData
		});
	}

	function receiveMessages() {
		socketRef.current.on('receive-message', ({ msgData }) => {
			if (msgData.email !== user.email) addChat(msgData);
		});
	}

	function addChat(message) {
		setChats((chats) => [...chats, message]);
	}

	const contextProps = {
		roomId,
		setRoomId,
		user,
		setUser,
		chats,
		addChat,
		joinRoom,
		socketConnected,
		sendMessage,
		receiveMessages,
	};

	return (
		<ConnectionContext.Provider value={contextProps}>
			{children}
		</ConnectionContext.Provider>
	);
};

const useConnectionContext = () => useContext(ConnectionContext);

export { ConnectionContextProvider, useConnectionContext };
