import { useLoaderData, useSearchParams } from "react-router";
import VideoCard from "../components/VideoCard";
import api from "../services/api";
import Button from "../components/Button";
import "./Home.css";

export async function homeLoader({ request }) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const category = url.searchParams.get("category") || "";

  let videosEndpoint = "/videos?";
  if (category) videosEndpoint += `category=${encodeURIComponent(category)}&`;
  if (search) videosEndpoint += `search=${encodeURIComponent(search)}`;

  const [categoriesRes, videosRes] = await Promise.all([
    api.get("/videos/categories"),
    api.get(videosEndpoint),
  ]);

  return {
    categories: categoriesRes.data.data,
    videos: videosRes.data.data,
  };
}

function Home() {
  const { categories, videos } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";

  return (
    <div className="home">
      {/* Category Filter */}
      <div className="category-bar">
        {["All", ...categories].map((category) => (
          <Button
            key={category}
            active={activeCategory === category}
            onClick={() =>
              setSearchParams({ category: category === "All" ? "" : category })
            }
            title={category}
          />
        ))}
      </div>

      <div className="videos-wrapper">
        {videos.length > 0 ? (
          <div className="video-grid">
            {videos.map((video) => (
              <VideoCard video={video} key={video._id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-state-text">
              No videos found for "{searchParams.get("search")}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
