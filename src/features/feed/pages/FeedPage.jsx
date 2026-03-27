import React, { useRef, useCallback, useState } from 'react';
import useFeed from '../hooks/useFeed';
import PostCard from '../../../shared/components/Post/PostCard';
import CreatePostCard from '../../../shared/components/Post/CreatePostCard';
import ShareModal from '../components/ShareModal';
import { useAuth } from '../../../context/AuthContext';
import UserCarousel from '../../recommendations/components/UserCarousel';

const FeedPage = () => {
  const { user } = useAuth();
  const { posts, loading, error, hasMore, loadMore, fetchFeed, handleLike, handleAddComment, handleShare, handleCreatePost } = useFeed(null, user);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const observer = useRef();
  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);

  const onShareClick = (post) => {
    setSelectedPost(post);
    setShareModalOpen(true);
  };

  const onShareSubmit = async (postId, content) => {
    await handleShare(postId, content);
  };

  return (
    <div className="w-full mb-mobile-30 py-8 px-4 flex flex-col items-center">
      {/* Container para el contenido central (CreateCard) */}
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <CreatePostCard currentUser={user} onPostCreated={handleCreatePost} />
      </div>

      {/* Listado de Posts */}
      <div className="w-full max-w-2xl flex flex-col gap-6 mt-6">
        {posts.map((post, index) => {
          const isLast = posts.length === index + 1;
          
          // Lógica para mostrar el carrusel de recomendaciones
          const showRecommendations = 
            (posts.length === 1 && index === 0) || 
            (posts.length > 1 && posts.length < 5 && index === 1) || 
            (posts.length >= 5 && (index + 1) % 10 === 0);

          return (
            <React.Fragment key={post._id}>
              <div ref={isLast ? lastPostElementRef : null}>
                <PostCard
                  variant="feed"
                  post={post}
                  currentUser={user}
                  onLike={handleLike}
                  onAddComment={handleAddComment}
                  onShare={() => onShareClick(post)}
                />
              </div>
              
              {showRecommendations && (
                <div className="w-full h-auto flex justify-center py-6 my-4 overflow-visible">
                  <div className="w-[95vw] sm:w-full max-w-[1450px] px-2 sm:px-4">
                    <UserCarousel />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="w-full flex flex-col items-center gap-8 py-10">
          <div className="w-full max-w-2xl text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
            No hay publicaciones aún. ¡Sé el primero en publicar!
          </div>
          <div className="w-full max-w-6xl">
            <UserCarousel />
          </div>
        </div>
      )}

      {error && (
        <div className="text-center py-10 text-red-500 bg-red-50 rounded-xl max-w-2xl w-full">
          Error al cargar el feed: {error}
        </div>
      )}

      {selectedPost && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          onShare={onShareSubmit}
          post={selectedPost}
        />
      )}
    </div>
  );
};

export default FeedPage;
