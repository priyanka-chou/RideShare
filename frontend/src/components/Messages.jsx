

// import { useEffect, useLayoutEffect, useRef, useState } from "react";
// import MessageCard from "./MessageCard";
// import { FiPhone, FiVideo, FiSend, FiArrowLeft } from "react-icons/fi";
// import profile from "../assets/avtar.avif";
// import { IoIosSearch } from "react-icons/io";

// import {
//   getConversation,
//   sendChatMessage,
//   getAllUsers,
// } from "../services/api/messageApi";

// const formatTime = (value) =>
//   value
//     ? new Date(value).toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       })
//     : "";

// const Messages = () => {
//   const [conversations, setConversations] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [allMessages, setAllMessages] = useState({});
//   const [message, setMessage] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loadingUsers, setLoadingUsers] = useState(true);
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [sending, setSending] = useState(false);
//   // Mobile/tablet: false = conversation list, true = open chat (WhatsApp jaisa)
//   const [showChat, setShowChat] = useState(false);

//   const messagesEndRef = useRef(null);
//   const mainRef = useRef(null);
//   // Phone/tablet par chat ka fixed area: { top, bottom } (navbar aur bottom bar ke beech)
//   const [mainInsets, setMainInsets] = useState(null);

//   const messages = selectedUser ? allMessages[selectedUser.id] || [] : [];

//   const updatedConversations = conversations.map((conversation) => {
//     const userMessages = allMessages[conversation.id] || [];
//     const lastMessage = userMessages[userMessages.length - 1];

//     return {
//       ...conversation,
//       lastMessage: lastMessage ? lastMessage.text : conversation.lastMessage,
//       time: lastMessage ? lastMessage.time : conversation.time,
//     };
//   });

//   // Phone/tablet par chat ko screen par FIXED rakho: upar navbar ke neeche se
//   // neeche bottom bar ke upar tak. Isse header aur input kabhi scroll nahi hote,
//   // sirf messages scroll hote hain (WhatsApp jaisa).
//   useLayoutEffect(() => {
//     const html = document.documentElement;
//     const body = document.body;
//     const prevHtml = html.style.overflow;
//     const prevBody = body.style.overflow;

//     const TOP_FALLBACK = 90;
//     const BOTTOM_FALLBACK = 74;

//     // Screen ke kisi point par jo fixed/sticky bar hai usko dhundo
//     const findBar = (x, y) => {
//       const main = mainRef.current;
//       if (main) main.style.pointerEvents = "none";

//       let node = document.elementFromPoint(x, y);

//       if (main) main.style.pointerEvents = "";

//       while (node && node !== document.body && node !== html) {
//         const position = getComputedStyle(node).position;
//         if (position === "fixed" || position === "sticky") {
//           return node.getBoundingClientRect();
//         }
//         node = node.parentElement;
//       }

//       return null;
//     };

//     const measure = () => {
//       // Desktop: normal CSS layout
//       if (window.innerWidth >= 1024) {
//         setMainInsets(null);
//         return;
//       }

//       window.scrollTo(0, 0);

//       const topRect = findBar(window.innerWidth / 2, 2);
//       const bottomRect = findBar(
//         window.innerWidth / 2,
//         window.innerHeight - 2
//       );

//       const top = topRect ? Math.max(topRect.bottom, 0) : TOP_FALLBACK;
//       const bottom = bottomRect
//         ? Math.max(window.innerHeight - bottomRect.top, 0)
//         : BOTTOM_FALLBACK;

//       setMainInsets({ top, bottom });
//     };

//     html.style.overflow = "hidden";
//     body.style.overflow = "hidden";

//     measure();
//     window.addEventListener("resize", measure);
//     window.addEventListener("orientationchange", measure);

//     return () => {
//       html.style.overflow = prevHtml;
//       body.style.overflow = prevBody;
//       window.removeEventListener("resize", measure);
//       window.removeEventListener("orientationchange", measure);
//     };
//   }, []);

//   // Users fetch karo + alag se self-chat entry add karo
//   useEffect(() => {
//     let cancelled = false;

