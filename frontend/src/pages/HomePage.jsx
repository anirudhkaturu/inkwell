import { useState, useEffect, useCallback, useRef } from "react";

export const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [likedPosts, setLikedPosts] = useState(new Set());

  const observerRef = useRef(null);
  const lastPostRef = useRef(null);

  const fetchPosts = useCallback(async (cursor = null) => {
    try {
      cursor ? setLoadingMore(true) : setLoading(true);
      const url = cursor
        ? `http://localhost:8080/api/posts?cursor=${cursor}`
        : `http://localhost:8080/api/posts`;

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Please log in to view your feed.");

      const data = await res.json();
      setPosts((prev) => (cursor ? [...prev, ...data.posts] : data.posts));
      setNextCursor(data.nextCursor);
      setHasNextPage(Boolean(data.nextCursor));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (!lastPostRef.current || !hasNextPage || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && nextCursor && !loadingMore) {
          fetchPosts(nextCursor);
        }
      },
      { root: null, rootMargin: "400px", threshold: 0 },
    );

    observer.observe(lastPostRef.current);
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [posts, hasNextPage, loadingMore, nextCursor, fetchPosts]);

  const handleScrollTopAndRefresh = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPosts([]);
    setNextCursor(null);
    setHasNextPage(true);
    fetchPosts();
  };

  const handleLike = async (postId) => {
    if (likedPosts.has(postId)) return;

    setLikedPosts((prev) => new Set([...prev, postId]));
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, likes: p.likes + 1 } : p)),
    );

    try {
      const res = await fetch(`http://localhost:8080/api/post/${postId}/like`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to like post");
    } catch (err) {
      console.error(err);
      setLikedPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, likes: p.likes - 1 } : p)),
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const generateGradient = (username) => {
    const gradients = [
      "from-rose-400 to-orange-300",
      "from-purple-400 to-pink-300",
      "from-blue-400 to-cyan-300",
      "from-emerald-400 to-teal-300",
      "from-violet-400 to-purple-300",
      "from-amber-400 to-yellow-300",
    ];
    const index = username ? username.charCodeAt(0) % gradients.length : 0;
    return gradients[index];
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      {/* Floating Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <span className="text-white text-xl font-bold">S</span>
            </div>
            <h1 className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Stream
            </h1>
          </div>

          <button
            onClick={handleScrollTopAndRefresh}
            className="group p-2.5 rounded-full hover:bg-white/80 transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Refresh feed"
          >
            <svg
              className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Create Post Input */}
        <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-300">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 shrink-0" />
            <div className="flex-1">
              <input
                type="text"
                placeholder="What's on your mind?"
                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 border-0 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all duration-300 cursor-pointer hover:bg-gray-100"
                readOnly
                onClick={() => {
                  /* Open create post modal */
                }}
              />
              <div className="flex gap-2 mt-3">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-500 text-sm transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Photo
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-500 text-sm transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                    />
                  </svg>
                  GIF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 animate-in slide-in-from-top-2">
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post, index) => {
            const isLastPost = index === posts.length - 1;
            const isLiked = likedPosts.has(post._id);
            const avatarGradient = generateGradient(post.author?.username);

            return (
              <article
                key={post._id}
                ref={isLastPost ? lastPostRef : null}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300"
              >
                {/* Post Header */}
                <div className="p-4 pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-linear-to-br ${avatarGradient} flex items-center justify-center text-white font-semibold text-sm shadow-md`}
                      >
                        {post.author?.username?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm hover:text-indigo-600 transition-colors cursor-pointer">
                          {post.author?.username || "Unknown User"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-4 pt-3">
                  <p className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>

                {/* Post Actions */}
                <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleLike(post._id)}
                      disabled={isLiked}
                      className={`group flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                        isLiked
                          ? "bg-rose-50 text-rose-600"
                          : "hover:bg-gray-100 text-gray-600 hover:text-rose-500"
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${isLiked ? "scale-110" : "group-hover:scale-110"}`}
                        fill={isLiked ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={isLiked ? 0 : 2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span
                        className={`text-sm font-medium ${isLiked ? "text-rose-600" : ""}`}
                      >
                        {post.likes}
                      </span>
                    </button>

                    <button className="group flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-all duration-300">
                      <svg
                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span className="text-sm font-medium">Comment</span>
                    </button>

                    <button className="group flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-all duration-300">
                      <svg
                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                      <span className="text-sm font-medium">Share</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Loading States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
              <div
                className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-purple-600 animate-spin animate-reverse opacity-50"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              />
            </div>
            <p className="text-gray-400 text-sm font-medium animate-pulse">
              Loading your feed...
            </p>
          </div>
        )}

        {loadingMore && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-3 border-gray-200 border-t-indigo-600 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              Be the first to share something interesting with your community
            </p>
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-indigo-600/25">
              Create Post
            </button>
          </div>
        )}

        {/* End of Feed */}
        {!hasNextPage && posts.length > 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-500 text-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              You're all caught up
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={handleScrollTopAndRefresh}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Scroll to top"
      >
        <div className="absolute inset-0 bg-indigo-600 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
        <div className="relative w-14 h-14 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center text-white transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 active:scale-95">
          <svg
            className="w-6 h-6 transition-transform duration-300 group-hover:-rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </div>
      </button>
    </div>
  );
};
