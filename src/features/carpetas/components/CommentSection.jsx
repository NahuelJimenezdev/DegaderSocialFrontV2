import CommentItem from './CommentItem'
import CommentForm from './CommentForm'

const CommentSection = ({ comments = [], currentUserAvatar, onAddComment }) => {
  return (
    <div className="flex flex-col gap-6 pt-6 border-t border-[#E5E7EB] dark:border-[#374151]">
      <h3 className="text-lg font-bold text-[#1F2937] dark:text-[#F9FAFB]">
        Comentarios
      </h3>

      <div className="flex flex-col gap-6">
        {comments.map((comment, index) => (
          <CommentItem
            key={index}
            author={comment.author}
            avatar={comment.avatar}
            time={comment.time}
            text={comment.text}
          />
        ))}
      </div>

      <CommentForm
        currentUserAvatar={currentUserAvatar}
        onSubmit={onAddComment}
      />
    </div>
  )
}

export default CommentSection