//     const fetchUsers = async () => {
//       try {
//         setLoadingUsers(true);

//         const response = await getAllUsers();
//         const users = response.data;

//         if (!Array.isArray(users)) {
//           throw new Error("Invalid users API response");
//         }

//         if (cancelled) return;

//         // Duplicate ids hatao
//         const uniqueUsers = Array.from(
//           new Map(users.map((item) => [Number(item.id), item])).values()
//         );

//         // Backend khud batata hai ki logged-in user kaun hai (isMe),
//         // localStorage ki id par depend nahi karna
//         const isMe = (item) => Boolean(Number(item.isMe));

//         const myRecord = uniqueUsers.find(isMe) || null;

//         const formattedUsers = uniqueUsers
//           .filter((item) => !isMe(item))
//           .map((item) => ({
//             id: Number(item.id),
//             name: item.name || "Unknown user",
//             profilePic: item.profilePic || null,
//             lastMessage: item.lastMessage || "",
//             time: formatTime(item.lastMessageTime),
//             isSelf: false,
//           }));

//         const selfConversation = myRecord
//           ? {
//               id: Number(myRecord.id),
//               name: `${myRecord.name || "You"} (You)`,
//               profilePic: myRecord.profilePic || null,
//               lastMessage: myRecord.lastMessage || "My Notes",
//               time: formatTime(myRecord.lastMessageTime),
//               isSelf: true,
//             }
//           : null;

//         const allConversations = [
//           ...(selfConversation ? [selfConversation] : []),
//           ...formattedUsers,
//         ];

//         setConversations(allConversations);

//         const savedChatId = localStorage.getItem("selectedChatId");

//         const userToSelect =
//           allConversations.find((item) => String(item.id) === savedChatId) ||
//           formattedUsers[0] ||
//           selfConversation ||
//           null;

//         setSelectedUser(userToSelect);
//       } catch (error) {
//         console.error("Users fetch failed:", error);
//       } finally {
//         if (!cancelled) setLoadingUsers(false);
//       }
//     };

//     fetchUsers();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // Messages fetch honge (self-chat "My Notes" ke liye bhi)
//   useEffect(() => {
//     if (!selectedUser) return;

//     let cancelled = false;

//     const fetchMessages = async () => {
//       try {
//         setLoadingMessages(true);

//         const response = await getConversation(selectedUser.id);
//         const fetchedMessages = response.data;

//         if (!Array.isArray(fetchedMessages)) {
//           throw new Error("Invalid conversation API response");
//         }

//         if (cancelled) return;

//         setAllMessages((prev) => ({
//           ...prev,
//           [selectedUser.id]: fetchedMessages.map((msg) => ({
//             id: msg.id,
//             text: msg.message,
//             time: formatTime(msg.created_at),
//             sender: selectedUser.isSelf
//               ? "me"
//               : Number(msg.sender_id) === Number(selectedUser.id)
//               ? "other"
//               : "me",
//           })),
//         }));
//       } catch (error) {
//         if (!cancelled) {
//           console.error("Messages fetch failed:", error);
//         }
//       } finally {
//         if (!cancelled) setLoadingMessages(false);
//       }
//     };

//     fetchMessages();

//     return () => {
//       cancelled = true;
//     };
//   }, [selectedUser?.id, selectedUser?.isSelf]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({
//       behavior: "smooth",
//     });
//   }, [messages, selectedUser?.id, showChat]);

//   const handleSelectConversation = (conversation) => {
//     setSelectedUser(conversation);
//     setMessage("");
//     setShowChat(true);
//     localStorage.setItem("selectedChatId", String(conversation.id));
//   };

//   const handleBackToList = () => {
//     setShowChat(false);
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();

//     const text = message.trim();

//     if (!text || !selectedUser || sending) {
//       return;
//     }

//     try {
//       setSending(true);

//       const response = await sendChatMessage(selectedUser.id, text);
//       const sentMessage = response.data;

//       if (!sentMessage) {
//         throw new Error("Invalid send-message API response");
//       }

