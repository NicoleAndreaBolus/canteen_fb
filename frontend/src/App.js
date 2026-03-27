import React, { useState } from "react";
import FeedbackForm from "./components/FeedbackForm";
import AdminDashboard from "./components/AdminDashboard";
import "./styles.css";

export default function App() {
  const [adminMode, setAdminMode] = useState(false);
  return (
    <div className="container">
      <h1>Canteen Feedback System (EdDSA Secured)</h1>
      <div className="nav">
        <button onClick={() => setAdminMode(false)} className={!adminMode ? "active" : ""}>Customer Feedback</button>
        <button onClick={() => setAdminMode(true)} className={adminMode ? "active" : ""}>Admin Dashboard</button>
      </div>
      <hr />
      {!adminMode && <FeedbackForm />}
      {adminMode && <AdminDashboard />}
    </div>
  );
}