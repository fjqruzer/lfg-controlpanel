"use client";

import React, { useEffect, useState } from "react";
import { getPendingRatings, submitRating } from "@/services/ratingsService";

export function EventRatingsModal({ eventId, open, onClose }) {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submittingId, setSubmittingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !eventId) return;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getPendingRatings(eventId);
        setPending(res.items || []);
      } catch (err) {
        setError(err.message || "Failed to load pending ratings");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, eventId]);

  const handleRate = async (rateeId, stars) => {
    setSubmittingId(rateeId);
    setError("");
    try {
      await submitRating(eventId, { ratee_id: rateeId, stars });
      setPending((list) => list.filter((id) => id !== rateeId));
    } catch (err) {
      setError(err.message || "Failed to submit rating");
    } finally {
      setSubmittingId(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Rate Players from This Game</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-3 text-red-600 text-sm" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div>Loading…</div>
        ) : pending.length === 0 ? (
          <div className="text-gray-600 text-sm">
            No pending ratings. Thanks!
          </div>
        ) : (
          <ul className="space-y-3">
            {pending.map((userId) => (
              <li key={userId} className="flex items-center justify-between">
                <span>Player #{userId}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      disabled={submittingId === userId}
                      onClick={() => handleRate(userId, s)}
                      className={`px-2 py-1 border rounded text-xs ${
                        s <= 3 ? "border-gray-400" : "border-yellow-500"
                      }`}
                    >
                      {s}★
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded bg-gray-50 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventRatingsModal;