//       const newMessage = {
//         id: sentMessage.id,
//         text: sentMessage.message,
//         time: sentMessage.created_at
//           ? formatTime(sentMessage.created_at)
//           : formatTime(new Date()),
//         sender: "me",
//       };

//       setAllMessages((prev) => ({
//         ...prev,
//         [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage],
//       }));

//       setMessage("");
//     } catch (error) {
//       console.error("Message send failed:", error);
//       alert(
//         error.response?.data?.message ||
//           "Message send failed. Please try again."
//       );
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <main
//       ref={mainRef}
//       style={
//         mainInsets
//           ? {
//               position: "fixed",
//               top: `${mainInsets.top}px`,
//               bottom: `${mainInsets.bottom}px`,
//               left: 0,
//               right: 0,
//             }
//           : undefined
//       }
//       className="grid min-h-0 grid-cols-1 overflow-hidden bg-white lg:h-[calc(100dvh-72px)] lg:grid-cols-[300px_minmax(0,1fr)]"
//     >
//       <aside
//         className={`${
//           showChat ? "hidden" : "flex"
//         } min-h-0 flex-col border-r border-gray-200 lg:flex`}
//       >
//         <div className="shrink-0 p-5">
//           <h2 className="text-2xl font-bold text-gray-800">Messages</h2>

//           <div className="relative mt-4">
//             <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search Conversations..."
//               className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm outline-none focus:border-orange-500"
//             />
//           </div>
//         </div>

//         <div className="min-h-0 flex-1 overflow-y-auto">
//           {loadingUsers && (
//             <p className="p-4 text-sm text-gray-500">Loading users...</p>
//           )}

//           {!loadingUsers && conversations.length === 0 && (
//             <p className="p-4 text-sm text-gray-500">No users found.</p>
//           )}

//           {updatedConversations
//             .filter((conversation) =>
//               conversation.name
//                 .toLowerCase()
//                 .includes(searchTerm.toLowerCase().trim())
//             )
//             .map((conversation) => (
//               <MessageCard
//                 key={`${conversation.isSelf ? "self" : "user"}-${conversation.id}`}
//                 name={conversation.name}
//                 profilePic={conversation.profilePic}
//                 lastMessage={conversation.lastMessage}
//                 time={conversation.time}
//                 isActive={
//                   selectedUser?.id === conversation.id &&
//                   selectedUser?.isSelf === conversation.isSelf
//                 }
//                 onClick={() => handleSelectConversation(conversation)}
//               />
//             ))}
//         </div>
//       </aside>

//       <section
//         className={`${
//           showChat ? "flex" : "hidden"
//         } min-h-0 min-w-0 flex-col lg:flex`}
//       >
//         {selectedUser ? (
//           <>
//             <div className="flex shrink-0 items-center justify-between border-b border-gray-200 p-4">
//               <div className="flex items-center gap-3">
//                 <button
//                   type="button"
//                   aria-label="Back to conversations"
//                   onClick={handleBackToList}
//                   className="shrink-0 text-gray-600 lg:hidden"
//                 >
//                   <FiArrowLeft size={22} />
//                 </button>

//                 <img
//                   src={selectedUser.profilePic || profile}
//                   alt="User"
//                   className="size-11 rounded-full object-cover"
//                 />

//                 <div>
//                   <h3 className="font-medium text-gray-800">
//                     {selectedUser.name}
//                   </h3>
//                 </div>
//               </div>

//               <div className="flex gap-4 text-gray-600">
//                 <button type="button" aria-label="Call">
//                   <FiPhone size={20} />
//                 </button>
//                 <button type="button" aria-label="Video call">
//                   <FiVideo size={20} />
//                 </button>
//               </div>
//             </div>

//             <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4">
//               {loadingMessages && messages.length === 0 && (
//                 <p className="text-center text-sm text-gray-500">
//                   Loading messages...
//                 </p>
//               )}

