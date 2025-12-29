import { useState, useEffect, useRef } from 'react';
import api from '../../../api/config';
import styles from './MentionAutocomplete.module.css';

const MentionAutocomplete = ({
    show,
    position,
    query,
    onSelect
}) => {
    const [users, setUsers] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const listRef = useRef(null);

    // Obtener amigos del usuario para menciones
    useEffect(() => {
        if (!show) {
            setUsers([]);
            return;
        }

        const fetchFriends = async () => {
            try {
                // Obtener lista de amigos
                const response = await api.get('/friendships/friends');
                const friends = response.data.data || response.data.amigos || response.data || [];

                // Mapear amigos primero para asegurar tener un username
                const mappedFriends = friends.map(friend => {
                    // Generar username basado en nombre y apellido si no tiene uno
                    let username = friend.username;
                    if (!username && friend.nombres?.primero && friend.apellidos?.primero) {
                        username = `${friend.nombres.primero}${friend.apellidos.primero}`.toLowerCase().replace(/\s+/g, '');
                    }

                    return {
                        _id: friend._id,
                        username: username, // Usar el username existente o el generado
                        nombres: friend.nombres,
                        apellidos: friend.apellidos,
                        fotoPerfil: friend.social?.fotoPerfil || friend.fotoPerfil
                    };
                });

                // Filtrar por query usando el username (generado o real)
                const filteredFriends = mappedFriends
                    .filter(friend => {
                        const username = friend.username || '';
                        return !query || username.toLowerCase().includes(query.toLowerCase());
                    })
                    .slice(0, 5); // Máximo 5 sugerencias

                setUsers(filteredFriends);
            } catch (error) {
                console.error('Error fetching friends for mentions:', error);
                setUsers([]);
            }
        };

        fetchFriends();
    }, [show, query]);

    // Manejar teclas de navegación
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!show || users.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % users.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + users.length) % users.length);
            } else if (e.key === 'Enter' && users[selectedIndex]) {
                e.preventDefault();
                onSelect(users[selectedIndex]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [show, users, selectedIndex, onSelect]);

    // Reset selected index cuando cambian los usuarios
    useEffect(() => {
        setSelectedIndex(0);
    }, [users]);

    if (!show || users.length === 0) return null;

    return (
        <div
            ref={listRef}
            className={styles.container}
            style={{
                top: position.top ? `${position.top}px` : 'auto',
                bottom: position.bottom ? `${position.bottom}px` : 'auto',
                left: `${position.left}px`
            }}
        >
            {users.map((user, index) => (
                <div
                    key={user._id}
                    className={`${styles.item} ${index === selectedIndex ? styles.selected : ''}`}
                    onClick={() => onSelect(user)}
                    onMouseEnter={() => setSelectedIndex(index)}
                >
                    <img
                        src={user.fotoPerfil || '/avatars/default-avatar.png'}
                        alt={user.username}
                        className={styles.avatar}
                    />
                    <div className={styles.info}>
                        <div className={styles.username}>@{user.username}</div>
                        {user.nombres && user.apellidos && (
                            <div className={styles.fullname}>
                                {user.nombres.primero} {user.apellidos.primero}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MentionAutocomplete;
