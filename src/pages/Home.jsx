// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import VideoCard from "../components/VideoCard.jsx";
import API from "../services/api";
import Skeleton from "../components/Skeleton";

function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search_query") || "";

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/videos?query=${searchQuery}`);
        setVideos(res.data?.data?.videos || []);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchQuery]); // ← Re-fetch when search changes

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {searchQuery ? `Results for "${searchQuery}"` : "Recommended Videos"}
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <Skeleton count={12} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}

        {!loading && videos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">No videos found 😢</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Home;
