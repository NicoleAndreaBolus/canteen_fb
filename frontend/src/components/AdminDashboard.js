import React, { useEffect, useState } from "react";
import { getAllFeedbacks, verifyFeedback } from "../api";

export default function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [status, setStatus] = useState({}); // id: "Valid"/"Invalid" etc.

  useEffect(() => {
    getAllFeedbacks().then(setFeedbacks);
  }, []);

  async function handleVerify(feedback) {
    setStatus((prev) => ({ ...prev, [feedback.id]: "..." }));
    try {
      const { valid } = await verifyFeedback(feedback);
      setStatus((prev) => ({ ...prev, [feedback.id]: valid ? "✅ Valid" : "❌ Invalid" }));
    } catch (e) {
      setStatus((prev) => ({ ...prev, [feedback.id]: "❌ Error" }));
    }
  }

  return (
    <div className="admin">
      <h2>All Feedback Entries</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Signature (trunc)</th>
            <th>Verify</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map(f => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.customer_name}</td>
              <td>{f.rating}</td>
              <td>{f.comment}</td>
              <td style={{fontSize: "0.85em"}}>{f.signature.slice(0, 12) + "..."}</td>
              <td>
                <button onClick={() => handleVerify(f)}>
                  Verify
                </button>
                <span style={{marginLeft: 8}}>{status[f.id]}</span>
              </td>
              <td>{(new Date(f.created_at)).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}