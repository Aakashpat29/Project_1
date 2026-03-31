// src/pages/History.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";
import VideoCard from "../components/VideoCard";
import Skeleton from "../components/Skeleton";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users/history");
      setHistory(res.data.data || []);
    } catch (error) {
      console.error(error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVideo = async (videoId) => {
    if (!window.confirm("Remove this video from history?")) return;

    try {
      await API.delete(`/users/history/${videoId}`);

      // Update UI immediately
      setHistory((prev) => prev.filter((video) => video._id !== videoId));
    } catch (error) {
      alert("Failed to remove video from history");
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Clear all watch history?")) return;
    try {
      await API.delete("/users/history/clear");
      setHistory([]);
    } catch (error) {
      alert("Failed to clear history");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">📜 Watch History</h1>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="px-5 py-2 text-red-600 hover:bg-red-50 rounded-full font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <Skeleton count={12} />
          </div>
        ) : history.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {history.map((video) => (
              <div key={video._id} className="relative group">
                <VideoCard video={video} />

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveVideo(video._id)}
                  className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-7xl mb-6">📜</div>
            <h2 className="text-2xl font-semibold text-gray-400">
              No watch history yet
            </h2>
            <p className="text-gray-500 mt-2">
              Videos you watch will appear here
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default History;