//               {!loadingMessages && messages.length === 0 && (
//                 <p className="text-center text-sm text-gray-500">
//                   {selectedUser.isSelf
//                     ? "No notes yet. Message yourself to save notes!"
//                     : "No messages yet. Start a conversation!"}
//                 </p>
//               )}

//               {messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`flex flex-col ${
//                     msg.sender === "me" ? "items-end" : "items-start"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-[85%] wrap-break-word rounded-2xl px-4 py-3 ${
//                       msg.sender === "me"
//                         ? "bg-orange-500 text-white"
//                         : "bg-gray-100 text-gray-800"
//                     }`}
//                   >
//                     <p className="text-sm">{msg.text}</p>
//                   </div>

//                   <span className="mt-1 text-xs text-gray-500">
//                     {msg.time}
//                   </span>
//                 </div>
//               ))}

//               <div ref={messagesEndRef} />
//             </div>

//             <form
//               onSubmit={handleSendMessage}
//               className="flex shrink-0 gap-2 border-t border-gray-200 bg-white p-3 md:p-4"
//             >
//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type a message..."
//                 className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-orange-500"
//               />

//               <button
//                 type="submit"
//                 aria-label="Send message"
//                 disabled={!message.trim() || sending}
//                 className="flex shrink-0 items-center justify-center rounded-lg bg-orange-500 p-3 text-white hover:bg-orange-600 disabled:opacity-50"
//               >
//                 <FiSend size={20} />
//               </button>
//             </form>
//           </>
//         ) : (
//           <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
//             {loadingUsers
//               ? "Loading users..."
//               : "Select a user to start chatting."}
//           </div>
//         )}
//       </section>
//     </main>
//   );
// };

// export default Messages;

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import MessageCard from "./MessageCard";
import { FiPhone, FiVideo, FiSend, FiArrowLeft } from "react-icons/fi";
import profile from "../assets/avtar.avif";
import { IoIosSearch } from "react-icons/io";

import {
  getConversation,
  sendChatMessage,
  getAllUsers,
} from "../services/api/messageApi";

