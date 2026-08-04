
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (driverId: string): Socket => {
    if (socket?.connected) return socket;

    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, { auth: { driverId: driverId.toString() } });

    socket.on('connect', () => {
        console.log('Socket connected:', socket?.id, 'driverId:', driverId);
    });

    socket.on('connect_error', (err) => {
        console.error('Socket connect error:', err.message);
    });
    return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
    socket?.disconnect();
    socket = null;
};