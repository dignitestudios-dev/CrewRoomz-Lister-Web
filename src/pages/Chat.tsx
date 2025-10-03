import { useState, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { MdAttachFile } from "react-icons/md";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router";
import { pdfIcon, user } from "../assets/export";

const users = [
  { id: 1, name: "Mike Smith (258496)", initials: "MS", image: user },
  { id: 2, name: "Darlene Steward (123456)", initials: "DS", image: user },
  { id: 3, name: "Maria Steward (456789)", initials: "MS", image: user },
];

const initialChats = {
  1: [
    {
      sender: "them",
      type: "text",
      text: "Hi John, I’ve uploaded the move-in photos.",
      time: "09:20 AM",
    },
    {
      sender: "me",
      type: "text",
      text: "Thanks Mike! Will check.",
      time: "09:21 AM",
    },

    { sender: "me", type: "text", text: "Got it. All good!", time: "09:24 AM" },
  ],
  2: [
    {
      sender: "them",
      type: "text",
      text: "Hey, can you confirm the lease terms?",
      time: "10:00 AM",
    },
    {
      sender: "me",
      type: "text",
      text: "Yes, I’ll confirm today.",
      time: "10:01 AM",
    },
  ],
  3: [
    {
      sender: "them",
      type: "text",
      text: "Upload complete. Waiting for your review.",
      time: "11:15 AM",
    },
  ],
};

const Chat = () => {
  const [selectedUserId, setSelectedUserId] = useState(1);
  const [chats, setChats] = useState(initialChats);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const selectedMessages = chats[selectedUserId] || [];

  const handleSendMessage = () => {
    const newMessages = [...(chats[selectedUserId] || [])];

    if (input.trim()) {
      newMessages.push({
        sender: "me",
        type: "text",
        text: input,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }

    attachments.forEach((file) => {
      newMessages.push({
        file: URL.createObjectURL(file.file),
        name: file.file.name,
        type: file.type,
        sender: "me",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    });

    setChats((prev) => ({ ...prev, [selectedUserId]: newMessages }));
    setInput("");
    setAttachments([]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      type: file.type.startsWith("image/") ? "image" : "file",
    }));
    setAttachments((prev) => [...prev, ...previews]);
  };

  const removeAttachment = (index) => {
    const updated = [...attachments];
    updated.splice(index, 1);
    setAttachments(updated);
  };

  return (
    <div className="max-w-[1260px] mx-auto px-6 py-10">
      <div className="flex items-center gap-2 mb-6">
        <button type="button" onClick={() => navigate("/app/dashboard")}>
          <FaArrowLeft size={16} />
        </button>
        <h1 className="text-2xl font-semibold">Chat</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="bg-transparent rounded-2xl p-4 ">
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  selectedUserId === user.id
                    ? "bg-[#FFFFFFBF]"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className={`w-10 h-10 rounded-full ${user.color}`}>
                  <img src={user.image} alt="" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">{user.name}</h4>
                  <p className="text-xs text-gray-600">
                    {chats[user.id]?.[chats[user.id].length - 1]?.text?.slice(
                      0,
                      25
                    ) || "No messages yet"}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {chats[user.id]?.[chats[user.id].length - 1]?.time || ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="col-span-2 flex flex-col justify-between border-[1px] border-[#CACED738]">
          {/* Header */}
          <div className="flex items-center gap-3 border-b pb-3 p-3 bg-white rounded-t-xl ">
            <div className="w-10 h-10 rounded-full">
              <img
                src={users.find((u) => u.id === selectedUserId).image}
                alt=""
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold">
                {users.find((u) => u.id === selectedUserId).name}
              </h4>
              <p className="text-xs text-gray-500">Tenant</p>
            </div>
          </div>

          {/* Messages */}
          <div className="px-6 py-6 space-y-6 overflow-y-auto bg-transparent text-sm text-gray-800 h-[500px] pr-2">
            <div className="text-center text-xs text-gray-400">Today</div>

            {selectedMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === "me" ? "items-end" : "items-start"
                }`}
              >
                {msg.type === "text" ? (
                  <div className="gradient-color text-white px-4 py-2 rounded-xl max-w-xs">
                    {msg.text}
                  </div>
                ) : msg.type === "image" ? (
                  <img
                    src={msg.file}
                    alt="attachment"
                    className="w-10 rounded-xl shadow"
                  />
                ) : (
                  <a
                    href={msg.file}
                    download={msg.name}
                    className="bg-gray-200 px-4 py-2 rounded-xl text-blue-700 underline"
                  >
                    {msg.name}
                  </a>
                )}
                <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex items-center gap-3 py-4 bg-white px-4">
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              type="text"
              placeholder="Type Here..."
              className="flex-1 px-4 py-2 rounded-full border text-sm bg-[#CACED738]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button className="text-[#36C0EF]" onClick={handleSendMessage}>
              <IoSend size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
