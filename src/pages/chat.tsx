import React, { useState, useEffect,useRef } from 'react';
import i18n from "../../i18n";
import { useTranslation } from "react-i18next";
import axios from 'axios';
import io from 'socket.io-client';
import { useRouter } from 'next/router';
import SideBarMenu from "@/components/SideBarMenu"
import './Chat.css';
import { FaPhone, FaVideo, FaEllipsisV, FaPhoneAlt } from 'react-icons/fa';
import Headeruser from '@/components/Headeruser';
import Layoutuser from "../app/layoutuser";
import { IoCloseCircleOutline, IoEllipsisHorizontalOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { format, differenceInDays } from 'date-fns';
import Modal1 from '@/components/modal/index1';
import Modal2 from '@/components/modal/index2';
import { Modal } from 'antd';

const socket = io('https://legality-back-production.up.railway.app');

interface Message {
  id: number;
  conversationId: number;
  text: string;
  sender: number;
  createdAt: string;
  sent: number;
  images: string[];
}

interface Participant {
  id_user: number;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

interface Conversation {
  conversationId: number;
  messages: Message[];
  participantInfo: Participant;
}

const Chat = () => {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const toggleSearchVisibility = () => {
    setIsSearchVisible(!isSearchVisible);
  };
  const chatContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Scroll to bottom on page load
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  },[]);
  const [user, setUser] = useState<Participant>({
    id_user: 0,
    firstName: '',
    lastName: '',
    avatarUrl: '',
  });
  const handleOptionsClick = (messageId: number) => {
    setActiveMessageId(activeMessageId === messageId ? null : messageId);
  };
  const handleCloseModal = () => {
    setShowModal1(false)
  }
  const handleCloseModal1 = () => {
    setInvalidFormat(false)
  }
  const handleConversationOptions = (conversationId: number) =>{
    setActiveConv(!activConv)
    setActiveConvId(activeConvId === conversationId ? null : conversationId);
  }
  const [activeConvId , setActiveConvId]= useState<number | null>(null);
  const [activConv,setActiveConv] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState<number | null>(null);
  const [messages, setMessages] = useState([]);

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Message[]>([]); // Ajoutez l'état searchResults ici
  const [searchText, setSearchText] = useState<string>('');
  const [isHovered, setIsHovered] = useState(0);
  const [isHovered1, setIsHovered1] = useState(0);

  const handleDeleteConversation = async(conversationId) =>{
    try {
      const response = await axios.delete("https://legality-back-production.up.railway.app/messages/deleteConversation", {
        data: {
          id: conversationId,
        },
      });
      if (response.status === 200) {
        fetchConversations()
      } else {
        toast.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Error deleting message");
    }
  };
  const handleDelete = async (messageId) => {
    try {
      const response = await axios.delete("https://legality-back-production.up.railway.app/messages/deleteMessage", {
        data: {
          id: messageId,
        },
      });
      if (response.status === 200) {

        fetchConversations()
      } else {
        toast.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Error deleting message");
    }
  };
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [showModal1, setShowModal1] = useState(false);
  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setShowModal1(true); // Assuming this toggles the showModal state
  };
  const handleSearch = async () => {
    try {
      const response = await axios.post('https://legality-back-production.up.railway.app/messages/search-conversations', {
        userId: user.id_user,
        query: searchQuery,
      });
      if (response.data.success) {
        const searchedConversations = response.data.conversations;
        setConversations(searchedConversations); // Mettre à jour les conversations recherchées

        // Écouter les nouveaux messages pour les conversations recherchées
        searchedConversations.forEach(conversation => {
          socket.on(`new_message_${conversation.conversationId}`, (message: Message) => {
            setConversations(prevConversations => {
              const updatedConversations = prevConversations.map(conv => {
                if (conv.conversationId === message.conversationId) {
                  return {
                    ...conv,
                    messages: [...conv.messages, message],
                  };
                }
                return conv;
              });
              return updatedConversations;
            });
          });
        });
      } else {
        throw new Error('Failed to search conversations');
      }
    } catch (error) {
      console.error('Error searching conversations:', error);
    }
  };
  const handleRemoveFile = ()=>{
    setNewMessage('')
    setIsInputDisapled(false)
    setImageFiles([])
  }
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('https://legality-back-production.up.railway.app/users/profile', { withCredentials: true });
        setUser(response.data.user);
      } catch (error) {
        router.push('/signin');
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    fetchConversations();
    socket.on('new_message', (message: Message) => {
      setConversations(prevConversations => {
        const updatedConversations = prevConversations.map(conv => {
          if (conv.conversationId === message.conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, message],
            };
          }
          return conv;
        });
        return updatedConversations;
      });
    });

    return () => {
      socket.off('new_message');
    };
  }, [user]);
 const [invalidFormat,setInvalidFormat] = useState(false);

  const fetchConversations = async () => {
    try {
      const response = await fetch('https://legality-back-production.up.railway.app/messages/get-all-conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id_user,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations);
        // Sélectionner automatiquement la dernière conversation
        if (data.conversations.length > 0) {
          setSelectedConversation(data.conversations[data.conversations.length - 1].conversationId);
        }
      } else {
        throw new Error('Failed to fetch conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const [imageFiles, setImageFiles] = useState([]);
  // Change cloudinary name in prod !
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dmwttu9lu/upload";
  const handleFileChange = async (e) => {
    const validExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'jpg', 'jpeg', 'png', 'gif'];
    const files = e.target.files;

    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const invalidFile = fileArray.some(file => !validExtensions.includes(file.name.split('.').pop().toLowerCase()));

      if (invalidFile) {
        setInvalidFormat(true);
        setNewMessage('');
        setImageFiles([]);
      } else {
        try {
          const fileUrls = await Promise.all(
            fileArray.map(async (file) => {
              const formData = new FormData();
              formData.append("file", file);
              formData.append("upload_preset", "ml_default");

              const response = await fetch(CLOUDINARY_URL, {
                method: "POST",
                body: formData,
              });

              if (response.ok) {
                const responseData = await response.json();
                console.log(responseData.secure_url, "responseData.secure_url");
                return responseData.secure_url;
              } else {
                throw new Error("Failed to upload image to Cloudinary");
              }
            })
          );

          setImageFiles(fileUrls);
          setNewMessage(fileArray[0].name);
          setIsInputDisapled(true);
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      setImageFiles([]);
    }
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = differenceInDays(now, date);
  
    if (diffDays === 0) {
      return formatDate(dateString);
    } else if (diffDays === 1) {
      return i18n.language === 'fr' ? 'Envoyé il y a 1 jour' : 'Sent 1 day ago';
    } else {
      return i18n.language === 'fr' 
        ? `Envoyé il y a ${diffDays} jours` 
        : `Sent ${diffDays} days ago`;
    }
  };
  const sendMessage = async (conversationId: number,images: string[],newMessage : string) => {
    try {
      const conversation = conversations.find(conv => conv.conversationId === conversationId);
      if (!conversation) {
        console.error('Conversation not found');
        return;
      }

      const response = await fetch('https://legality-back-production.up.railway.app/messages/create-new-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: conversationId,
          text: newMessage,
          sender: user.id_user,
          participant2_id: conversation.participantInfo.id_user,
          images: images,
        }),
      });
    
      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      socket.emit('new_message', data.message);
      await fetchConversations()
      setImageFiles([]);
      setNewMessage('');
      setIsInputDisapled(false);
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  const isButtonDisabled = !newMessage.trim() && imageFiles.length === 0;
  const [isInputDisapled , setIsInputDisapled] =  useState(false);
  const handleConversationClick = (conversationId: number) => {
    setSelectedConversation(conversationId);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (value === '') {
      fetchConversations();

    } else {
      handleSearch();
    }
  };

  const handleSearchMessage = async () => {
    try {
      const response = await axios.post('https://legality-back-production.up.railway.app/messages/searchMessageInConversation', {
        conversationId: selectedConversation,
        searchText: searchText,
      });
      if (response.data.success) {
        // Mettre à jour les résultats de la recherche
        setSearchResults(response.data.messages);
      } else {
        throw new Error('Failed to search messages in conversation');
      }
    } catch (error) {
      console.error('Error searching messages in conversation:', error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchMessage();
    }
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <>
      <div className="flex bg-[#f8f8f8] font-serif">
      <link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
/>
        <Headeruser user = {user} />
        <div className="mx-auto w-2/3 h-full mb-16 ">
          <SideBarMenu />
          <div className="chat-container ">
          <div className="chat-sidebar mt-16" style={{ marginLeft: '34px' }}>
          <div className="search-container ">
                <input
                  type="text"
                  placeholder={i18n.language==='fr'? 'Rechercher contact' : 'Search contact'}  
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="conversations-list overflow-y-auto bg-[#f8f8f8]"> 
              {conversations.length === 0? (
  <div className="text-center py-5">
    <h2 className="text-lg font-semibold text-gray-700">{mounted ? t('common.noFriends') : 'Loading...'}</h2>
    <p className="m-4 text-sm text-gray-600">{mounted ? t('common.addFriends') : 'Loading...'}</p>
  </div>
) : (
  conversations.map((conversation) => (
    <div
    onMouseEnter={() => setIsHovered(conversation.conversationId)} onMouseLeave={() => setIsHovered(0)}
      key={conversation.conversationId}
      className="conversation-preview flex items-center p-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => handleConversationClick(conversation.conversationId)}
    > 
   <div >
    {isHovered === conversation.conversationId && (
 <button
 className={`${
   isHovered? 'block' : 'hidden'
 } text-gray-500 hover:text-blue-500`}
 onClick={() => {
   handleConversationOptions(conversation.conversationId);
 }}
>
 <IoEllipsisHorizontalOutline className="mr-2" />
</button>
    )}
 
</div>
     
      {activConv && activeConvId === conversation.conversationId && (
        <button
          className="text-gray-500 hover:text-red-500"
          onClick={() => {
            if (window.confirm("Are you sure you want to remove this friend?")) {
              handleDeleteConversation(conversation.conversationId);
            }
          }}
        >
          <IoCloseCircleOutline className="mr-2" />
        </button>
      )}

      <div className="conversation-avatar mr-2">
        <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
          {conversation.participantInfo.avatarUrl? (
            <img
              src={conversation.participantInfo.avatarUrl}
              alt={`Avatar`}
              className="h-full w-full rounded-full"
            />
          ) : (
            <span className="text-lg text-gray-600">
              {conversation.participantInfo.firstName.charAt(0)}
            </span>
          )}
        </div>
      </div>

      <div className="conversation-info">
        <div className="conversation-name font-bold">
          {conversation.participantInfo.firstName}{" "}
          {conversation.participantInfo.lastName}
        </div>
     
      </div>
    </div>
  ))
)}
              </div>
            </div>
            <div className="chat-main flex-1 mt-16 p-4 " >
              {selectedConversation !== null &&
                conversations
                  .filter(
                    (conversation) =>
                      conversation.conversationId === selectedConversation
                  )
                  .map((conversation) => (
                    <div
                      key={conversation.conversationId}
                      className="conversation flex flex-col h-full"
                    >
                   
                      <div className="conversation-header bg-gray-100 p-4 flex items-center justify-between">
                        <div className="conversation-header-info flex items-center">
                          <div className="conversation-avatar mr-2">
                          <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">

                          {conversation.participantInfo.avatarUrl ? ( 
                        <img
                          src={conversation.participantInfo.avatarUrl}
                          alt={` Avatar`}
                          className="h-full w-full rounded-full"
                        />
                      ) : (
                        <span className="text-lg text-gray-600">
                          {conversation.participantInfo.firstName.charAt(0)}
                        </span>
                      )}
                      </div>
                          </div>
                          <div>
                            <div className="conversation-name font-bold">
                              {conversation.participantInfo.firstName}{" "}
                              {conversation.participantInfo.lastName}
                            </div>
                          
                          </div>
                        </div>

                      </div>
                      <div className="message-container flex-1 overflow-y-auto p-4 "  ref={chatContainerRef}>
            
                        {conversation.messages.map((message)=> {
                          console.log(message)
                          return(
                            <div
                            onMouseEnter={() => setIsHovered1(message.id)}  // Use message.id to uniquely identify each message
                            onMouseLeave={() => setIsHovered1(0)}                     
                                    key={message.id}
                            className={`message ${message.sender === user.id_user
                                ? "message-sent"
                                : "message-received"
                              } ${message.sent ? "message-sent" : ""}`}
                          >
                            <div>
                              { message.sender == user.id_user && isHovered1 === message.id && ( 
                                
  <button
  className={`${
    isHovered1? '' : 'hidden'
  } text-gray-500 hover:text-blue-500 `}
onClick={() => {handleOptionsClick(message.id) 
  }}
 >
 <IoEllipsisHorizontalOutline className="mr-2" />

  </button>     
                              )}                         
         {activeMessageId === message.id && message.sender == user.id_user && (
        <button
          className=" text-gray-500 hover:text-red-500"
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this message?")) {
              handleDelete(message.id);
            }
          }}
        >
          <IoCloseCircleOutline className="mr-2" />
        </button>
      )}
                              <span
                                style={{
                                  backgroundColor: 
                                  message.images?.includes('https://res.cloudinary.com/dmwttu9lu') ? "transparent" :
                                  message.sent
                                    ? "#3498db"
                                    : "#fff",
                                  color: message.sent ? "#fff" : "",
                                  display: "inline-block",
                                  padding:'10px',
                                  borderRadius: "10px",
                                  textAlign: message.sent
                                    ? "right"
                                    : "left",
                                }}
                              >
                                <div>
                           
              
             
                                {message.images?.includes('https://res.cloudinary.com/dmwttu9lu') ? (
  (() => {
    const fileExtension = message.images.split('.').pop().toLowerCase();
    const fileName = message.images.substring(
      message.images.lastIndexOf('/') + 1,
      message.images.lastIndexOf('.' + fileExtension)
    );

    const renderFileIcon = (src, alt, fileNameWithExtension) => (
      <a href={message.images} target="_blank" rel="noopener noreferrer">
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: "10%",
            height: "auto",
            marginRight: "30px",
            display: "inline-block",
          }}
          className="h-full w-full rounded-md object-cover cursor-pointer"
        />
        <div style={{ color: 'black', fontSize: '12px' }}>
          {fileNameWithExtension}
        </div>
      </a>
    );

    switch (fileExtension) {
      case 'pdf':
        return renderFileIcon('/pdf.png', `PDF file ${message.id}`, `${fileName}.pdf`);
      case 'doc':
      case 'docx':
        return renderFileIcon('/doc.png', `Word file ${message.id}`, `${fileName}.${fileExtension}`);
      case 'xls':
      case 'xlsx':
        return renderFileIcon('/xls.png', `Excel file ${message.id}`, `${fileName}.${fileExtension}`);
      case 'txt':
        return renderFileIcon('/txt.png', `Text file ${message.id}`, `${fileName}.txt`);
      default:
        return (
          <img
            src={message.images}
            alt={`Message image ${message.id}`}
            style={{
              maxWidth: "50%",
              height: "auto",
              borderRadius: "10px",
              marginRight: "-10px",
              display: "inline-block",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Example shadow
            }}
            className="h-full w-full rounded-md object-cover cursor-pointer"
            onClick={() => handleImageClick(message.images)}
          />
        );
    }
  })()
) : (
  <span>
    {message.text}
  </span>
)}
                               
                                
                                </div>
                        
                              </span>
               
                            </div>
                            <div className="message-time text-sm text-gray-500 mt-1">
                            {getRelativeTime(message.createdAt)}
                            </div>
                          </div>
                          )
                        })}
                      </div>
                      <form 
                      onSubmit={(e)=> {
                        e.preventDefault()
                      }}
                      className="message-input-container mt-4 flex items-center">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder={t('common.typeMessage')} 
                          className="flex-1 p-2 border rounded mr-2 focus:border-primary"
                          disabled={isInputDisapled}

                        />
 {isInputDisapled && (
  <button
  onClick={handleRemoveFile}
  style={{
    border: 'none',
    background: 'transparent',
    fontSize: '12px',
    cursor: 'pointer',
    padding: '2px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    color: 'red',
  }}
>

  X
</button>
 )}                       

  <label htmlFor="file-input" className="attachment-button">
  <input
    id="file-input"
    type="file"
    // accept=".jpg,.jpeg,.png"
    onChange={(e) => handleFileChange(e)}
    className="hidden"
    multiple
   
  />
  <span className="attachment-icon"  style = {{cursor: 'pointer',
    }}>📎</span>
</label>
  <button
    onClick={() =>{ sendMessage(conversation.conversationId, imageFiles, newMessage)
    }}
    className="p-2 bg-blue-500 text-white rounded"
    disabled={isButtonDisabled}
  >
    {t('common.send')} 
  </button>
                      </form>
                    </div>
                  ))}
                    <Modal  open={showModal1}
            onCancel={handleCloseModal}
            footer={null}
              width={500} >
               <img src={selectedImageUrl} alt="Selected Project Image" className="w-full h-auto rounded-md object-contain pt-6"  />
                  </Modal>
                  <Modal  open={invalidFormat}
            onCancel={handleCloseModal1}
            footer={null}
            centered
              width={500} >
                  <p>
                  {t('common.invalidFormat')} </p>
                  </Modal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
