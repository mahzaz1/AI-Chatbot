// Commiting for git activity
import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { myInfo } from "./myInfo";
const App = () => {
  const chatBodyRef = useRef();
  const [showChatbot, setShowChatbot] = useState(true);
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: myInfo,
    },
  ]);
  const generateBotResponse = async (history) => {
    // Helper function to update chat history
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text != "Thinking..."),
        { role: "model", text, isError },
      ]);
    };
    // Format chat history for API request
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };
    try {
      // Make the API call to get the bot's response
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data?.error.message || "Something went wrong!");
      // Clean and update chat history with bot's response
      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updateHistory(apiResponseText);
    } catch (error) {
      // Update chat history with the error message
      updateHistory(error.message, true);
    }
  };
  useEffect(() => {
    // Auto-scroll whenever chat history updates
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);
  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      
      <div className="chatbot-popup">
        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">EzazBot</h2>
          </div>
        </div>
        {/* Chatbot Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hi there! 👋
              <br />
              I’m EzazBot — this chatbot is built to speak just like me.
              <br />
              Feel free to ask anything about my work, experience, or how I can
              help you.
            </p>
          </div>
          {/* Render the chat history dynamically */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>
        {/* Chatbot Footer */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};
export default App;
