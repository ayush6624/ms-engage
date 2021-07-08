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
	}, [roomId]);

	function joinRoom() {
		socketRef.current.emit('join-room', { roomId, user });
	}

	function celebrate() {
		socketRef.current.emit('celebrate', { user, roomId });
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
		addChat(msgData);
		socketRef.current.emit('send-message', {
			roomId,
			msgData
		});
	}

	function receiveMessages() {
		socketRef.current.on('receive-message', ({ msgData }) => {
			console.log('receive message')
			if (msgData.email !== user.email) {
				const chatWindow = document.getElementById('chatbox');
				addChat(msgData);
				chatWindow.scrollTo(0, 10000);
			}
		});
	}

	function receiveCelebration(){
		socketRef.current.on('celebration', () => {
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
		celebrate,
		receiveCelebration
	};

	return (
		<ConnectionContext.Provider value={contextProps}>
			{children}
		</ConnectionContext.Provider>
	);
};

const useConnectionContext = () => useContext(ConnectionContext);

export { ConnectionContextProvider, useConnectionContext };
