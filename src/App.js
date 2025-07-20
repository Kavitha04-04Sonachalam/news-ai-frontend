import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Keep your updated CSS file here

function App() {
  const [topic, setTopic] = useState("");
  const [news, setNews] = useState([]);
  const [error, setError] = useState("");

  // ✅ Function to speak news aloud
  const speakNews = (newsArray) => {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = newsArray.join(". ");
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.cancel(); // cancel any existing speech
    speechSynthesis.speak(utterance);
  };

  // ✅ Fetch news from backend
  const fetchNews = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic to search.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/news",
        { topic },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const fetchedNews = response.data.news || [];

      setNews(fetchedNews);
      setError("");

      if (fetchedNews.length > 0) {
        speakNews(fetchedNews); // Speak after fetch
      } else {
        setError("No news found for this topic.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching news.");
    }
  };

  return (
    <div className="app-container">
      <h1>📰 AI News Bot</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter a topic like technology, health..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button onClick={fetchNews}>Get News</button>
      </div>

      {error && <p className="error">{error}</p>}

      <ul>
        {news.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {news.length > 0 && (
        <button onClick={() => speakNews(news)} style={{ marginTop: "20px", backgroundColor: "#22c55e" }}>
          🔊 Read News Again
        </button>
      )}
    </div>
  );
}

export default App;


