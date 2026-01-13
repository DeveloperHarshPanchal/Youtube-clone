import { useEffect, useRef, useState } from "react";
import { timeAgo } from "../utils/format";
import Avatar from "./Avatar";
import { Check, Pen, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import api from "../services/api";
import toast from "react-hot-toast";
import "./VideoComments.css";

function VideoComments({ comments: originalComments, videoId }) {
  const [comments, setComments] = useState(originalComments);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState({
    id: null,
    content: "",
  });
  const editingCommentRef = useRef(null);
  const user = useSelector((state) => state.user);
  const isAuthenticated = !!user.accessToken;

  function handleNewComment(evt) {
    evt.preventDefault();
    if (!newComment.trim()) return;
    api
      .post(`/videos/${videoId}/comments`, { content: newComment })
      .then(({ data }) => {
        setComments(data.data);
        setNewComment("");
        toast.success("Comment added");
      })
      .catch(console.error);
  }

  function handleDeleteComment(commentId) {
    api
      .delete(`/videos/${videoId}/comments/${commentId}`)
      .then(({ data }) => {
        setComments(data.data);
        toast.success("Comment deleted", { icon: <Trash2 /> });
      })
      .catch(console.error);
  }

  function handleEditComment() {
    api
      .put(`/videos/${videoId}/comments/${editingComment.id}`, {
        content: editingComment.content,
      })
      .then(({ data }) => {
        setComments(data.data);
        setEditingComment({ id: null, content: "" });
        editingCommentRef.current = null;
        toast.success("Comment Edited");
      })
      .catch(console.error);
  }

  useEffect(() => {
    editingCommentRef.current?.focus();
  }, [editingComment.id]);

  useEffect(() => {
    setComments(originalComments);
    setNewComment("");
    setEditingComment({ id: null, content: "" });
  }, [originalComments, videoId]);

  return (
    <div className="video-comments">
      <p>{comments.length} Comments</p>

      {/* New Comment */}
      <div className="video-comments-new">
        <Avatar src={user.avatar} alt={user.username} width={40} height={40} />
        <form onSubmit={handleNewComment} className="flex w-full">
          <input
            type="text"
            disabled={!isAuthenticated}
            placeholder={
              isAuthenticated
                ? "Add new comment"
                : "Please login to add comment"
            }
            value={newComment}
            onChange={(evt) => setNewComment(evt.target.value)}
          />
          {isAuthenticated && (
            <button type="submit" className="btn-secondary">
              <Check />
            </button>
          )}
        </form>
      </div>

      {/* Comments List */}
      <div className="video-comments-list">
        {comments.map(
          ({ _id, userId: author, content, createdAt, updatedAt }) => (
            <div key={_id} className="video-comment">
              <div className="video-comment-content">
                <Avatar
                  src={author.avatar}
                  alt={author.username}
                  width={50}
                  height={50}
                />
                <div className="video-comment-text">
                  {editingComment.id === _id ? (
                    <form
                      onSubmit={(evt) => {
                        evt.preventDefault();
                        isAuthenticated &&
                          author._id === user.id &&
                          handleEditComment();
                      }}
                      className="video-comment-editing"
                    >
                      <input
                        ref={editingCommentRef}
                        value={editingComment.content}
                        onChange={(evt) =>
                          setEditingComment({
                            id: _id,
                            content: evt.target.value,
                          })
                        }
                      />
                      <button
                        type="submit"
                        className="btn-secondary"
                        title="Save comment"
                      >
                        <Check />
                      </button>
                    </form>
                  ) : (
                    <>
                      <p className="video-comment-author">
                        <span>
                          {(!author.username.startsWith("@") ? "@" : "") +
                            author.username}
                        </span>
                        <span>
                          {new Date(updatedAt) > new Date(createdAt)
                            ? "edited " + timeAgo(updatedAt)
                            : timeAgo(createdAt)}
                        </span>
                      </p>
                      <p className="video-comment-body">{content}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Author actions */}
              {isAuthenticated &&
                author._id === user.id &&
                editingComment.id !== _id && (
                  <div className="video-comment-actions">
                    <button
                      title="Edit comment"
                      className="btn-secondary"
                      onClick={() => setEditingComment({ id: _id, content })}
                    >
                      <Pen />
                    </button>
                    <button
                      title="Delete comment"
                      className="btn-secondary"
                      onClick={() => handleDeleteComment(_id)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default VideoComments;
