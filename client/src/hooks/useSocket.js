import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

let socket = null;

const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!socket) {
            socket = io(SOCKET_URL, {
                transports: ['websocket', 'polling']
            });

            socket.on('connect', () => {
                console.log('✅ Socket connected:', socket.id);
                setIsConnected(true);
            });

            socket.on('disconnect', () => {
                console.log('❌ Socket disconnected');
                setIsConnected(false);
            });

            socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
            });
        }

        return () => {
            // Don't disconnect on component unmount, keep connection alive
        };
    }, []);

    return socket;
};

export default useSocket;