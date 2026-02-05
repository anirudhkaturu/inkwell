import { useState, useRef, useEffect, useCallback } from "react";

export const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const lastPostRef = useRef(null);
  const observerRef = useRef(null);

  // ✅ Stable fetchPosts using useCallback
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
      setHasNextPage(data.hasNextPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []); // Empty deps - only setState functions

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ✅ Single effect that handles everything
  useEffect(() => {
    // Don't observe if no ref, no more pages, or currently loading
    if (!lastPostRef.current || !hasNextPage || loadingMore) {
      // Cleanup existing observer if conditions not met
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    // Create new observer
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && nextCursor && !loadingMore) {
          fetchPosts(nextCursor);
        }
      },
      { root: null, rootMargin: "100px", threshold: 0 },
    );

    observer.observe(lastPostRef.current);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [posts.length, hasNextPage, loadingMore, nextCursor, fetchPosts]);

  return (
    <div className="min-h-screen bg-base-200 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">📰 Your Feed</h1>

        {loading && (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {error && (
          <div className="alert alert-error shadow-lg">
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center opacity-70 py-20">
            No posts yet. Be the first to write something ✨
          </div>
        )}

        <div className="space-y-6">
          {posts.map((post, index) => {
            const isLastPost = index === posts.length - 1;
            return (
              <div
                key={post._id}
                ref={isLastPost ? lastPostRef : null}
                className="card bg-base-100 shadow-md"
              >
                <div className="card-body">
                  <div className="flex justify-between text-sm opacity-60">
                    <span>{post.author?.username || "Unknown"}</span>
                    <span>{new Date(post.createdAt).toLocaleString()}</span>
                  </div>

                  <p className="text-lg mt-2 break-words whitespace-pre-wrap">
                    {post.content}
                  </p>

                  <div className="card-actions justify-between mt-4 items-center">
                    <div className="badge badge-outline">
                      ❤️ {post.likes} Likes
                    </div>

                    <div>
                      <button className="btn btn-ghost btn-sm">Like</button>
                      <button className="btn btn-ghost btn-sm">Comment</button>
                      <button className="btn btn-ghost btn-sm">Share</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {loadingMore && (
          <div className="flex justify-center mt-4">
            <span className="loading loading-spinner loading-md text-primary"></span>
          </div>
        )}
      </div>
    </div>
  );
};
