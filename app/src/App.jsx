import React from "react";
import CommentsSection from "./Components/CommentSection.jsx";
import VideoDetails from "./Components/VideoDetails";
import NotesSection from "./Components/NotesSectio";

export default function App() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center pb-3">
        🎥 YouTube Companion Dashboard
      </h1>
       <VideoDetails/>
      <CommentsSection/>
      <NotesSection/>
    </div>
  );
}
