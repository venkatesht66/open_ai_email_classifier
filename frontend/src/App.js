import React, { useState } from "react";
import "./App.css";

function App() {
  const BACKEND_URL = "http://localhost:4000";

  const [emails, setEmails] = useState([]);
  const [openAIKey, setOpenAIKey] = useState(localStorage.getItem("OPENAI_KEY") || "");
  const [classified, setClassified] = useState([]);
  const [loading, setLoading] = useState(false);

  const saveKey = () => {
    localStorage.setItem("OPENAI_KEY", openAIKey);
    alert("OpenAI key saved successfully!");
  };

  const loginWithGoogle = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/emails`, { credentials: "include" });
      const data = await res.json();
      setEmails(data);
      localStorage.setItem("emails", JSON.stringify(data));
    } catch (err) {
      alert("Please login first!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const classifyEmails = async () => {
    if (!openAIKey) return alert("Enter OpenAI API key first!");
    if (emails.length === 0) return alert("Fetch emails first!");
  
    setLoading(true);
    try {
      const prompt = `
  You are an AI that classifies emails into categories.
  Categories:
  1. Important: personal or work-related, need immediate attention.
  2. Promotions: sales, discounts, campaigns.
  3. Social: messages from friends, family, or social networks.
  4. Marketing: newsletters, product updates, or company notifications.
  5. Spam: unsolicited or scam emails.
  6. General: if none of the above.
  
  Return only JSON in this format:
  [
    { "subject": "...", "from": "...", "category": "..." }
  ]
  
  Emails:
  ${emails.map((e) => `From: ${e.from}\nSubject: ${e.subject}`).join("\n\n")}
  `;
  
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAIKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0,
        }),
      });
  
      const data = await res.json();
  
      if (data.error) {
        console.error("OpenAI Error:", data.error.message);
        alert(`OpenAI Error: ${data.error.message}`);
        setLoading(false);
        return;
      }
  
      const content = data?.choices?.[0]?.message?.content;
      if (!content) {
        alert("No response from OpenAI. Please try again.");
        setLoading(false);
        return;
      }
  
      let parsed = [];
      try {
        parsed = JSON.parse(content);
      } catch (err) {
        console.warn("OpenAI returned non-JSON. Showing raw output:", content);
        parsed = [{ subject: "Parsing Error", category: "Error", details: content }];
      }
  
      setClassified(parsed);
      localStorage.setItem("classifiedEmails", JSON.stringify(parsed));
    } catch (err) {
      console.error("Classification Error:", err);
      alert("Something went wrong while classifying emails.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Gmail + OpenAI Email Classifier</h1>
      </header>

      <div className="controls">
        <button className="btn google" onClick={loginWithGoogle}>Login with Google</button>
        <button className="btn blue" onClick={fetchEmails} disabled={loading}>
          {loading ? "Fetching..." : "Fetch Emails"}
        </button>
        <button className="btn green" onClick={classifyEmails} disabled={loading}>
          {loading ? "Classifying..." : "Classify Emails"}
        </button>
      </div>

      <div className="key-section">
        <input
          type="password"
          placeholder="Enter your OpenAI API Key"
          value={openAIKey}
          onChange={(e) => setOpenAIKey(e.target.value)}
        />
        <button className="btn save" onClick={saveKey}>Save Key</button>
      </div>

      <section className="emails-section">
        <h2>Fetched Emails ({emails.length})</h2>
        <div className="emails-grid">
          {emails.length === 0 ? (
            <p className="empty-text">No emails fetched yet.</p>
          ) : (
            emails.map((e, i) => (
              <div className="email-card" key={i}>
                <h4>{e.subject || "No Subject"}</h4>
                <p><strong>From:</strong> {e.from}</p>
                <p><strong>Date:</strong> {e.date}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="classified-section">
        <h2>Classified Emails</h2>
        <div className="emails-grid">
          {classified.length === 0 ? (
            <p className="empty-text">No classification results yet.</p>
          ) : (
            classified.map((item, index) => (
              <div className={`email-card category-${item.category?.toLowerCase()}`} key={index}>
                <h4>{item.subject || "No Subject"}</h4>
                <p><strong>Category:</strong> {item.category}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {loading && (
        <div className="loader">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}

export default App;