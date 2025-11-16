import React, { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api";

export default function NotesSection() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    async function fetchNotes() {
      const data = await apiGet("/notes");
      setNotes(data);
    }
    fetchNotes();
  }, []);

  const reload = async () => {
    const data = await apiGet("/notes");
    setNotes(data);
  };

  const add = async () => {
    if (!text.trim()) return;
    await apiPost("/notes", { text });
    setText("");
    reload();
  };

  const save = async (id) => {
    await apiPut(`/notes/${id}`, { text: editing.text });
    setEditing(null);
    reload();
  };

  const remove = async (id) => {
    if (!confirm("Delete note?")) return;
    await apiDelete(`/notes/${id}`);
    reload();
  };

  return (
    <div className="bg-white p-4 shadow rounded space-y-4">
      <h2 className="text-xl font-semibold">Notes</h2>

      <div className="space-y-2">
        <textarea
          className="w-full border p-2 rounded"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={add} className="bg-purple-600 text-white px-4 py-2 rounded">
          Add Note
        </button>
      </div>

      <ul className="space-y-3">
        {notes.map((n) => (
          <li key={n.id} className="border-b pb-2">
            {editing && editing.id === n.id ? (
              <>
                <textarea
                  className="w-full border p-2 rounded"
                  rows={2}
                  value={editing.text}
                  onChange={(e) =>
                    setEditing({ ...editing, text: e.target.value })
                  }
                />
                <button onClick={() => save(n.id)} className="text-blue-600 mr-3">
                  Save
                </button>
                <button onClick={() => setEditing(null)} className="text-gray-600">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p>{n.text}</p>
                <div className="text-sm space-x-3">
                  <button onClick={() => setEditing(n)} className="text-blue-600">
                    Edit
                  </button>
                  <button onClick={() => remove(n.id)} className="text-red-600">
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
