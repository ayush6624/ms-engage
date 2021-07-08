import { useState, useEffect, useRef, useContext, createContext } from 'react';
import io from 'socket.io-client';
import { API_BASE_URL } from '../config';

const ConnectionContext = createContext();

/* Context Provider to manage socket connections */
const ConnectionContextProvider = ({ children }) => {
	const [roomId, setRoomId] = useState(null); // Current Room name/id
	const [user, setUser] = useState(null); // Current user
	const [chats, setChats] = useState([]); // All chat messages
	const socketRef = useRef(); // Reference to the socket connection
	const socketConnected = useRef(false);

	useEffect(() => {
		if (roomId && API_BASE_URL) {
			// Connect to the API
			socketRef.current = io(API_BASE_URL);
			socketConnected.current = true;
		}
	}, [roomId]);

	const joinRoom = () => {
		socketRef.current.emit('join-room', { roomId, user });
	};

	const celebrate = () => {
		socketRef.current.emit('celebrate', { user, roomId });
	};

	const sendMessage = (e, message, email, name) => {
		// emit the message to the socket connections
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
	};

	const receiveMessages = () => {
		// Listner for receving new messages
		socketRef.current.on('receive-message', ({ msgData }) => {
			console.log('receive message');
			if (msgData.email !== user.email) {
				const chatWindow = document.getElementById('chatbox');
				addChat(msgData);
				chatWindow.scrollTo(0, 10000);
			}
		});
	};

	const receiveCelebration = () => {
		socketRef.current.on('celebration', () => {});
	};

	const addChat = (message) => {
		// add the message to the chat
		setChats((chats) => [...chats, message]);
	};

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

	// Wrap the application around the provider
	return (
		<ConnectionContext.Provider value={contextProps}>
			{children}
		</ConnectionContext.Provider>
	);
};

const useConnectionContext = () => useContext(ConnectionContext);

export { ConnectionContextProvider, useConnectionContext };
