import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Camera, MapPin, Calendar, Link2 } from 'lucide-react';

// Mock data
const mockUser = {
  id: 1,
  name: 'Carolina Matiz',
  username: '@carolmatiz',
  avatar: 'https://i.pravatar.cc/150?img=1',
  cover: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop',
  bio: 'Diseñadora gráfica | Amante del café ☕ | Siguiendo a Cristo 🙏',
  location: 'Cúcuta, Colombia',
  joinDate: 'Octubre 2023',
  website: 'carolmatiz.com',
  stats: {
    posts: 156,
    followers: 1234,
    following: 456
  }
};

const mockPosts = [
  {
    id: 1,
    content: '¡Qué bendición tan grande es poder compartir momentos especiales con la familia! 💙',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop',
    timestamp: 'Hace 2 horas',
    likes: 24,
    comments: 5,
    shares: 2,
    isLiked: false
  },
  {
    id: 2,
    content: 'Reflexión del día: "La fe es la certeza de lo que se espera, la convicción de lo que no se ve." 🙏✨',
    timestamp: 'Hace 1 día',
    likes: 48,
    comments: 12,
    shares: 8,
    isLiked: true
  }
];

const mockComments = {
  1: [
    {
      id: 1,
      user: { name: 'Ana Gómez', avatar: 'https://i.pravatar.cc/50?img=5' },
      content: '¡Hermosa foto! Se ve que la pasaron increíble 💕',
      timestamp: 'Hace 1 hora',
      likes: 3,
      replies: [
        {
          id: 11,
          user: { name: 'Carolina Matiz', avatar: 'https://i.pravatar.cc/50?img=1' },
          content: '¡Gracias Ana! Fue un día muy especial 🥰',
          timestamp: 'Hace 45 min',
          likes: 1,
        },
        {
          id: 111,
          user: { name: 'Ana Gómez', avatar: 'https://i.pravatar.cc/50?img=5' },
          content: 'Me alegro mucho! Bendiciones para toda la familia 🙏',
          timestamp: 'Hace 30 min',
          likes: 2
        }
      ]
    },
    {
      id: 2,
      user: { name: 'Carlos Muñoz', avatar: 'https://i.pravatar.cc/50?img=12' },
      content: '¡Qué bonito momento! Saludos a todos 👋',
      timestamp: 'Hace 30 min',
      likes: 2,
      replies: []
    }
  ]
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState(mockPosts);
  const [newPost, setNewPost] = useState('');
  const [showComments, setShowComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [replyText, setReplyText] = useState({});
  const [showReplies, setShowReplies] = useState({});

  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const CommentItem = ({ comment, postId, depth = 0 }) => (
    <div className={`${depth > 0 ? 'ml-8 md:ml-12' : ''} mt-3`}>
      <div className="flex gap-2 md:gap-3">
        <img
          src={comment.user.avatar}
          alt={comment.user.name}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-2">
            <p className="font-semibold text-sm">{comment.user.name}</p>
            <p className="text-sm mt-1 break-words">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 mt-1 px-3 text-xs text-gray-500">
            <span>{comment.timestamp}</span>
            <button className="hover:text-blue-500 font-medium">
              Me gusta {comment.likes > 0 && `(${comment.likes})`}
            </button>
            <button
              onClick={() => toggleReplies(comment.id)}
              className="hover:text-blue-500 font-medium"
            >
              Responder
            </button>
          </div>

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} postId={postId} depth={depth + 1} />
              ))}
            </div>
          )}

          {showReplies[comment.id] && (
            <div className="flex gap-2 mt-2">
              <img
                src={mockUser.avatar}
                alt="Tu foto"
                className="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0"
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Escribe una respuesta..."
                  className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={replyText[comment.id] || ''}
                  onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
                />
                <button className="text-blue-500 font-semibold text-sm">
                  Enviar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="relative">
        <div
          className="h-32 md:h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${mockUser.cover})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900" />
        </div>

        <div className="max-w-3xl mx-auto px-4">
          <div className="relative -mt-12 md:-mt-16">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="relative">
                <img
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-50 dark:border-gray-900"
                />
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full">
                  <Camera size={16} />
                </button>
              </div>

              <div className="flex-1 pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{mockUser.name}</h1>
                    <p className="text-gray-500 text-sm">{mockUser.username}</p>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                    Editar perfil
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-sm md:text-base text-gray-900 dark:text-white">{mockUser.bio}</p>
              <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {mockUser.location}
                </span>
                <span className="flex items-center gap-1">
                  <Link2 size={14} />
                  <a href="#" className="text-blue-500 hover:underline">{mockUser.website}</a>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  Se unió en {mockUser.joinDate}
                </span>
              </div>

              <div className="flex gap-4 md:gap-6 pt-2 text-sm">
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">{mockUser.stats.posts}</span>
                  <span className="text-gray-500 ml-1">Publicaciones</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">{mockUser.stats.followers}</span>
                  <span className="text-gray-500 ml-1">Seguidores</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">{mockUser.stats.following}</span>
                  <span className="text-gray-500 ml-1">Siguiendo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 mt-6 sticky top-0 bg-gray-50 dark:bg-gray-900 z-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex">
            {['posts', 'media', 'likes'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm md:text-base font-medium capitalize border-b-2 transition-colors ${activeTab === tab
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                {tab === 'posts' ? 'Publicaciones' : tab === 'media' ? 'Multimedia' : 'Me gusta'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <img
              src={mockUser.avatar}
              alt="Tu foto"
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                placeholder="¿Qué estás pensando?"
                className="w-full bg-transparent resize-none focus:outline-none text-sm md:text-base text-gray-900 dark:text-white"
                rows="3"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                    <Camera size={18} className="text-gray-500" />
                  </button>
                </div>
                <button className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium disabled:opacity-50">
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </div>

        {posts.map(post => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-3">
                <img
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
                <div>
                  <p className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">{mockUser.name}</p>
                  <p className="text-xs text-gray-500">{post.timestamp}</p>
                </div>
              </div>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <MoreHorizontal size={18} className="text-gray-500" />
              </button>
            </div>

            <p className="text-sm md:text-base mb-3 text-gray-900 dark:text-white">{post.content}</p>

            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="w-full rounded-lg mb-3"
              />
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700 text-sm">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${post.isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'
                  }`}
              >
                <Heart size={18} fill={post.isLiked ? 'currentColor' : 'none'} />
                <span className="hidden sm:inline">{post.likes}</span>
              </button>

              <button
                onClick={() => toggleComments(post.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
              >
                <MessageCircle size={18} />
                <span className="hidden sm:inline">{post.comments}</span>
              </button>

              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
                <Share2 size={18} />
                <span className="hidden sm:inline">{post.shares}</span>
              </button>
            </div>

            {showComments[post.id] && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2 mb-4">
                  <img
                    src={mockUser.avatar}
                    alt="Tu foto"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Escribe un comentario..."
                      className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      value={commentText[post.id] || ''}
                      onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                    />
                    <button className="text-blue-500 font-semibold text-sm">
                      Enviar
                    </button>
                  </div>
                </div>

                {mockComments[post.id]?.map(comment => (
                  <CommentItem key={comment.id} comment={comment} postId={post.id} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;