import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSend, FiUser, FiCpu, FiPaperclip } from "react-icons/fi";

const ChatbotPanel = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello, I'm your medical AI assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // const sendMessage = () => {
  //   if (input.trim() === "") return;

  //   // Add user message
  //   const userMessage = {
  //     id: messages.length + 1,
  //     sender: "user",
  //     text: input,
  //     timestamp: new Date().toISOString(),
  //   };

  //   setMessages((prevMessages) => [...prevMessages, userMessage]);
  //   setInput("");

  //   // Simulate AI typing
  //   setIsTyping(true);

  //   // Simulate AI response after delay
  //   setTimeout(() => {
  //     const aiResponses = [
  //       "Based on what you've described, it could be a minor inflammatory response. I recommend applying a cold compress and monitoring for 24 hours.",
  //       "Your symptoms align with several common conditions. I'd need more information about your medical history to provide a more accurate assessment.",
  //       "The symptoms you've described could indicate a respiratory infection. It would be best to consult with your primary care physician for a proper diagnosis.",
  //       "From your description, this appears to be a common reaction. However, if symptoms persist beyond 2-3 days, please seek medical attention.",
  //       "I understand your concern. Based on the information provided, this doesn't appear to require emergency care, but I recommend scheduling an appointment with your doctor for further evaluation.",
  //     ];

  //     const randomResponse =
  //       aiResponses[Math.floor(Math.random() * aiResponses.length)];

  //     const aiMessage = {
  //       id: messages.length + 2,
  //       sender: "ai",
  //       text: randomResponse,
  //       timestamp: new Date().toISOString(),
  //     };

  //     setMessages((prevMessages) => [...prevMessages, aiMessage]);
  //     setIsTyping(false);
  //   }, 1500);
  // };
  // -------------------------------------------------------- for chat generating message ----------------------------------------------------------------
  const sendMessage = async () => {
    const token = "JZTGj4NLslCYnPjJbCscDGeD4JLwJhrHuruI";

    if (input.trim() === "") return;
  
    // Add user message to the chat
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      text: input,
      timestamp: new Date().toISOString(),
    };
  
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsTyping(true);
  
    try {
      const response = await fetch("http://216.48.179.162:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: userMessage.text }),
      }); 
  
      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }
  
      const data = await response.json();
  
      // Assuming your backend returns { "response": "AI's reply here" }
      const aiMessage = {
        id: messages.length + 2,
        sender: "ai",
        text: data.response || "No response received.", // fallback if no response
        timestamp: new Date().toISOString(),
      };
  
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
  
      const aiMessage = {
        id: messages.length + 2,
        sender: "ai",
        text: "Sorry, there was an error fetching the response.",
        timestamp: new Date().toISOString(),
      };
  
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };
// ---------------------------------------------------------------------------------------------------------------------------------------

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };



  
{/* ------------------------------------------------------------------------------------------------------------------- */}
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };
{/* ------------------------------------------------------------------------------------------------------------------- */}


  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Medical AI Chatbot</h1>
        <p className="text-gray-600">
          Consult with our AI assistant for medical guidance
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-lg shadow flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="bg-primary-600 text-white p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <FiCpu className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <h3 className="font-medium">Medical AI Assistant</h3>
              <p className="text-xs text-primary-100">
                Online | HIPAA Compliant
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex items-end max-w-[80%]">
                  {message.sender === "ai" && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white mr-2">
                      <FiCpu size={16} />
                    </div>
                  )}

                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-primary-600 text-white rounded-br-none"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p>{message.text}</p>
                    <span
                      className={`text-xs block mt-1 ${
                        message.sender === "user"
                          ? "text-primary-100"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </span>
                  </div>

                  {message.sender === "user" && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-white ml-2">
                      <FiUser size={16} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-end">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white mr-2">
                    <FiCpu size={16} />
                  </div>
                  <div className="rounded-lg px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-bl-none">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t">
          {/* <div className="relative flex">
            <button 
              className="absolute left-2 inset-y-0 flex items-center text-gray-500 hover:text-gray-700"
              title="Attach files"
            >
              <FiPaperclip size={20} />
            </button>
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 px-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none max-h-32"
              rows="1"
            />
            
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className={`absolute right-2 inset-y-0 flex items-center ${
                input.trim() ? 'text-primary-600 hover:text-primary-800' : 'text-gray-400'
              }`}
            >
              <FiSend size={20} />
            </button>
          </div> */}
          {/* ------------------------------------------------added for my purpose--------------------------------------------- */}
            <div className="relative flex items-center">
              {/* Hidden File Input */}
              <input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              {/* Attach button */}
              <button
                className="absolute left-2 inset-y-0 flex items-center text-gray-500 hover:text-gray-700"
                title="Attach PDF"
                onClick={() => fileInputRef.current?.click()}
              >
                <FiPaperclip size={20} />
              </button>

              {/* Message input */}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 px-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none max-h-32"
                rows="1"
              />

              {/* Send button */}
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className={`absolute right-2 inset-y-0 flex items-center ${
                  input.trim()
                    ? "text-primary-600 hover:text-primary-800"
                    : "text-gray-400"
                }`}
              >
                <FiSend size={20} />
              </button>
            </div>
          {/* ------------------------------------------------------------------------------------------------------------------- */}

            {/* Preview Selected PDF File */}
            {selectedFile && (
              <div className="mt-2 text-sm text-gray-600 flex items-center justify-between bg-gray-100 px-3 py-1 rounded">
                <span className="truncate max-w-[90%]">
                  {selectedFile.name}
                </span>
                <button
                  className="text-red-500 hover:text-red-700 ml-2"
                  onClick={() => setSelectedFile(null)}
                >
                  ×
                </button>
              </div>
            )}

          <p className="text-xs text-gray-500 mt-2 text-center">
            This AI assistant is for informational purposes only and does not
            replace professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPanel;
