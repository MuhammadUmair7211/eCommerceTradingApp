import { useEffect, useState } from "react";
import {
  Search,
  MessageSquare,
  Send,
  User,
  Clock,
  UserCircle2,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { baseUrl } from "../../../config/config";
import { useApp } from "../../context/AppContext";

const LeaderSupport = () => {
  const { allSupports, getLeaderData } = useApp();
  const [selectedChat, setSelectedChat] = useState(null);
  const [reply, setReply] = useState("");
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  useEffect(() => {
    getLeaderData();
  }, []);
  // SEND REPLY
  const handleReply = async () => {
    if (!reply.trim() || !selectedChat?._id) return;
    try {
      const { data } = await axios.put(
        `${baseUrl}/support/reply/${selectedChat._id}`,
        { message: reply },
      );
      if (data.success) {
        setReply("");
        toast.success(data.message);
        await getLeaderData();

        // Update currently selected chat
        const updated = data.support;
        if (updated) {
          setSelectedChat(updated);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to send reply");
    }
  };
  useEffect(() => {
    if (!selectedChat) return;

    const updatedChat = allSupports.find(
      (chat) => chat._id === selectedChat._id,
    );

    if (updatedChat) {
      setSelectedChat(updatedChat);
    }
  }, [allSupports]);

  return (
    <div className="h-screen bg-slate-900 text-slate-300 flex overflow-hidden">
      {/* ================= LEFT PANEL ================= */}
      <div
        className={`w-full md:w-96 border-r border-slate-700 flex flex-col
        ${isMobileChatOpen ? "hidden md:flex" : "flex"}`}
      >
        {/* HEADER */}
        <div className="p-5 border-b border-slate-700">
          <h1 className="text-xl font-bold">Customer Support</h1>
          <p className="text-sm">Total Requests: {allSupports?.length || 0}</p>
        </div>

        {/* SEARCH */}
        <div className="p-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-300"
            />
            <input
              type="text"
              placeholder="Search user..."
              className="w-full border border-slate-700 pl-10 pr-4 py-2 bg-slate-800 text-white"
            />
          </div>
        </div>

        {/* CHAT LIST */}
        <div className="flex-1 overflow-y-auto">
          {allSupports?.map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                setSelectedChat(chat);
                setIsMobileChatOpen(true);
              }}
              className={`p-4 border-b cursor-pointer transition
              ${
                selectedChat?._id === chat._id
                  ? "bg-slate-700"
                  : "hover:bg-slate-800"
              }`}
            >
              {/* USER + STATUS */}
              <div className="flex items-center">
                <h3 className="font-semibold text-slate-200 flex-1">
                  {chat.user?.username || "User"}
                </h3>
              </div>

              {/* LAST MESSAGE */}
              <p className="text-sm text-slate-400 truncate mt-1">
                {chat.messages?.[chat.messages.length - 1]?.message}
              </p>

              {/* COUNT */}
              <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                <Clock size={12} />
                {chat.messages?.length || 0} messages
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div
        className={`flex-1 flex flex-col
        ${!isMobileChatOpen && "hidden md:flex"}`}
      >
        {!selectedChat ? (
          <div className="flex flex-col items-center justify-center h-full">
            <MessageSquare size={60} />
            <p className="mt-4 text-lg text-slate-400">
              Select a support request
            </p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="border-b border-slate-700 p-5 flex items-center gap-3">
              {/* BACK BUTTON (MOBILE) */}
              <button
                onClick={() => {
                  setIsMobileChatOpen(false);
                  setSelectedChat(null);
                }}
                className="md:hidden text-2xl text-slate-300 duration-300 cursor-pointer hover:scale-105"
              >
                <ArrowLeft />
              </button>

              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                <User size={22} />
              </div>

              <div>
                <h2 className="font-bold">{selectedChat.user?.username}</h2>
                <p className="text-sm text-slate-400">Support Conversation</p>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedChat.messages?.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex items-end gap-2 ${
                    msg.sender === "leader" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender !== "leader" && (
                    <UserCircle2 size={38} className="text-slate-400" />
                  )}

                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 shadow ${
                      msg.sender === "leader"
                        ? "bg-green-600 text-white rounded-br-none"
                        : "bg-slate-600 text-white rounded-bl-none"
                    }`}
                  >
                    <div className="text-xs opacity-80">
                      {msg.sender === "leader"
                        ? "Leader"
                        : selectedChat.user?.username}
                    </div>

                    <p className="break-words">{msg.message}</p>

                    <div className="text-[10px] mt-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {msg.sender === "leader" && (
                    <UserCircle2 size={38} className="text-green-500" />
                  )}
                </div>
              ))}
            </div>

            {/* REPLY BOX */}
            <div className="border-t border-slate-700 p-5">
              <textarea
                rows="3"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write your reply..."
                className="w-full border border-slate-700 rounded-xl p-3 bg-slate-800 text-white resize-none"
              />

              <div className="flex justify-end mt-3">
                <button
                  onClick={handleReply}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2 flex items-center gap-2 rounded-lg"
                >
                  <Send size={18} />
                  Send Reply
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderSupport;
