import React, { useEffect, useState } from "react";
import { apiGet, apiPatch } from "../api";

export default function VideoDetails() {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchVideo() {
      const data = await apiGet("/video");
      setVideo(data);
      setTitle(data.title || "");
      setDesc(data.description || "");
    }
    fetchVideo();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    await apiPatch("/video", { title, description: desc });

    // reload video after save
    const data = await apiGet("/video");
    setVideo(data);
    setSaving(false);
    setEditMode(false);
  };

  if (!video) return <p>Loading...</p>;

  return (
    <div className="bg-white p-4 shadow rounded mb-4">
      <h2 className="text-xl font-bold mb-2">Video Details</h2>

      {/* Playable video if API gives video.url else show thumbnail */}
      {video?.url ? (
        <video src={video.url} controls className="w-full max-w-sm rounded" />
      ) : (
        <img
          src={video?.thumbnails?.medium?.url}
          className="w-full max-w-sm rounded"
          alt="Video thumbnail"
        />
      )}

      {/* === VIEW MODE === */}
      {!editMode && (
        <div className="mt-3 space-y-2">
          <p>
            <strong>Title:</strong> {video.title}
          </p>
          <p>
            <strong>Description:</strong> {video.description}
          </p>

          <button
            className="bg-gray-700 text-white px-4 py-2 rounded"
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
        </div>
      )}

      {/* === EDIT MODE === */}
      {editMode && (
        <form onSubmit={save} className="space-y-3 mt-3">
          <input
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full border p-2 rounded"
            rows={4}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      )}
    </div>
  );
}
