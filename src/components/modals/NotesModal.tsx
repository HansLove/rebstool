import { useState } from "react";
import { FiX, FiSave, FiFileText } from "react-icons/fi";

interface NotesModalProps {
  user: any;
  onClose: () => void;
  onSave: (note: string, status?: string) => void;
}

export default function NotesModal({ user, onClose, onSave }: NotesModalProps) {
  const [note, setNote] = useState(user.Description || "");
  const [status, setStatus] = useState(user.status || "");

  const predefinedNotes = [
    "💰 Above 1K deposit",
    "👥 Assigned to another affiliate",
    "⏳ Input left open",
    "🛑 Suspicious activity",
    "📉 No response after deposit",
  ];

  const statusOptions = [
    "Pending",
    "Triggered",
    "Investigating",
    "Ignored"
  ];

  const handleSave = () => {
    onSave(note, status);
    // onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md shadow-xl overflow-hidden relative">
        <div className="p-6">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors duration-200"
            onClick={onClose}
          >
            <FiX className="h-5 w-5" />
          </button>

          <h2 className="text-lg font-semibold mb-5 text-gray-800 flex items-center justify-center gap-2">
            <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
              <FiFileText className="h-4 w-4" />
            </span>
            Add Note for {user?.ce_user_id}
          </h2>

          <label className="block text-sm text-gray-700 mb-1">Note</label>
          <textarea
            className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your note here..."
          />

          <div className="mt-4">
            <h4 className="text-xs font-semibold mb-2 text-gray-500">
              Quick Notes:
            </h4>
            <div className="flex flex-wrap gap-2">
              {predefinedNotes.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md border border-gray-300 transition-colors duration-200"
                  onClick={() => setNote(preset)}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700 mb-1">Status</label>
            <select
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">-- Select status --</option>
              {statusOptions.map((opt, idx) => (
                <option key={idx} value={opt} className="bg-white">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={handleSave}
              className="boton-user px-5 py-2 flex items-center gap-1.5 transition-all duration-200"
            >
              <FiSave className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}