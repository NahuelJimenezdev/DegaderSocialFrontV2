import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import postService from '../services/postService';
import PostCard from '../../../shared/components/Post/PostCard';
import { ArrowLeft } from 'lucide-react';

const PostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await postService.getPostById(id);
                if (response.success) {
                    setPost(response.data);
                } else {
                    setError('No se pudo cargar la publicación');
                }
            } catch (err) {
                console.error('Error fetching post:', err);
                setError('Error al cargar la publicación');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPost();
        }
    }, [id]);

    // Real-time updates listener using global CustomEvents dispatched by socket.js
    useEffect(() => {
        if (!post) return;

        const handleSocketPostUpdate = (event) => {
            const updatedPost = event.detail;
            if (updatedPost._id === post._id) {
                setPost(updatedPost); // Reemplazo completo - incluye comentarios con likes actualizados
            }
        };

        window.addEventListener('socket:post:updated', handleSocketPostUpdate);

        return () => {
            window.removeEventListener('socket:post:updated', handleSocketPostUpdate);
        };
    }, [post?._id]);

    const handlePostUpdate = (updatedPost) => {
        setPost(updatedPost);
    };

    const handlePostDelete = (deletedPostId) => {
        navigate('/'); // Go back to feed if deleted
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-4">
                <p className="text-gray-500 dark:text-gray-400 mb-4">{error || 'Publicación no encontrada'}</p>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-blue-500 hover:text-blue-600"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Volver al inicio
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-2xl px-4 py-6 pt-20">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" />
                Volver
            </button>

            <PostCard
                post={post}
                currentUser={user}
                onPostUpdate={handlePostUpdate}
                onPostDelete={handlePostDelete}
                highlightCommentId={new URLSearchParams(location.search).get('commentId')}
            />
        </div>
    );
};

export default PostPage;