const formatTime = (value) =>
  value
    ? new Date(value).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allMessages, setAllMessages] = useState({});
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  // Mobile/tablet: false = conversation list, true = open chat (WhatsApp jaisa)
  const [showChat, setShowChat] = useState(false);

  const messagesEndRef = useRef(null);
  const mainRef = useRef(null);
  // Phone/tablet par chat ka fixed area: { top, bottom } (navbar aur bottom bar ke beech)
  const [mainInsets, setMainInsets] = useState(null);

  const messages = selectedUser ? allMessages[selectedUser.id] || [] : [];

  const updatedConversations = conversations.map((conversation) => {
    const userMessages = allMessages[conversation.id] || [];
    const lastMessage = userMessages[userMessages.length - 1];

    return {
      ...conversation,
      lastMessage: lastMessage ? lastMessage.text : conversation.lastMessage,
      time: lastMessage ? lastMessage.time : conversation.time,
    };
  });

  // Phone/tablet par chat ko screen par FIXED rakho: upar navbar ke neeche se
  // neeche bottom bar ke upar tak. Isse header aur input kabhi scroll nahi hote,
  // sirf messages scroll hote hain (WhatsApp jaisa).
  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;

    const TOP_FALLBACK = 90;
    const BOTTOM_FALLBACK = 74;

    // Screen ke kisi point par jo fixed/sticky bar hai usko dhundo
    const findBar = (x, y) => {
      const main = mainRef.current;
      if (main) main.style.pointerEvents = "none";

      let node = document.elementFromPoint(x, y);

      if (main) main.style.pointerEvents = "";

      while (node && node !== document.body && node !== html) {
        const position = getComputedStyle(node).position;
        if (position === "fixed" || position === "sticky") {
          return node.getBoundingClientRect();
        }
        node = node.parentElement;
      }

      return null;
    };

    const measure = () => {
      // Desktop: normal CSS layout
      if (window.innerWidth >= 1024) {
        setMainInsets(null);
        return;
      }

      window.scrollTo(0, 0);

      const topRect = findBar(window.innerWidth / 2, 2);
      const bottomRect = findBar(
        window.innerWidth / 2,
        window.innerHeight - 2
      );

      const top = topRect ? Math.max(topRect.bottom, 0) : TOP_FALLBACK;
      const bottom = bottomRect
        ? Math.max(window.innerHeight - bottomRect.top, 0)
        : BOTTOM_FALLBACK;

      setMainInsets({ top, bottom });
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);

    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  // Users fetch karo + alag se self-chat entry add karo
  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);

        const response = await getAllUsers();
        const users = response.data;

        if (!Array.isArray(users)) {
          throw new Error("Invalid users API response");
        }

        if (cancelled) return;

        // Duplicate ids hatao
        const uniqueUsers = Array.from(
          new Map(users.map((item) => [Number(item.id), item])).values()
        );

        // Backend khud batata hai ki logged-in user kaun hai (isMe),
        // localStorage ki id par depend nahi karna
        const isMe = (item) => Boolean(Number(item.isMe));

        const myRecord = uniqueUsers.find(isMe) || null;

        const formattedUsers = uniqueUsers
          .filter((item) => !isMe(item))
          .map((item) => ({
            id: Number(item.id),
            name: item.name || "Unknown user",
            profilePic: item.profilePic || null,
            lastMessage: item.lastMessage || "",
            time: formatTime(item.lastMessageTime),
            isSelf: false,
          }));

        const selfConversation = myRecord
          ? {
              id: Number(myRecord.id),
              name: `${myRecord.name || "You"} (You)`,
              profilePic: myRecord.profilePic || null,
              lastMessage: myRecord.lastMessage || "My Notes",
              time: formatTime(myRecord.lastMessageTime),
              isSelf: true,
            }
          : null;

        const allConversations = [
          ...(selfConversation ? [selfConversation] : []),
          ...formattedUsers,
        ];

        setConversations(allConversations);

        // WhatsApp jaisa: Messages kholne par koi chat open nahi hoti.
        // Sirf "Message Driver" jaise button ne jo chat maangi ho wahi ek baar khulti hai.
        const requestedChatId = localStorage.getItem("selectedChatId");
        localStorage.removeItem("selectedChatId");

        const userToSelect = requestedChatId
          ? allConversations.find(
              (item) => String(item.id) === requestedChatId
            ) || null
          : null;

        setSelectedUser(userToSelect);

        if (userToSelect) setShowChat(true);
      } catch (error) {
        console.error("Users fetch failed:", error);
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    };

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  // Messages fetch honge (self-chat "My Notes" ke liye bhi)
  useEffect(() => {
    if (!selectedUser) return;

    let cancelled = false;

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);

        const response = await getConversation(selectedUser.id);
        const fetchedMessages = response.data;

        if (!Array.isArray(fetchedMessages)) {
          throw new Error("Invalid conversation API response");
        }

        if (cancelled) return;

        setAllMessages((prev) => ({
          ...prev,
          [selectedUser.id]: fetchedMessages.map((msg) => ({
            id: msg.id,
            text: msg.message,
            time: formatTime(msg.created_at),
            sender: selectedUser.isSelf
              ? "me"
              : Number(msg.sender_id) === Number(selectedUser.id)
              ? "other"
              : "me",
          })),
        }));
      } catch (error) {
        if (!cancelled) {
          console.error("Messages fetch failed:", error);
        }
      } finally {
        if (!cancelled) setLoadingMessages(false);
      }
    };

    fetchMessages();

    return () => {
      cancelled = true;
    };
  }, [selectedUser?.id, selectedUser?.isSelf]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, selectedUser?.id, showChat]);

  const handleSelectConversation = (conversation) => {
    setSelectedUser(conversation);
    setMessage("");
    setShowChat(true);
  };

  const handleBackToList = () => {
    setShowChat(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const text = message.trim();

    if (!text || !selectedUser || sending) {
      return;
    }

    try {
      setSending(true);

      const response = await sendChatMessage(selectedUser.id, text);
      const sentMessage = response.data;

      if (!sentMessage) {
        throw new Error("Invalid send-message API response");
      }

      const newMessage = {
        id: sentMessage.id,
        text: sentMessage.message,
        time: sentMessage.created_at
          ? formatTime(sentMessage.created_at)
          : formatTime(new Date()),
        sender: "me",
      };

      setAllMessages((prev) => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage],
      }));

      setMessage("");
    } catch (error) {
      console.error("Message send failed:", error);
      alert(
        error.response?.data?.message ||
          "Message send failed. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <main
      ref={mainRef}
      style={
        mainInsets
          ? {
              position: "fixed",
              top: `${mainInsets.top}px`,
              bottom: `${mainInsets.bottom}px`,
              left: 0,
              right: 0,
            }
          : undefined
      }
      className="grid min-h-0 grid-cols-1 overflow-hidden bg-white lg:h-[calc(100dvh-72px)] lg:grid-cols-[300px_minmax(0,1fr)]"
    >
      <aside
        className={`${
          showChat ? "hidden" : "flex"
        } min-h-0 flex-col border-r border-gray-200 lg:flex`}
      >
        <div className="shrink-0 p-5">
          <h2 className="text-2xl font-bold text-gray-800">Messages</h2>

          <div className="relative mt-4">
            <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Conversations..."
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {loadingUsers && (
            <p className="p-4 text-sm text-gray-500">Loading users...</p>
          )}

          {!loadingUsers && conversations.length === 0 && (
            <p className="p-4 text-sm text-gray-500">No users found.</p>
          )}

          {updatedConversations
            .filter((conversation) =>
              conversation.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase().trim())
            )
            .map((conversation) => (
              <MessageCard
                key={`${conversation.isSelf ? "self" : "user"}-${conversation.id}`}
                name={conversation.name}
                profilePic={conversation.profilePic}
                lastMessage={conversation.lastMessage}
                time={conversation.time}
                isActive={
                  selectedUser?.id === conversation.id &&
                  selectedUser?.isSelf === conversation.isSelf
                }
                onClick={() => handleSelectConversation(conversation)}
              />
            ))}
        </div>
      </aside>

      <section
        className={`${
          showChat ? "flex" : "hidden"
        } min-h-0 min-w-0 flex-col lg:flex`}
      >
        {selectedUser ? (
          <>
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Back to conversations"
                  onClick={handleBackToList}
                  className="shrink-0 text-gray-600 lg:hidden"
                >
                  <FiArrowLeft size={22} />
                </button>

                <img
                  src={selectedUser.profilePic || profile}
                  alt="User"
                  className="size-11 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-medium text-gray-800">
                    {selectedUser.name}
                  </h3>
                </div>
              </div>

              <div className="flex gap-4 text-gray-600">
                <button type="button" aria-label="Call">
                  <FiPhone size={20} />
                </button>
                <button type="button" aria-label="Video call">
                  <FiVideo size={20} />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4">
              {loadingMessages && messages.length === 0 && (
                <p className="text-center text-sm text-gray-500">
                  Loading messages...
                </p>
              )}

              {!loadingMessages && messages.length === 0 && (
                <p className="text-center text-sm text-gray-500">
                  {selectedUser.isSelf
                    ? "No notes yet. Message yourself to save notes!"
                    : "No messages yet. Start a conversation!"}
                </p>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "me" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] wrap-break-word rounded-2xl px-4 py-3 ${
                      msg.sender === "me"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>

                  <span className="mt-1 text-xs text-gray-500">
                    {msg.time}
                  </span>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="flex shrink-0 gap-2 border-t border-gray-200 bg-white p-3 md:p-4"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-orange-500"
              />

              <button
                type="submit"
                aria-label="Send message"
                disabled={!message.trim() || sending}
                className="flex shrink-0 items-center justify-center rounded-lg bg-orange-500 p-3 text-white hover:bg-orange-600 disabled:opacity-50"
              >
                <FiSend size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
            {loadingUsers
              ? "Loading users..."
              : "Select a user to start chatting."}
          </div>
        )}
      </section>
    </main>
  );
};

export default Messages;