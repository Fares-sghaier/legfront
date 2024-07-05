import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { CSSProperties } from 'react';
import io from 'socket.io-client';
import { RiSendPlaneFill } from 'react-icons/ri';
import '../../Chat.css'; // Import the CSS file

const socket = io('https://legality-back-production.up.railway.app');

interface User {
  id_user: string;
  firstName_user: string;
  lastName_user: string;
  avatar_url?: string;
}

interface Friend {
  id: number;
  sending_user_id: string;
  sending_user_firstName: string;
  sending_user_lastName: string;
  sending_user_avatar_url: string;
  invited_user_id: string;
  invited_user_firstName: string;
  invited_user_lastName: string;
  invited_user_avatar_url: string;
  name_project: string;
}

interface UniqueFriend {
  id: number;
  sending_user_id: string;
  sending_user_firstName: string;
  sending_user_lastName: string;
  sending_user_avatar_url: string;
  invited_user_id: string;
  invited_user_firstName: string;
  invited_user_lastName: string;
  invited_user_avatar_url: string;
  name_project: string;
}

interface Message {
  id: number;
  text: string;
  sender: string;
  createdAt: string;
  images:string[];
}

const FriendsList = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [openChatId, setOpenChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();
  const [newMessageText, setNewMessageText] = useState('');
  const [lastMessages, setLastMessages] = useState<Message[]>([]);


  // Fonction pour gérer l'envoi d'un nouveau message
  const handleSendMessage = (friendId: string) => {
    // Vérifiez si le champ de saisie du message est vide
    if (!newMessageText.trim()) {
      return;
    }
    // Appelez la fonction sendMessage pour envoyer le nouveau message
    sendMessage(friendId, newMessageText);
    // Effacez le champ de saisie du message après l'envoi
    setNewMessageText('');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<{ user: User }>(
          "https://legality-back-production.up.railway.app/users/profile",
          { withCredentials: true },
        );
        setUser(response.data.user);
      } catch (error) {
        router.push('/signin');
        console.error(error);
      }
    };

    fetchProfile();
  }, [router]);

  const openChatWindow = (friendId: string) => {
    // Définissez l'ID de l'ami dont vous souhaitez ouvrir la fenêtre de discussion
    setOpenChatId(friendId);
    // Fetch les messages de cette conversation
    fetchMessages(friendId);
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        if (user) {
          const response = await axios.post('https://legality-back-production.up.railway.app/users/friends', { id_user: user.id_user });
          setFriends(response.data.invitations);
          const lastMessagesPromises = response.data.invitations.map(async (friend) => {
            const friendId = user.id_user === friend.sending_user_id ? friend.invited_user_id : friend.sending_user_id;
            const lastMessage = await getLastMessage(user.id_user, friendId);
            return lastMessage;
          });
          const lastMessages = await Promise.all(lastMessagesPromises);
          setLastMessages(lastMessages);

        }
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, [user]);

  const fetchMessages = async (friendId: string) => {
    try {
      const response = await axios.post('https://legality-back-production.up.railway.app/messages/get-messages-by-participants', {
        participant1Id: user?.id_user,
        participant2Id: friendId,
      });
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const startConversation = (friendId: string) => {
    if (openChatId === friendId) {
      setOpenChatId(null);
      setMessages([]);
    } else {
      setOpenChatId(friendId);
      fetchMessages(friendId);
    }
  };

  useEffect(() => {
    // Abonnez-vous à l'événement de nouveau message
    socket.on('new_message', (message: Message) => {
      // Mettez à jour l'état local des messages lorsque de nouveaux messages sont reçus
      setMessages(prevMessages => [...prevMessages, message]);
    });

    // Nettoyez l'abonnement à l'événement lorsque le composant est démonté
    return () => {
      socket.off('new_message');
    };
  }, []);

  // Fonction pour envoyer un nouveau message
  const sendMessage = async (friendId: string, text: string) => {
    try {
      // Envoie la requête pour créer un nouveau message
      const response = await axios.post('https://legality-back-production.up.railway.app/messages/create-new-message', {
        sender: user?.id_user,
        participant2_id: friendId,
        text: text,
      });

      // Si la requête est réussie, émettez un événement via le socket pour informer le serveur du nouveau message
      if (response.data.success) {
        socket.emit('new_message', response.data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getLastMessage = async (userId: string, friendId: string) => {
    try {
      const response = await axios.post('https://legality-back-production.up.railway.app/messages/get-last-message', {
        participant1Id: userId,
        participant2Id: friendId,
      });
      return response.data.lastMessage;
    } catch (error) {
      console.error('Error fetching last message:', error);
      return null;
    }
  };

  const messageBoxStyle: CSSProperties = {
    maxHeight: '200px', // Hauteur maximale de la boîte de messages
    overflowY: 'auto', // Ajoute une barre de défilement vertical lorsque nécessaire
  };
  return (
    <div className='bg-white'>
      <br/>
       <div>
        {friends.map((friend, index) => {
          const isUserSending = user?.id_user === friend.sending_user_id;
          const friendId = isUserSending ? friend.invited_user_id : friend.sending_user_id;
          const displayName = isUserSending
            ? `${friend.invited_user_firstName} ${friend.invited_user_lastName}`
            : `${friend.sending_user_firstName} ${friend.sending_user_lastName}`;
          const displayAvatarUrl = isUserSending ? friend.invited_user_avatar_url : friend.sending_user_avatar_url;
          const lastMessage = lastMessages[index];

          // Affiche l'ID approprié en fonction du rôle de l'utilisateur
          const displayUserId = isUserSending ? friend.invited_user_id : friend.sending_user_id;

          const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
            e.stopPropagation(); // Empêche la propagation de l'événement de clic vers le parent
          };

          return (
            <div key={friend.id} className="card" style={{ marginBottom: '10px'}} onClick={() => startConversation(displayUserId)}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', background: 'white', width:'250px' }}>
                {displayAvatarUrl && (
                  <div style={{ width: '35px', height: '35px', borderRadius: '50%', overflow: 'hidden', marginRight: '10px' }}>
                    <img src={displayAvatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} />
                  </div>
                )}
                <div>
                  <div>{displayName}</div>
                  {lastMessage && (
                    <div className="message text-gray-500">{lastMessage.text}</div>
                  )}
                </div>
                <div style={{ cursor: 'pointer' }}>
                </div>
              </div>
              <hr/>
              {openChatId === friendId && (
                <div className="chat-box" onClick={(e) => e.stopPropagation()} style={{ width:'250px' }}>
                  <div className="messages" style={messageBoxStyle}>
                    {messages.map((message) => (
                      <div key={message.id} className={message.sender === user?.id_user ? 'message-sent' : 'message-received'}>
                        <span className="text-gray-500" style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis'}}>{message.text}</span>
                        <br></br>
                        <small>{new Date(message.createdAt).toLocaleString()}</small>
                      </div>
                    ))}
                  </div>
                  <div >
                    <form 
                     onSubmit={(e)=> {
                      e.preventDefault()
                    }}
                    >
                    <input
                      type="text"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      onClick={handleInputClick} // Gère le clic sur l'input
                      placeholder="Type a message..."
                    />
                    <button            className="option-button flex-shrink-0 py-1 px-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
 onClick={() => handleSendMessage(displayUserId)}>
                                  <RiSendPlaneFill className="text-xl" />


                    </button>
                    </form>
                   
                  </div>
                </div>
              )}
            </div>

          );
        })}
      </div>
    </div>

  );

};

export default FriendsList;
