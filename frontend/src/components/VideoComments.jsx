import { useEffect, useRef, useState } from "react";
import { timeAgo } from "../utils/format";
import Avatar from "./Avatar";
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

  // Add new comment
  const handleNewComment = (evt) => {
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
  };

  // Delete comment
  const handleDeleteComment = (id) => {
    api
      .delete(`/videos/${videoId}/comments/${id}`)
      .then(({ data }) => {
        setComments(data.data);
        toast.success("Comment deleted");
      })
      .catch(console.error);
  };

  // Edit comment
  const handleEditComment = () => {
    api
      .put(`/videos/${videoId}/comments/${editingComment.id}`, {
        content: editingComment.content,
      })
      .then(({ data }) => {
        setComments(data.data);
        setEditingComment({ id: null, content: "" });
        editingCommentRef.current = null;
        toast.success("Comment edited");
      })
      .catch(console.error);
  };

  // Focus input on edit
  useEffect(() => {
    editingCommentRef.current?.focus();
  }, [editingComment.id]);

  // Reset comments on prop change
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
        <form onSubmit={handleNewComment} className="new-comment-form">
          <input
            type="text"
            disabled={!isAuthenticated}
            placeholder={
              isAuthenticated ? "Add a comment..." : "Login to comment"
            }
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          {isAuthenticated && (
            <button type="submit" className="btn-comment">
              Comment
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
                  width={40}
                  height={40}
                />
                <div className="video-comment-text">
                  {editingComment.id === _id ? (
                    /* EDIT MODE */
                    <div className="video-comment-editing">
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
                      <div className="edit-buttons">
                        <button
                          className="btn-save"
                          onClick={handleEditComment}
                        >
                          Save
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() =>
                            setEditingComment({ id: null, content: "" })
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="video-comment-author">
                        <span>
                          {author.username.startsWith("@")
                            ? author.username
                            : "@" + author.username}
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

              {/* Edit/Delete Buttons */}
              {isAuthenticated &&
                author._id === user.id &&
                editingComment.id !== _id && (
                  <div className="video-comment-actions">
                    <button
                      className="btn-edit"
                      onClick={() => setEditingComment({ id: _id, content })}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteComment(_id)}
                    >
                      Delete
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
