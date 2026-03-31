// src/components/Navbar.jsx
import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search_query") || ""
  );

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      navigate("/");
      return;
    }
    // YouTube style URL
    navigate(`/?search_query=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <nav className="h-14 bg-white border-b flex items-center px-4">
      <div className="flex items-center justify-between w-full max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-3 hover:bg-gray-100 rounded-full text-2xl"
          >
            ☰
          </button>
          <Link to="/" className="flex items-center gap-1">
            <span className="text-3xl text-red-600">▶️</span>
            <span className="text-2xl font-bold">Zube</span>
          </Link>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-[640px] mx-8">
          <div className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              className="flex-1 border border-gray-300 px-5 py-2.5 rounded-l-full focus:outline-none focus:border-blue-500 text-lg"
            />
            <button
              type="submit"
              className="bg-gray-100 border border-l-0 border-gray-300 px-7 rounded-r-full hover:bg-gray-200 transition"
            >
              🔍
            </button>
          </div>
        </form>

        <div className="flex items-center gap-4">
          <Link
            to="/upload"
            className="flex items-center gap-2 px-5 py-2 hover:bg-gray-100 rounded-full"
          >
            📤 Upload
          </Link>
          {token ? (
            <button
              onClick={handleLogout}
              className="bg-black text-white px-6 py-2 rounded-full"
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full">
                Sign in
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
