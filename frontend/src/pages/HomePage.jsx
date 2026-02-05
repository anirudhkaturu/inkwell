import { useEffect, useState } from "react";

export const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/posts", {
          credentials: "include", // sends inkwell_auth_cookie
        });

        if (!res.ok) {
          throw new Error("Please log in to view your feed.");
        }

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">📰 Your Feed</h1>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="alert alert-error shadow-lg">
            <span>{error}</span>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center opacity-70 py-20">
            No posts yet. Be the first to write something ✨
          </div>
        )}

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="card bg-base-100 shadow-md">
              <div className="card-body">
                {/* Author + Date */}
                <div className="flex justify-between text-sm opacity-60">
                  <span>Author ID: {post.author}</span>
                  <span>{new Date(post.createdAt).toLocaleString()}</span>
                </div>

                {/* Content */}
                <p className="text-lg mt-2">{post.content}</p>

                {/* Actions */}
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
          ))}
        </div>
      </div>
    </div>
  );
};
