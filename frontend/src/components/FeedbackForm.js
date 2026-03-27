import React, { useState } from "react";
import { submitFeedback } from "../api";

export default function FeedbackForm() {
  const [form, setForm] = useState({ customer_name: "", rating: 5, comment: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    try {
      await submitFeedback(form);
      setMessage("Feedback submitted – thank you!");
      setForm({ customer_name: "", rating: 5, comment: "" });
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.error || err.message));
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Your Name (optional):
        <input name="customer_name" value={form.customer_name} onChange={handleChange} />
      </label>
      <label>
        Rating:
        <select name="rating" value={form.rating} onChange={handleChange}>
          {[1,2,3,4,5].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </label>
      <label>
        Comment:
        <textarea name="comment" value={form.comment} onChange={handleChange} required />
      </label>
      <button type="submit">Submit Feedback</button>
      {message && <p>{message}</p>}
    </form>
  );
}