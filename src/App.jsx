import { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactMarkdown from 'react-markdown'; // Import react-markdown

function App() {
  const [input, setInput] = useState(""); // User's input
  const [chatHistory, setChatHistory] = useState([]); // Chat history
  const chatWindowRef = useRef(null); // Ref for chat window
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight); // Track viewport height

  // Add a default message when the component mounts
  useEffect(() => {
    setChatHistory([{ sender: "bot", message: "Hello, I am Enchantress, Your personal AI-ChatBot, You can ask me anything..." }]);

    // Adjust chat height when keyboard opens/closes
    const handleResize = () => {
      setViewportHeight(window.visualViewport?.height || window.innerHeight);
    };

    window.visualViewport?.addEventListener("resize", handleResize);
    return () => window.visualViewport?.removeEventListener("resize", handleResize);
  }, []);

  async function sendMessage() {
    if (input.trim() === "") return;

    const newChat = [...chatHistory, { sender: "user", message: input }];
    setChatHistory(newChat);
    setInput("");

    setChatHistory((prev) => [...prev, { sender: "bot", message: "Typing..." }]);

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyB7oeKcr32-7Q-7d4uKNB-oJqspaa7Yd7E",
        method: "post",
        data: { contents: [{ parts: [{ text: input }] }] },
      });

      const botMessage = response.data.candidates[0]?.content?.parts[0]?.text || "No response.";
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].message = botMessage;
        return updated;
      });
    } catch {
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].message = "An error occurred. Please try again.";
        return updated;
      });
    }
  }

  return (
    <div
      className="d-flex flex-column"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: viewportHeight, // Adjust height dynamically for mobile keyboard
        overflow: "hidden",
        background: "radial-gradient(circle, white, grey)",
      }}
    >
       {/* Header */}
       <div className="text-center py-3" style={{ background: "radial-gradient(circle,  #092744, black)", border: "1px solid white", boxShadow: "5px 5px 10px rgba(110, 110, 110, 110.15)"}}>
        <img
          src="Ench.png"
          alt="Enchantress"
          style={{ maxWidth: "20%", height: "auto" }}
        />
      </div>

      {/* Chat Window */}
      <div
        ref={chatWindowRef}
        className="flex-grow-1 overflow-auto p-3"
        style={{
          marginTop: "20px", // Push below the fixed header
          marginBottom: "60px", // Prevent overlap with input box
        }}
      >
        {chatHistory.map((chat, index) => (
          <div key={index} className={`d-flex ${chat.sender === "user" ? "justify-content-end" : "justify-content-start"} mb-3`}>
            <div
              className={`p-2 rounded-0 ${chat.sender === "user" ? "text-white" : "bg-dark text-light"}`}
              style={{
                backgroundColor: "#092744",
                border: "1px solid white",
                maxWidth: "75%",
                boxShadow: "5px 5px 10px rgba(110, 110, 110, 0.15)",
                borderRadius: "300px",
              }}
            >
              {/* Use ReactMarkdown to render the message */}
              {chat.sender === "bot" ? (
                <ReactMarkdown>{chat.message}</ReactMarkdown>
              ) : (
                chat.message
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="border-top p-2" style={{ 
        background: "radial-gradient(circle,  #092744, black)", 
        borderTop: "1px solid white", 
        boxShadow: "5px 5px 10px rgba(110, 110, 110, 110.15)",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000 // Ensure it stays on top
      }}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-dark text-white border-white"
            onClick={sendMessage}
            disabled={!input.trim()}
            style={{ backgroundColor: "#092744" }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
