import ChatbotIcon from "./ChatbotIcon";

// Helper function to convert URLs into clickable links
const linkify = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: blue;">${url}</a>`;
  });
};

const ChatMessage = ({ chat }) => {
  return (
    !chat.hideInChat && (
      <div className={`message ${chat.role === "model" ? "bot" : "user"}-message ${chat.isError ? "error" : ""}`}>
        {chat.role === "model" && <ChatbotIcon />}
        <p
          className="message-text"
          dangerouslySetInnerHTML={{ __html: linkify(chat.text) }}
        />
      </div>
    )
  );
};

export default ChatMessage;
