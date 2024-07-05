import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import axios from "axios";

const ENDPOINT = "http://localhost:4000/";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

interface User {
  id_user: string;
  firstName_user: string;
  lastName_user: string;
  avatar?: {
    url: string;
  };
}

const DashboardMessages = () => {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);
  const [arrivalMessage, setArrivalMessage] = useState<any | null>(null);
  const [currentChat, setCurrentChat] = useState<any | null>();
  const [messages, setMessages] = useState<any[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [images, setImages] = useState<string | ArrayBuffer | null>(null);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fonction pour créer une nouvelle conversation
  const createNewConversation = async (groupTitle: string, userId: string, otherUserId: string) => {
    try {
      const response = await axios.post("https://legality-back-production.up.railway.app/conversation/create-new-conversation", {
        groupTitle,
        userId,
        otherUserId
      });
      // Gérer la réponse et mettre à jour l'état de la conversation si nécessaire
    } catch (error) {
      console.error(error);
    }
  };

  // Fonction pour obtenir toutes les conversations d'un utilisateur
  const getAllConversations = async (id: string) => {
    try {
      const response = await axios.get(`https://legality-back-production.up.railway.app/conversation/get-all-conversation/${id}`);
      // Gérer la réponse et mettre à jour l'état des conversations
    } catch (error) {
      console.error(error);
    }
  };

  // Fonction pour mettre à jour le dernier message d'une conversation
  const updateLastMessage = async (id: string, lastMessage: string, lastMessageId: string) => {
    try {
      const response = await axios.put(`https://legality-back-production.up.railway.app/conversation/update-last-message/${id}`, {
        lastMessage,
        lastMessageId
      });
      // Gérer la réponse et mettre à jour l'état de la conversation si nécessaire
    } catch (error) {
      console.error(error);
    }
  };

  // Fonction pour envoyer un nouveau message
  const sendMessage = async (conversationId: string, text: string, sender: string) => {
    try {
      const response = await axios.post("https://legality-back-production.up.railway.app/conversation/message/create-new-message", {
        conversationId,
        text,
        sender
      });
      // Gérer la réponse et mettre à jour l'état des messages si nécessaire
    } catch (error) {
      console.error(error);
    }
  };

  // Fonction pour obtenir tous les messages d'une conversation
  const getAllMessages = async (id: string) => {
    try {
      const response = await axios.get(`https://legality-back-production.up.railway.app/conversation/message/get-all-messages/${id}`);
      // Gérer la réponse et mettre à jour l'état des messages
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("https://legality-back-production.up.railway.app/users/profile", { withCredentials: true });
        setUserProfile(response.data.user);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userData]);

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        if (user) {
          const response = await axios.get(
            `https://legality-back-production.up.railway.app/conversation/get-all-conversation-user/${user.id_user}`,
            {
              withCredentials: true,
            }
          );
          setConversations(response.data.conversations);
        }
      } catch (error) {
        console.log(error);
      }
    };
    
    getConversation();
  }, [user, messages]);

  useEffect(() => {
    if (user) {
      const userId = user.id_user;
      socketId.emit("addUser", userId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [user]);

  const onlineCheck = (chat: any) => {
    const chatMembers = chat.members.find((member: string) => member !== user?.id_user);
    const online = onlineUsers.find((user) => user.id_user === chatMembers);
    return online ? true : false;
  };

  useEffect(() => {
    const getMessage = async () => {
      try {
        if (currentChat && currentChat.id_user) {
          const response = await axios.get(
            `https://legality-back-production.up.railway.app/conversation/message/get-all-messages/${currentChat.id_user}`
          );
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);
  

  const sendMessageHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = {
      sender: user?.id_user,
      text: newMessage,
      conversationId: currentChat?.id_user,
    };

    const receiverId = currentChat?.members.find(
      (member: string) => member !== user?.id_user
    );

    socketId.emit("sendMessage", {
      senderId: user?.id_user,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== "") {
        const res = await axios.post(
          `https://legality-back-production.up.railway.app/conversation/message/create-new-message`,
          message
        );
        setMessages([...messages, res.data.message]);
        updateLastMessage();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessageForImage = async () => {
    try {
      await axios.put(
        `https://legality-back-production.up.railway.app/conversation/update-last-message/${currentChat?.id_user}`,
        {
          lastMessage: newMessage,
          lastMessageId: user?.id_user,
        }
      );
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImages(reader.result);
        imageSendingHandler(reader.result);
      }
    };
    if (e.target.files) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const imageSendingHandler = async (e: string | ArrayBuffer | null) => {
    const receiverId = currentChat?.members.find(
      (member: string) => member !== user?.id_user
    );

    socketId.emit("sendMessage", {
      senderId: user?.id_user,
      receiverId,
      images: e,
    });

    try {
      const res = await axios.post(
        `https://legality-back-production.up.railway.app/message/create-new-message`,
        {
          images: e,
          sender: user?.id_user,
          text: newMessage,
          conversationId: currentChat?.id_user,
        }
      );
      setImages(null);
      setMessages([...messages, res.data.message]);
      updateLastMessageForImage();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClick = (id: string) => {
    router.push(`/dashboard-messages?${id}`);
    setOpen(true);
  };

  const [active, setActive] = useState<number>(0);

  return (
    <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded">
      {!open && (
        <>
          <h1 className="text-center text-[30px] py-3 font-Poppins">All Messages</h1>
          {conversations &&
            conversations.map((item, index) => (
              <MessageList
                data={item}
                key={index}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                user={user}
                setUserData={setUserData}
                userData={userData}
                online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
                isLoading={isLoading}
                handleClick={handleClick}
                setActive={setActive}
                active={active}
              />
            ))}
        </>
      )}

      {open && (
        <UserInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          userId={user?.id_user}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          setMessages={setMessages}
          handleImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
};

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  user,
  setUserData,
  online,
  setActiveStatus,
  isLoading,
  handleClick,
  setActive,
  active,
}: {
  data: any;
  index: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentChat: React.Dispatch<React.SetStateAction<any>>;
  user: User | null;
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
  online: boolean;
  setActiveStatus: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  handleClick: (id: string) => void;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  active: number;
}) => {
  const [otherUser, setOtherUser] = useState<User | null>(null);

  useEffect(() => {
    const otherUserId = data.members.find((member: string) => member !== user?.id_user);

    const getUser = async () => {
      try {
        const res = await axios.get(`https://legality-back-production.up.railway.app/user/user-info/${otherUserId}`);
        setOtherUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [user, data]);

  return (
    <div
      className={`w-full flex p-3 px-3 ${
        active === index ? "bg-[#00000010]" : "bg-transparent"
      }  cursor-pointer`}
      onClick={() => setActive(index) || handleClick(data.id_user) || setCurrentChat(data) || setUserData(otherUser) || setActiveStatus(online)}
    >
      <div className="relative">
        <img
          src={`${otherUser?.avatar?.url}`}
          alt=""
          className="w-[50px] h-[50px] rounded-full"
        />
        {online ? (
          <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" />
        ) : (
          <div className="w-[12px] h-[12px] bg-[#c7b9b9] rounded-full absolute top-[2px] right-[2px]" />
        )}
      </div>
      <div className="pl-3">
        <h1 className="text-[18px]">{otherUser?.firstName_user} {otherUser?.lastName_user}</h1>
        <p className="text-[16px] text-[#000c]">
          {!isLoading && data?.lastMessageId !== otherUser?.id_user
            ? "You:"
            : `${otherUser?.firstName_user}:`}{" "}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};

const UserInbox = ({
  scrollRef,
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  userId,
  userData,
  activeStatus,
  handleImageUpload,
}: {
  scrollRef: React.RefObject<HTMLDivElement>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessageHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  messages: any[];
  userId: string | null;
  userData: User | null;
  activeStatus: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="w-full min-h-full flex flex-col justify-between">
      <div className="w-full flex p-3 items-center justify-between bg-slate-200">
        <div className="flex">
          <img
            src={`${userData?.avatar?.url}`}
            alt=""
            className="w-[60px] h-[60px] rounded-full"
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]">{userData?.firstName_user} {userData?.lastName_user}</h1>
            <h1>{activeStatus ? "Active Now" : ""}</h1>
          </div>
        </div>
        <AiOutlineArrowRight
          size={20}
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>

      <div className="px-3 h-[65vh] py-3 overflow-y-scroll">
        {messages &&
          messages.map((item, index) => {
            return (
              <div
                className={`flex w-full my-2 ${
                  item.sender === userId ? "justify-end" : "justify-start"
                }`}
                ref={scrollRef}
                key={index}
              >
                {item.sender !== userId && (
                  <img
                    src={`${userData?.avatar?.url}`}
                    className="w-[40px] h-[40px] rounded-full mr-3"
                    alt=""
                  />
                )}
                {item.images && (
                  <img
                    src={`${item.images.url}`}
                    className="w-[300px] h-[300px] object-cover rounded-[10px] mr-2"
                    alt=""
                  />
                )}
                {item.text !== "" && (
                  <div>
                    <div
                      className={`w-max p-2 rounded ${
                        item.sender === userId ? "bg-[#000]" : "bg-[#38c776]"
                      } text-[#fff] h-min`}
                    >
                      <p>{item.text}</p>
                    </div>

                    <p className="text-[12px] text-[#000000d3] pt-1">
                      {format(item.createdAt)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      <form
        aria-required={true}
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
        <div className="w-[30px]">
          <input
            type="file"
            name=""
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <TfiGallery className="cursor-pointer" size={20} />
          </label>
        </div>
        <div className="w-full">
          <input
            type="text"
            required
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="border-b-2 border-gray-300 w-full py-1 focus:outline-none focus:border-blue-400"
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend
              size={20}
              className="absolute right-4 top-5 cursor-pointer"
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default DashboardMessages;
