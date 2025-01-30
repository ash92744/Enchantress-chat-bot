import { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactMarkdown from 'react-markdown'; // Import react-markdown

function App() {
  const [input, setInput] = useState(""); // User's input
  const [chatHistory, setChatHistory] = useState([]); // Chat history
  const chatWindowRef = useRef(null); // Ref for the chat window

  // Add a default message when the component mounts
  useEffect(() => {
    setChatHistory([{ sender: "bot", message: "Hello, I am Enchantress, Your personal AI-ChatBot, You can ask me anything..." }]);
  }, []);

  // Scroll to the bottom of the chat window whenever chatHistory changes
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatHistory]);

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
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        background: "white"
      }}
    >
      {/* Header */}
      <div
        className="text-center py-2"
        style={{
          background: "radial-gradient(circle,  #092744, black)",
          border: "1px solid white",
          boxShadow: "5px 5px 10px rgba(110, 110, 110, 110.15)",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "60px", // Fixed height to match the input section
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius:"10px"
        }}
      >
        <img
          src="Ench.png"
          alt="Enchantress"
          style={{ maxWidth: "20%", height: "auto", maxHeight: "55px" }} // Constrain image size
        />
      </div>

      {/* Chat Window */}
      <div
        ref={chatWindowRef}
        className="flex-grow-1 overflow-auto p-3"
        style={{
          marginTop: "60px", // Fixed margin to match header height
          marginBottom: "60px", // Fixed margin to match input section height
          marginTop: "60px", // Fixed margin to match input section height
          paddingBottom: "20px", // Add padding to avoid overlap with the input section
        }}
      >
        {chatHistory.map((chat, index) => (
          <div key={index} className={`d-flex ${chat.sender === "user" ? "justify-content-end" : "justify-content-start"} mb-3`}>
            <div
              className={`p-2 rounded-3 ${chat.sender === "user" ? "text-white" : "bg-dark text-light"}`}
              style={{ backgroundColor: "#092744", border: "1px solid white", maxWidth: "80%", boxShadow: "5px 5px 10px rgba(110, 110, 110, 110.15)",}}
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
      <div
        className="border-top p-3"
        style={{
          background: "radial-gradient(circle,  #092744, black)",
          border: "1px solid white",
          boxShadow: "5px 5px 10px rgba(110, 110, 110, 110.15)",
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "60px", // Fixed height to match the header
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius:"10px" 
        }}
      >
        <div className="input-group" style={{ width: "100%",borderRadius:"10px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={{borderRadius:"10px" }}
          />
          <button className="bg-dark text-white border-white" onClick={sendMessage} disabled={!input.trim()} style={{ backgroundColor: "#092744",borderRadius:"10px",marginLeft:"15px" }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;