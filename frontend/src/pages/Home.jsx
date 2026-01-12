import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import api from "../services/api";

const Home = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    api.get("/videos").then((res) => setVideos(res.data));
  }, []);

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default Home;
