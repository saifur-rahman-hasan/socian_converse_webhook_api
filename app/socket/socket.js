import { io } from 'socket.io-client';

const URL = process.env.NEXT_PUBLIC_APP_SOCKET_URL;

export const socket = io(URL, {
	reconnection: true,
	reconnectionDelay: 2000,
	reconnectionAttempts: 3,
	transports: ["websocket"],
	agent: false,
	upgrade: false,
	rejectUnauthorized: false
});