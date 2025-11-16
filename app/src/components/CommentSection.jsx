import React, { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "../api";

export default function CommentsSection() {
  const [threads, setThreads] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    async function fetchComments() {
      const data = await apiGet("/comments");
      setThreads(data);
    }
    fetchComments();
  }, []);

  const reload = async () => {
    const data = await apiGet("/comments");
    setThreads(data);
  };

  const add = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await apiPost("/comments", { text });
    setText("");
    reload();
  };

  const remove = async (id) => {
    if (!confirm("Delete this comment?")) return;
    await apiDelete(`/comments/${id}`);
    reload();
  };

  return (
    <div className="bg-white p-4 shadow rounded space-y-4">
      <h2 className="text-xl font-semibold">Comments</h2>

      <form onSubmit={add} className="space-y-2">
        <textarea
          className="w-full border p-2 rounded"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Add Comment
        </button>
      </form>

      <ul className="space-y-3">
        {threads.map((t) => {
          const c = t.snippet.topLevelComment;
          return (
            <li key={t.id} className="border-b pb-2">
              <p className="font-semibold">{c.snippet.authorDisplayName}</p>

              {/* Shows HTML formatting from YouTube comments */}
              <p dangerouslySetInnerHTML={{ __html: c.snippet.textDisplay }} />

              <button
                onClick={() => remove(c.id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
