import { SocketData } from './types';

/**
 * Socket Instance
 *
 * @param {*} server
 */
function sockerServer(server: any) {
	const io = require('socket.io')(server, {
		// allow access over all hostnames
		cors: {
			origin: '*'
		}
	});

	const roomSockets = {}; // Stores the room socket
	const roomUsers = {}; // stores the active users

	io.on('connection', (socket: any) => {
		socket.on('join-room', ({ roomId, user }: SocketData) => {
			if (
				roomSockets[roomId]?.includes(socket.id) ||
				roomUsers[roomId]?.includes(user)
			) {
				return; // Prevents duplicate joins
			}
			user.socketId = socket.id;

			// store the ids
			if (roomSockets[roomId]) {
				roomSockets[roomId].push(socket.id);
			} else {
				roomSockets[roomId] = [socket.id];
			}

			socket.join(roomId);

			if (roomUsers[roomId]) {
				roomUsers[roomId].push(user);
			} else {
				roomUsers[roomId] = [user];
			}
		});

		socket.on('send-message', ({ roomId, msgData }: SocketData) => {
			// Send message event
			socket.to(roomId).emit('receive-message', { msgData });
		});

		socket.on('celebrate', ({ userId, roomId }: SocketData) => {
			// Celebration event
			socket.to(roomId).emit('celebrate', { userId });
		});

		socket.on('disconnect', () => {
			// Disconnect event
			const rooms = Object.keys(roomSockets);
			rooms.forEach((roomId: string) => {
				// remove user from state
				if (roomSockets[roomId].includes(socket.id)) {
					const remainingUsers = roomSockets[roomId].filter(
						(u: Record<string, any>) => u !== socket.id
					);
					const remainingUserObj = roomUsers[roomId].filter(
						(u: Record<string, any>) => u.socketId !== socket.id
					);

					roomSockets[roomId] = remainingUsers;
					roomUsers[roomId] = remainingUserObj;
				}
			});
		});
	});
}

export default sockerServer;
