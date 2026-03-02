import { useState, useEffect } from 'react';
import { getSocket } from '../shared/lib/socket';

export const useSocket = () => {
  const [socket, setSocket] = useState(getSocket());

  useEffect(() => {
    // Si el socket se inicializa más tarde, lo capturamos
    const currentSocket = getSocket();
    if (currentSocket !== socket) {
      setSocket(currentSocket);
    }
  }, []);

  return { socket };
};
