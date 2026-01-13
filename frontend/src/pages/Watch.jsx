import { useLoaderData } from "react-router";
import api from "../services/api";
import { formatNumber, timeAgo } from "../utils/format";
import VideoCard from "../components/VideoCard";
import { useScrollToTop } from "../hooks/useScroll";
import VideoActions from "../components/VideoActions";
import VideoComments from "../components/VideoComments";
import { useState } from "react";
import clsx from "clsx";
import "./Watch.css";

export async function watchLoader({ params }) {
  try {
    const [videoRes] = await Promise.all([
      api.get(`/videos/${params.videoId}`),
      api.patch(`/videos/${params.videoId}/views`).catch(console.error),
    ]);
    return videoRes.data.data;
  } catch (err) {
    throw new Error(err.response.data.error);
  }
}

function Watch() {
  useScrollToTop();
  const data = useLoaderData();
  const [viewMoreDescription, setViewMoreDescription] = useState(false);

  const {
    _id: videoId,
    videoUrl,
    title,
    channelId,
    likes,
    views,
    createdAt,
    description,
    relatedVideos,
    comments,
  } = data;

  const embedUrl = videoUrl.replace("watch?v=", "embed/");

  return (
    <div className="watch">
      <div className="watch-grid">
        {/* Main Video Section */}
        <div className="watch-main">
          <iframe
            src={embedUrl}
            title={title}
            loading="lazy"
            allowFullScreen
            className="watch-video"
          />

          <p className="watch-title">{title}</p>

          <VideoActions channel={channelId} likes={likes} videoId={videoId} />

          <div className="watch-description-box">
            <p className="watch-meta">
              <span>{formatNumber(views)} views</span>
              <span>{timeAgo(createdAt)}</span>
            </p>

            <pre
              className={clsx("watch-description", {
                "line-clamp-5": !viewMoreDescription,
              })}
            >
              {description}
            </pre>

            <button
              onClick={() => setViewMoreDescription(!viewMoreDescription)}
              className="watch-view-toggle"
            >
              view {viewMoreDescription ? "less" : "more"}
            </button>
          </div>

          <VideoComments comments={comments} videoId={videoId} />
        </div>

        {/* Related Videos */}
        <div className="watch-related">
          {relatedVideos.map((video) => (
            <VideoCard video={video} key={video._id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Watch;
