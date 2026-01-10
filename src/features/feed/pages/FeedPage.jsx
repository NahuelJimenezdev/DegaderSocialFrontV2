import React, { useRef, useCallback, useState } from 'react';
import useFeed from '../hooks/useFeed';
import PostCard from '../../../shared/components/Post/PostCard';
import CreatePostCard from '../../../shared/components/Post/CreatePostCard';
import ShareModal from '../components/ShareModal';
import { useAuth } from '../../../context/AuthContext';

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
    // Optionally refresh feed or show success toast
  };

  // Temporary fix for loadMore:
  // The hook needs to expose a loadMore function that increments page.
  // I'll update the hook in next step if needed, but for now let's just render the list.

  return (
    <div className="max-w-2xl mx-auto mb-mobile-30 py-8 px-4">
      {/* Create Post Widget */}
      <CreatePostCard currentUser={user} onPostCreated={handleCreatePost} />

      <div className="space-y-6">
        {posts.map((post, index) => {
          if (posts.length === index + 1) {
            return (
              <div ref={lastPostElementRef} key={post._id}>
                <PostCard
                  variant="feed"
                  post={post}
                  currentUser={user}
                  onLike={handleLike}
                  onAddComment={handleAddComment}
                  onShare={() => onShareClick(post)}
                />
              </div>
            );
          } else {
            return (
              <PostCard
                key={post._id}
                variant="feed"
                post={post}
                currentUser={user}
                onLike={handleLike}
                onAddComment={handleAddComment}
                onShare={() => onShareClick(post)}
              />
            );
          }
        })}
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No hay publicaciones aún. ¡Sé el primero en publicar!
        </div>
      )}

      {error && (
        <div className="text-center py-4 text-red-500">
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


