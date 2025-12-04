import React, { useState, useEffect } from 'react';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import PostCard from '../../feed/components/PostCard';
import CreatePostCard from '../../feed/components/CreatePostCard';
import ShareModal from '../../feed/components/ShareModal';
import postService from '../../feed/services/postService';
import { useAuth } from '../../../context/AuthContext';

const GroupFeed = ({ groupData }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Fetch group posts
  const fetchGroupPosts = async () => {
    try {
      setLoading(true);
      // Use the dedicated endpoint for group posts
      const response = await postService.getGroupPosts(groupData._id, 1, 50);
      setPosts(response.data.posts);
    } catch (err) {
      console.error('Error fetching group posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupData?._id) {
      fetchGroupPosts();
    }
  }, [groupData?._id]);

  // Escuchar actualizaciones en tiempo real
  useEffect(() => {
    const handlePostUpdate = (event) => {
      const updatedPost = event.detail;
      // Verificar si el post pertenece a este grupo
      // Handle both object and ID for updatedPost.grupo
      const updatedPostGroupId = updatedPost.grupo?._id || updatedPost.grupo;
      
      if (updatedPostGroupId === groupData?._id) {
        setPosts(prevPosts => {
          const exists = prevPosts.some(p => p._id === updatedPost._id);
          if (exists) {
            return prevPosts.map(p => p._id === updatedPost._id ? updatedPost : p);
          }
          // Si es nuevo, agregarlo al principio
          return [updatedPost, ...prevPosts];
        });
      }
    };

    window.addEventListener('socket:post:updated', handlePostUpdate);
    return () => {
      window.removeEventListener('socket:post:updated', handlePostUpdate);
    };
  }, [groupData?._id]);

  const handleCreatePost = async (postData) => {
    try {
      const response = await postService.createPost({
        ...postData,
        grupo: groupData._id
      });
      
      if (response.success) {
        // No necesitamos recargar todo si el socket funciona
      }
      return response;
    } catch (err) {
      console.error('Error creating group post:', err);
      throw err;
    }
  };

  const handleLike = async (postId) => {
    try {
      if (!user) return;

      // Optimistic update
      setPosts(prevPosts => prevPosts.map(post => {
        if (post._id === postId) {
          const isLiked = post.likes.includes(user._id);
          return {
            ...post,
            likes: isLiked 
              ? post.likes.filter(id => id !== user._id)
              : [...post.likes, user._id]
          };
        }
        return post;
      }));

      const response = await postService.toggleLike(postId);
      
      if (!response.success) {
        await fetchGroupPosts();
      }
    } catch (err) {
      console.error('Error liking post:', err);
      await fetchGroupPosts();
    }
  };

  const handleAddComment = async (postId, content, parentCommentId, image) => {
    try {
      const response = await postService.addComment(postId, content, parentCommentId, image);
      if (response.success) {
        const updatedPostData = await postService.getPostById(postId);
        if (updatedPostData.success) {
          setPosts(prevPosts => prevPosts.map(p => 
            p._id === postId ? updatedPostData.data : p
          ));
        }
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleShare = (post) => {
    setSelectedPost(post);
    setShareModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-6 border-b border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#1F2937] flex-shrink-0">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Feed del Grupo
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Publicaciones y actualizaciones de {groupData?.nombre || 'este grupo'}
        </p>
      </header>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-[#0a0e27] scrollbar-thin">
        <div className="max-w-2xl mx-auto space-y-6">
          <CreatePostCard currentUser={user} onPostCreated={handleCreatePost} />

          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-4 text-red-500">
              Error al cargar publicaciones: {error}
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-50">post_add</span>
              <p className="text-lg font-medium">No hay publicaciones aún</p>
              <p className="text-sm mt-2">¡Sé el primero en compartir algo con el grupo!</p>
            </div>
          )}

          {!loading && posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={user}
              onLike={handleLike}
              onComment={handleAddComment}
              onShare={() => handleShare(post)}
            />
          ))}
        </div>
      </div>

      <ShareModal 
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        post={selectedPost}
      />
    </div>
  );
};

export default GroupFeed;