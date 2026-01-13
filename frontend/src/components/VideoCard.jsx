import Avatar from "./Avatar";
import { useNavigate } from "react-router";
import { formatNumber, timeAgo } from "../utils/format";
import Button from "./Button";
import { Trash2 } from "lucide-react";
import VideoDialog from "./VideoDialog";
import "./VideoCard.css";

function VideoCard({ video, isOwner = false, onDelete, channelId }) {
  const navigate = useNavigate();
  const backThumbnailUrl = `https://picsum.photos/seed/${video.title}/300/200`;

  return (
    <div className="video-card">
      <div
        className="video-card-grid"
        onClick={() => navigate(`/watch/${video._id}`)}
      >
        <img
          src={video.thumbnailUrl ?? backThumbnailUrl}
          alt={video.title}
          width={400}
          loading="lazy"
          onError={(evt) => (evt.currentTarget.src = backThumbnailUrl)}
        />
        <div className="video-card-info">
          <Avatar
            src={video.channelId.avatar}
            alt={video.channelId.name}
            height={40}
            width={40}
          />
          <div className="video-card-info-text">
            <p className="video-title">{video.title}</p>
            <p className="channel-name">{video.channelId.name}</p>
            <p className="video-stats">
              {formatNumber(video.views)} views - {timeAgo(video.createdAt)}
            </p>
          </div>
        </div>
      </div>
      {isOwner && (
        <div className="video-card-actions">
          <VideoDialog edit={true} video={video} channelId={channelId} />
          <Button
            Icon={Trash2}
            title="Delete"
            onClick={(evt) => {
              evt.stopPropagation();
              onDelete();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default VideoCard;
