import { useState, useEffect, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { useNavigate, useParams } from "react-router";
import axios from "../../axios";
import { createSocket } from "../../socket/socket";
import useAuthStore from "../../store/authStore";
import { useAppStore } from "../../store/appStore";
import { useToast } from "../../hooks/useToast";
import { getDateTimeFormat, getErrorMessage } from "../../init/appValues";
import type { Socket } from "socket.io-client";

// ---------- Interfaces ----------
interface SenderObj {
  name: string;
  profilePicture: string;
  _id: string;
}

export interface ChatMessage {
  _id?: string;
  id?: string;
  content: string;
  type: "text";
  sender?: SenderObj;
  createdAt: string;
  chatRoom: string;
}

interface ChatRoom {
  id: string;
  name: string;
  image: string;
  unreadCount: number;
  lastMessage?: ChatMessage;
}

interface SocketMessageResponse {
  success: boolean;
  message: string;
  data: {
    message: ChatMessage;
    chatRoom: ChatRoom;
  };
}

type LoadState = "idle" | "loading" | "ready" | "error";

// ---------- Component ----------
const Chat = () => {
  const navigate = useNavigate();
  const { user } = useAppStore();
  const token = useAuthStore((state) => state.token);
  const { showToast } = useToast();
  const { userId } = useParams();

  const [senders, setSenders] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [receivedMessages, setReceivedMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [state, setState] = useState<LoadState>("idle");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (userId) {
      initiateChatWithUser(userId);
    }
  }, [userId]);

  const initiateChatWithUser = async (userId: string) => {
    try {
      const { data } = await axios.get(`/chat/createChat/${userId}`);
      if (data.success) {
        const room = data.data.chatRoom;
        const messages = data.data.messages;

        setCurrentRoom(room);
        socket?.emit("joinRoom", { roomId: room.id });

        setReceivedMessages([...messages].reverse());
        setState("ready");

        await axios.post(`/chat/markChatAsRead`, { roomId: room.id });
      }
    } catch (error) {
      showToast(getErrorMessage(error), "error");
      setState("error");
    }
  };

  // ---------- Fetch User Chat Rooms ----------
  const fetchSenders = async () => {
    try {
      setState("loading");
      const { data } = await axios.get(`/chat/myChatRooms`);
      if (data.success) {
        setSenders(data.data);
        setState("ready");
      }
    } catch (error) {
      showToast(getErrorMessage(error), "error");
      setState("error");
    }
  };

  // ---------- Select Chat Room ----------
  const handleSelectRoom = async (room: ChatRoom) => {
    if (currentRoom?.id === room.id) return;
    setCurrentRoom(room);
    socket?.emit("joinRoom", { roomId: room.id });

    try {
      setState("loading");
      const { data } = await axios.get(`/chat/getMessages/${room.id}`);
      if (data.success) {
        // backend returns newest message at index 0 → reverse it
        setReceivedMessages([...data.data].reverse());
        setState("ready");
      }
    } catch (error) {
      showToast(getErrorMessage(error), "error");
      setState("error");
    }

    // mark as read
    await axios.post(`/chat/markChatAsRead`, { roomId: room.id });
  };

  // ---------- Send Message ----------
  const handleSendMessage = (text: string) => {
    if (!currentRoom || !socket || !text.trim()) return;
    socket.emit("sendMessage", {
      roomId: currentRoom.id,
      message: text,
      type: "text",
    });

    setInput("");
  };

  // ---------- Setup Socket ----------
  useEffect(() => {
    if (!token) return;

    const newSocket = createSocket(token);
    setSocket(newSocket);
    newSocket.connect();

    newSocket.on("connect", () => {
      console.log("✅ Socket connected");
    });

    newSocket.on("messageReceived", (data: SocketMessageResponse) => {
      const { message, chatRoom } = data.data;

      // if current chat is open → append message to bottom
      if (chatRoom.id === currentRoom?.id) {
        setReceivedMessages((prev) => [...prev, message]);
      } else {
        // otherwise increment unread count
        setSenders((prev) =>
          prev.map((r) =>
            r.id === chatRoom.id
              ? { ...r, unreadCount: (r.unreadCount || 0) + 1 }
              : r
          )
        );
      }
    });

    newSocket.on("errorResponse", (err) =>
      console.error("❌ Socket error:", err)
    );
    newSocket.on("connect_error", (err) =>
      console.error("⚠️ Connection error:", err.message)
    );

    return () => {
      newSocket.disconnect();
      newSocket.off("messageReceived");
      newSocket.off("errorResponse");
      newSocket.off("connect_error");
    };
  }, [token, currentRoom]);

  // ---------- Scroll to Bottom on Message ----------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [receivedMessages]);

  // ---------- Initial Fetch ----------
  useEffect(() => {
    fetchSenders();
  }, []);

  // ---------- UI ----------
  return (
    <div className="max-w-[1260px] mx-auto px-6 py-10">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => navigate("/app/dashboard")}>
          <FaArrowLeft size={16} />
        </button>
        <h1 className="text-2xl font-semibold">Chat</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ---------- SIDEBAR ---------- */}
        <div className="bg-transparent rounded-2xl p-4">
          {state === "loading" ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 animate-pulse"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-300" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 bg-gray-300 rounded" />
                    <div className="h-3 w-2/3 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : senders.length === 0 ? (
            <></>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {senders.map((room) => (
                <div
                  key={room.id}
                  onClick={() => handleSelectRoom(room)}
                  className={`flex items-start gap-3 p-3 relative rounded-2xl cursor-pointer transition-all ${
                    currentRoom?.id === room.id
                      ? "bg-[#FFFFFFBF]"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold">{room.name}</h4>
                    <small className="text-gray-500 truncate block max-w-[150px]">
                      {room.lastMessage?.content}
                    </small>
                    {room.unreadCount > 0 && (
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full absolute top-2 right-4">
                        {room.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------- CHAT WINDOW ---------- */}
        {senders.length === 0 ? (
          <div className="w-full flex justify-center ">
            <p className="text-sm text-gray-400 text-center py-4">
              No chats yet — to start a conversation!
            </p>
          </div>
        ) : (
          <>
            {!currentRoom ? (
              <div className="col-span-2 flex flex-col justify-between border border-[#caced7e4] rounded-t-xl">
                <div className="flex items-center gap-3  pb-3 p-3 bg-white rounded-t-xl h-16"></div>
                <div className="px-6 py-6 space-y-6 overflow-y-auto h-[500px] bg-transparent text-sm text-gray-800">
                  <p className="text-sm text-gray-400 text-center py-4">
                    Select a chat to start messaging
                  </p>
                </div>
              </div>
            ) : (
              <div className="col-span-2 flex flex-col justify-between border border-[#caced7e4] rounded-t-xl">
                {/* Header */}
                <div className="flex items-center gap-3  pb-3 p-3 bg-white rounded-t-xl">
                  {currentRoom && (
                    <>
                      <img
                        src={
                          senders.find((u) => u.id === currentRoom.id)?.image ||
                          ""
                        }
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <h4 className="text-sm font-semibold">
                        {senders.find((u) => u.id === currentRoom.id)?.name}
                      </h4>
                    </>
                  )}
                </div>

                {/* Messages */}
                <div className="px-6 py-6 space-y-6 overflow-y-auto h-[500px] bg-transparent text-sm text-gray-800">
                  {state === "loading" ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`flex flex-col ${
                            i % 2 === 0 ? "items-start" : "items-end"
                          } space-y-1`}
                        >
                          <div
                            className={`${
                              i % 2 === 0 ? "bg-blue-200" : "bg-gray-200"
                            } animate-pulse rounded-xl px-4 py-2`}
                            style={{
                              width: `${60 + Math.random() * 40}%`,
                              height: "20px",
                            }}
                          ></div>
                          <div className="h-3 w-10 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {receivedMessages.map((msg, idx) => (
                        <div
                          key={msg._id || msg.id || idx}
                          className={`flex flex-col ${
                            msg?.sender?._id === user?._id
                              ? "items-end"
                              : "items-start"
                          }`}
                        >
                          <div
                            className={`flex flex-col px-4 py-2 rounded-xl max-w-xs break-words ${
                              msg?.sender?._id === user?._id
                                ? "text-white gradient-color"
                                : "text-black bg-gray-100"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <span className="text-xs text-gray-400 mt-1">
                            {getDateTimeFormat(msg.createdAt)}
                          </span>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Input */}
                <div className="flex items-center gap-3 py-4 bg-white px-4 border-t">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-full outline-neutral-50 text-sm bg-[#CACED738]"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSendMessage(input)
                    }
                  />
                  <button
                    className={`text-[#36C0EF] ${
                      !input.trim() && "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() => handleSendMessage(input)}
                    disabled={!input.trim()}
                  >
                    <IoSend size={24} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
