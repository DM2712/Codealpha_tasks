import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const rawUrl = import.meta.env.VITE_SOCKET_URL || '';
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const isLocalhostHost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    // If on HTTPS and socket URL points to insecure http://localhost, skip to avoid Mixed Content errors
    if (isHttps && !isLocalhostHost && (!rawUrl || rawUrl.includes('localhost') || rawUrl.includes('127.0.0.1') || rawUrl.startsWith('http:'))) {
      // Standalone / preview mode without dedicated WSS server
      return;
    }

    const socketUrl = rawUrl || 'http://localhost:5050';

    try {
      const newSocket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 2,
        reconnectionDelay: 2000,
        timeout: 5000,
        autoConnect: true,
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      newSocket.on('connect', () => {
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('connect_error', () => {
        // Gracefully handle without console flood
        setIsConnected(false);
      });

      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    } catch {
      // Quiet fallback if socket.io client fails
    }
  }, []);

  const joinProject = (projectId) => {
    if (socketRef.current && isConnected && projectId) {
      socketRef.current.emit('join:project', projectId);
    }
  };

  const leaveProject = (projectId) => {
    if (socketRef.current && isConnected && projectId) {
      socketRef.current.emit('leave:project', projectId);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, joinProject, leaveProject }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext) || { socket: null, isConnected: false, joinProject: () => {}, leaveProject: () => {} };
};
