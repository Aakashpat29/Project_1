// src/pages/Like.jsx
import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";
import VideoCard from "../components/VideoCard";
import Skeleton from "../components/Skeleton";

function Like() {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLikedVideos = async () => {
    try {
      setLoading(true);
      const res = await API.get("/likes/videos");
      setLikedVideos(res.data.data || []);
    } catch (error) {
      console.error("Error fetching liked videos:", error);
      setLikedVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedVideos();
  }, []);

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-4xl">❤️</span>
          <h1 className="text-3xl font-bold">Liked Videos</h1>
          <span className="text-gray-500">({likedVideos.length})</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <Skeleton count={12} />
          </div>
        ) : likedVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {likedVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-7xl mb-6">❤️</div>
            <h2 className="text-2xl font-semibold text-gray-400">
              No liked videos yet
            </h2>
            <p className="text-gray-500 mt-2">
              Videos you like will appear here
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Like;
