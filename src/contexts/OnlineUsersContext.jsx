import { createContext, useContext, useState, useEffect } from 'react';

const OnlineUsersContext = createContext();

export const OnlineUsersProvider = ({ children }) => {
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [version, setVersion] = useState(0); // Para forzar re-renders

    useEffect(() => {
        console.log('🌐 [ONLINE CONTEXT] Iniciando listener global de estado online');

        const handleFriendStatusChange = (event) => {
            const { userId, isOnline } = event.detail;
            console.log('📥 [ONLINE CONTEXT] Evento recibido:', { userId, isOnline, timestamp: event.detail.timestamp });

            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                if (isOnline) {
                    newSet.add(userId);
                    console.log(`✅ [ONLINE CONTEXT] Usuario ${userId} marcado como ONLINE`);
                } else {
                    newSet.delete(userId);
                    console.log(`❌ [ONLINE CONTEXT] Usuario ${userId} marcado como OFFLINE`);
                }
                console.log(`📊 [ONLINE CONTEXT] Total usuarios online:`, newSet.size, Array.from(newSet));
                return newSet;
            });

            // Incrementar versión para forzar re-render
            setVersion(v => v + 1);
        };

        window.addEventListener('socket:friend:status_changed', handleFriendStatusChange);

        return () => {
            console.log('🔇 [ONLINE CONTEXT] Removiendo listener global');
            window.removeEventListener('socket:friend:status_changed', handleFriendStatusChange);
        };
    }, []);

    return (
        <OnlineUsersContext.Provider value={{ onlineUsers, version }}>
            {children}
        </OnlineUsersContext.Provider>
    );
};

export const useOnlineUsers = () => {
    const context = useContext(OnlineUsersContext);
    if (context === undefined) {
        throw new Error('useOnlineUsers must be used within OnlineUsersProvider');
    }
    return context.onlineUsers;
};
