import { SocketData } from './types';

function sockerServer(server: any) {
	const io = require('socket.io')(server, {
		cors: {
			origin: '*'
		}
	});

	const roomSockets = {};
	const roomUsers = {};

	io.on('connection', (socket: any) => {
		socket.on('join-room', ({ roomId, user }: SocketData) => {
			if (
				roomSockets[roomId]?.includes(socket.id) ||
				roomUsers[roomId]?.includes(user)
			) {
				return;
			}
			user.socketId = socket.id;

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
			socket.to(roomId).emit('receive-message', { msgData });
		});

		socket.on('celebrate', ({ userId, roomId }: SocketData) => {
			socket.to(roomId).emit('celebrate', { userId });
		});

		socket.on('disconnect', () => {
			const rooms = Object.keys(roomSockets);
			rooms.forEach((roomId) => {
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
