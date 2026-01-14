import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData, useNavigate, useRevalidator } from "react-router";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import ChannelDialog from "../components/ChannelDialog";
import SubscribeButton from "../components/SubscribeButton";
import VideoCard from "../components/VideoCard";
import VideoDialog from "../components/VideoDialog";
import api from "../services/api";
import { removeChannel } from "../store/userSlice";
import { formatNumber } from "../utils/format";
import "./Channel.css";

export async function channelLoader({ params }) {
  try {
    const res = await api.get(`/channel/${params.channelId}`);
    return res.data.data;
  } catch (err) {
    const error = err.response.data.error;
    throw new Error(error);
  }
}

function Channel() {
  const channel = useLoaderData();
  const {
    userId,
    _id,
    name,
    handle,
    subscriberCount,
    videos,
    description,
    banner,
    avatar,
  } = channel;

  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const isAuthenticated = !!user.accessToken;
  const isOwner = isAuthenticated && user.id === userId;

  function handleVideoDelete(videoId) {
    api
      .delete(`/channel/${_id}/video/${videoId}`)
      .then((res) => {
        revalidator.revalidate();
        toast.success(res.data.message);
      })
      .catch((err) => toast.error(err.response.data.error));
  }

  function handleChannelDelete() {
    api
      .delete(`/channel/${_id}`)
      .then((res) => {
        dispatch(removeChannel(_id));
        toast.success(res.data.message);
        navigate("/");
      })
      .catch((err) => toast.error(err.response.data.error));
  }

  const backupBannerUrl = `https://picsum.photos/seed/${name}/800/200`;
  return (
    <div className="channel-container">
      {/* ================= BANNER ================= */}
      <div className="channel-banner">
        <img
          src={banner ?? backupBannerUrl}
          alt={name}
          onError={(e) => (e.currentTarget.src = backupBannerUrl)}
        />
      </div>

      {/* ================= HEADER ================= */}
      <div className="channel-header">
        {/* LEFT */}
        <div className="channel-header-left">
          <Avatar
            src={avatar}
            alt={name}
            width={80}
            height={80}
            className="channel-avatar"
          />

          <div className="channel-text">
            <h1 className="channel-name">{name}</h1>

            <div className="channel-meta">
              <span>{handle?.startsWith("@") ? handle : "@" + handle}</span>
              <span>{formatNumber(subscriberCount)} subscribers</span>
              <span>{formatNumber(videos.length)} videos</span>
            </div>

            {description && (
              <p className="channel-description">{description}</p>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="channel-header-right">
          {isOwner ? (
            <div className="channel-owner-actions">
              <ChannelDialog edit channel={channel} />
              <Button
                Icon={Trash2}
                title="Delete"
                onClick={handleChannelDelete}
              />
            </div>
          ) : (
            <SubscribeButton channel={{ _id, name, avatar }} />
          )}
        </div>
      </div>

      <div className="channel-divider" />

      {/* ================= VIDEOS ================= */}
      <div className="channel-videos">
        {videos.length > 0 ? (
          <div className="video-grid">
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                video={{ ...video, channelId: { _id, name, avatar } }}
                isOwner={isOwner}
                onDelete={() => handleVideoDelete(video._id)}
                channelId={_id}
              />
            ))}
          </div>
        ) : (
          <div className="channel-empty">
            {isOwner ? (
              <div className="channel-empty-owner">
                <p>You haven't uploaded any video yet.</p>
                <VideoDialog channelId={_id} />
              </div>
            ) : (
              <p>No videos found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Channel;
