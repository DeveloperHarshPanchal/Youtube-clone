import { useState } from "react";
import {
  ArrowDownToLine,
  Ellipsis,
  Info,
  Send,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { formatNumber } from "../utils/format";
import Avatar from "./Avatar";
import api from "../services/api";
import SubscribeButton from "./SubscribeButton";
import Button from "./Button";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import "./VideoActions.css";

function VideoActions({ channel, likes, videoId }) {
  const isAuthenticated = useSelector((state) => !!state.user.accessToken);
  const likeButtonFillColor =
    useSelector((state) => state.theme) === "dark" ? "white" : "#212121";

  const [likeState, setLikeState] = useState({
    isLiked: false,
    isDisliked: false,
    likeCount: likes || 0,
  });

  const likeEndpoint = `/videos/${videoId}/likes?dec=`;

  async function handleLike() {
    const prevState = { ...likeState };
    const wasLiked = likeState.isLiked;

    setLikeState({
      isLiked: !wasLiked,
      isDisliked: false,
      likeCount: wasLiked
        ? Math.max(0, likeState.likeCount - 1)
        : likeState.likeCount + 1,
    });

    api
      .patch(`${likeEndpoint}${wasLiked}`)
      .catch(() => setLikeState(prevState));
  }

  async function handleDislike() {
    const prevState = { ...likeState };
    const wasLiked = likeState.isLiked;
    const wasDisliked = likeState.isDisliked;

    setLikeState({
      isDisliked: !wasDisliked,
      isLiked: false,
      likeCount: wasLiked
        ? Math.max(0, likeState.likeCount - 1)
        : likeState.likeCount,
    });

    if (wasLiked) {
      api.patch(`${likeEndpoint}true`).catch(() => setLikeState(prevState));
    }
  }

  return (
    <div className="video-actions-container">
      {/* Channel Info Section */}
      <div className="channel-info">
        <div className="channel-details">
          <Avatar
            src={channel.avatar}
            alt={channel.name}
            width={40}
            height={40}
          />
          <div className="min-w-0 flex-1">
            <Link to={`/channel/${channel._id}`}>
              <p className="channel-name">{channel.name}</p>
            </Link>
            <p className="subscribers-count">
              {channel.subscribersCount} subscribers
            </p>
          </div>
        </div>
        <SubscribeButton channel={channel} />
      </div>

      {/* Action Buttons Section */}
      <div className="actions-group">
        <span className="like-dislike-group">
          <button
            onClick={() => {
              isAuthenticated
                ? handleLike()
                : toast.error("Please Login to like video", { icon: <Info /> });
            }}
          >
            <ThumbsUp fill={likeState.isLiked ? likeButtonFillColor : "none"} />
            <span>{likeState.likeCount}</span>
          </button>
          <div className="like-dislike-separator"></div>
          <button
            onClick={() => {
              isAuthenticated
                ? handleDislike()
                : toast.error("Please Login to dislike video", {
                    icon: <Info />,
                  });
            }}
          >
            <ThumbsDown
              fill={likeState.isDisliked ? likeButtonFillColor : "none"}
            />
          </button>
        </span>

        <Button Icon={Send} title="Share" className="action-btn" />
        <Button
          Icon={ArrowDownToLine}
          title="Download"
          className="action-btn hidden-md"
        />
        <button className="ellipsis-btn">
          <Ellipsis />
        </button>
      </div>
    </div>
  );
}

export default VideoActions;
