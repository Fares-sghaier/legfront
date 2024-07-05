import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Layoutuser from "../../../app/layoutuser";
import SideBarMenu from "@/components/SideBarMenu"

import Headeruser from "@/components/Headeruser";
import UpdatePost from '@/components/modal/updatePost'
import { formatDistanceToNow } from "date-fns";
import { fr } from 'date-fns/locale';
import {
  IoThumbsUpOutline,
  IoChatbubbleOutline,
  IoHappyOutline,
  IoRefreshOutline,
  IoHourglassOutline,
  IoSend,
  IoEllipsisHorizontalOutline,
  IoHeartOutline,
  IoChatbox,
  IoChatboxOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { RiSendPlaneFill } from "react-icons/ri";
import ReactEmoji from "react-emoji";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import StoryCard from "../storyCard";
import { FcLike } from "react-icons/fc";
import { GoComment, GoHeart } from "react-icons/go";
import { TbArrowBarToDown, TbArrowBarToUp, TbUsersPlus } from "react-icons/tb";
import { IoAdd } from "react-icons/io5";
import Modal from "@/components/modal";
import PostForm from "@/components/modal/PostForm";
import { FaUserFriends } from "react-icons/fa";
import FriendsList from "../listamis";
import Link from "next/link";
import Modal1 from "@/components/modal/index1";
import i18n from "../../../../i18n";
import { useTranslation } from "react-i18next";
interface User {
  id_user: number;
  firstName_user: string;
  lastName_user: string;
  avatar_url?: string;
  country_user: string;
  occupation_user:string;
  email_user:string;
  phoneNumber_user:string;
}

interface Project {
  id_project: number;
  name_project: string;
  description_project: string;
  createdAt_project: string;
  category: string;
  tags: string[];
  images?: string[];
  firstName_user: string;
  lastName_user: string;
  user_avatar_url?: string;
  user_id_user: number;
  legalField:string;
}

interface Invitation {
  id: number;
  status: string; // Supposons que le statut est une chaîne pour le moment
}


interface ProjectWithComments extends Project {
  comments: ProjectComment[];
  showEmojiMenu: boolean;
  commentInput?: string;
  likes: number;
  hasLiked: boolean;
  commentCount: number;
  invitations: Invitation[]; // Ajout de la propriété invitations
  
}

interface ProjectComment {
  id_project: number;
  id_comment: number;
  id_user: number; // ID de l'utilisateur qui a fait le commentaire
  comment: string;
  firstName_user: string;
  lastName_user: string;
  avatar_url?: string;
  rating: number;
  ratingPercentage?: number;
  created_at:string;

}

const emojis = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😜",
  "😝",
  "😛",
  "🤑",
  "🤗",
  "🤓",
  "😎",
  "🤡",
  "🤠",
  "😏",
];

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectWithComments[]>([]);
  const [showText, setShowText] = useState(true);
  const [showMoreComments, setShowMoreComments] = useState<boolean>(false);
  const [likeCounts, setLikeCounts] = useState({});
  const socket = io("https://legality-back-production.up.railway.app");
  const [searchTerm, setSearchTerm] = useState("");
  const[valueSearch,setValueSearch] = useState("")
  const [showOptions, setShowOptions] = useState(false);
  const [filterBy, setFilterBy] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [currentProject, setCurrentProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation()
  const getLocale = () => {
    switch (i18n.language) {
      case 'fr':
        return fr;
      // Add more cases for other languages you want to support
      default:
        return undefined; // Default to English
    }
  };
  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setShowModal1(true); // Assuming this toggles the showModal state
  };
  const handleUpdatePost = (project) => {
    setActiveProjectId(project.id_project);
    setCurrentProject(project);
    setShowModal2(true);
  };
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const closeModal2 = () => {
    setShowModal2(false);
  };
  const toggleContent = () => {
    setIsContentVisible(!isContentVisible);
  };
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const projectsResponse = await axios.post(
          "https://legality-back-production.up.railway.app/projects/search",
          { name_project: searchTerm },
        );
        if (Array.isArray(projectsResponse.data)) {
          const projectsWithComments: ProjectWithComments[] = await Promise.all(
            projectsResponse.data.map(async (project: Project) => {
              // Fetch comments
              const comments = await fetchCommentsForProject(
                project.id_project,
              );
              // Fetch like count
              const likes = await fetchLikeCountForProject(project.id_project);
              // Fetch comment count
              const commentCount = await fetchCommentCountForProject(
                project.id_project,
              );
              // Check if user has liked the project
              const isLikedResponse = await axios.post(
                "https://legality-back-production.up.railway.app/projects/isLiked",
                {
                  id_project: project.id_project,
                  id_user: user?.id_user,
                },
              );
              return {
                ...project,
                comments,
                showEmojiMenu: false,
                commentInput: "",
                likes,
                hasLiked: isLikedResponse.data.liked,
                commentCount,
                invitations: [],
              };
            }),
          );
          const invitationsResponse = await Promise.all(
            projectsWithComments.map(async (project) => {
              const response = await axios.post(
                "https://legality-back-production.up.railway.app/projects/invitation",
                {
                  id_project: project.id_project,
                  id_user: user?.id_user,
                },
              );
              return {
                projectId: project.id_project,
                invitations: response.data.invitations,
              };
            }),
          );
          const updatedProjectsWithInvitations = projectsWithComments.map(
            (project) => {
              const invitationData = invitationsResponse.find(
                (data) => data.projectId === project.id_project,
              );
              return {
                ...project,
                invitations: invitationData ? invitationData.invitations : [],
              };
            },
          );
          setProjects(updatedProjectsWithInvitations);
        }
      } catch (error) {
        console.error("Error searching projects:", error);
      }
    };
    fetchSearchResults();
  }, [searchTerm]);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchUserRatings = async (commentId: number) => {
    try {
      const response = await axios.post(
        "https://legality-back-production.up.railway.app/projects/user-ratings",
        {
          id_user: user?.id_user,
          id_comment: commentId,
        },
      );

      // Vérifiez si la requête a réussi (status 200) et si la propriété "success" dans la réponse est vraie
      if (response.status === 200 && response.data.success) {
        // Extrait les ratings de la réponse
        const ratings = response.data.ratings;

        // Dans cet exemple, nous supposons qu'il n'y a qu'un seul rating dans le tableau des ratings
        const rating = ratings.length > 0 ? ratings[0].rating : 0;

        // Mettez à jour l'état ou effectuez d'autres actions en fonction de la réponse de l'API
        setProjects((prevProjects) =>
          prevProjects.map((project) => ({
            ...project,
            comments: project.comments.map((comment) =>
              comment.id_comment === commentId
                ? { ...comment, rating: rating }
                : comment,
            ),
          })),
        );
      } else {
        // Gérez le cas où la requête échoue ou si la propriété "success" est fausse
        console.error("Error fetching user ratings:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user ratings:", error);
    }
  };

  const handleRating = async (commentId, rating) => {
    try {
      // Envoyer la mise à jour au serveur
      const response = await axios.post(
        "https://legality-back-production.up.railway.app/projects/add-rating",
        {
          id_comment: commentId,
          id_user: user?.id_user,
          rating: rating,
          date_rating: new Date().toISOString(),
        },
      );

      if (response.status === 200) {
        // Mettre à jour le rating local du commentaire avec la nouvelle valeur
        setProjects((prevProjects) =>
          prevProjects.map((project) => ({
            ...project,
            comments: project.comments.map((comment) =>
              comment.id_comment === commentId
                ? { ...comment, rating: rating }
                : comment,
            ),
          })),
        );

        toast.success("Rating added/updated successfully");
      }
    } catch (error) {
      console.error("Error adding/updating rating:", error);
      toast.error("Error adding/updating rating");
    }
  };

  useEffect(() => {
    // Écouter l'événement 'notification'
    socket.on("notification", (data) => {
      if (data.type === "request" && data.userId === user?.id_user) {
        showNotification();
      }
    });

    return () => {
      socket.off("notification");
    };
  }, [user]);

  const showNotification = () => {
    toast.info("You have received a new invitation!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
    });
  };
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [activecommentId, setActiveCommentId] = useState<number | null>(null);
  const [commentStates, setCommentStates] = useState({});
  const toggleCommentInput = (id_project) => {
    setCommentStates((prevStates) => ({
      ...prevStates,
      [id_project]: !prevStates[id_project],
    }));
  };
  const handleOptionsClick = (projectId: number) => {
    setActiveProjectId(activeProjectId === projectId ? null : projectId);
  };
  const handleOptionsCommentClick = (id_comment: number) => {
    setActiveCommentId(activecommentId === id_comment ? null : id_comment);
    setIsEditing(true);
  };
  const handleDeleteComment = async (commentId, projectId) => {
    
    try {
      const response = await axios.post(
        "https://legality-back-production.up.railway.app/projects/deleteComment",
        {
          id_comment: commentId,
          id_user: user?.id_user,
        }
      );
  
      if (response.status === 200) {
        setProjects((prevProjects) =>
          prevProjects.map((project) => {
            if (project.id_project === projectId) {
              const updatedComments = project.comments.filter(
                (comment) => comment.id_comment !== commentId
              );
              return {
                ...project,
                comments: updatedComments,
                commentCount: updatedComments.length,
              };
            }
            return project;
          })
        );
  
        toast.success("Comment deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Error deleting comment");
    }
  };
  const dropdownRef = useRef(null);
  const dropdownRef1 = useRef(null);
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);
  const handleDocumentClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setActiveProjectId(null);
      
    }
  };
  const handleDocumentClick2 = (event) => {
    if (dropdownRef1.current && !dropdownRef1.current.contains(event.target)) {
      setActiveCommentId(null);
    }
  };
  useEffect(() => {
    if (activecommentId !== null) {
      document.addEventListener('mousedown', handleDocumentClick2);
    } else {
      document.removeEventListener('mousedown', handleDocumentClick2);
    }

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick2);
    };
  }, [activecommentId]);
  useEffect(() => {
    if (activeProjectId !== null) {
      document.addEventListener('mousedown', handleDocumentClick);
    } else {
      document.removeEventListener('mousedown', handleDocumentClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [activeProjectId]);
  const handleDeleteClick = async (projectId) => {
    try {
      const response = await axios.delete("https://legality-back-production.up.railway.app/projects", {
        data: {
          id: projectId,
        },
      });
      if (response.status === 200) {
        const updatedProjects = projects.filter(
          (project) => project.id_project !== projectId,
        );
        setProjects(updatedProjects);
        toast.success("Post deleted successfully");
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error deleting post");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setShowText(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);

    handleResize();
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
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [router]);
  const fetchProjects = async () => {
    try {
      const response = await axios.post<Project[]>(
        "https://legality-back-production.up.railway.app/projects/projectbyuser",
        { id_user: user?.id_user ,
          country: user?.country_user,
        },
      );
      const projectsData = response.data;
      const projectsWithComments: ProjectWithComments[] = await Promise.all(
        projectsData.map(async (project: Project) => {
          const comments = await fetchCommentsForProject(project.id_project);
          const likes = await fetchLikeCountForProject(project.id_project);
          const commentCount = await fetchCommentCountForProject(
            project.id_project,
          );
          const isLikedResponse = await axios.post(
            "https://legality-back-production.up.railway.app/projects/isLiked",
            {
              id_project: project.id_project,
              id_user: user?.id_user,
            },
          );

          // Ajout de la logique pour récupérer le statut de l'invitation
          const invitationStatusResponse = await axios.post(
            "https://legality-back-production.up.railway.app/projects/invitation",
            {
              id_project: project.id_project,
              id_user: user?.id_user,
            },
          );

          return {
            ...project,
            comments,
            showEmojiMenu: false,
            commentInput: "",
            likes,
            hasLiked: isLikedResponse.data.liked,
            commentCount,
            invitations: invitationStatusResponse.data.invitations,
          };
        }),
      );

      // Intégration de la récupération des pourcentages de notation pour chaque commentaire
      const fetchRatingPercentageForComments = async () => {
        try {
          const updatedProjects = await Promise.all(
            projectsWithComments.map(async (project) => {
              const updatedComments = await Promise.all(
                project.comments.map(async (comment) => {
                  try {
                    const response = await axios.post(
                      "https://legality-back-production.up.railway.app/projects/ratingPercentage",
                      { id_comment: comment.id_comment },
                    );
                    if (response.data.success) {
                      return {
                        ...comment,
                        ratingPercentage: response.data.percentage,
                      };
                    } else {
                      console.error(
                        "Failed to fetch rating percentage for comment:",
                        comment.id_comment,
                      );
                      return comment;
                    }
                  } catch (error) {
                    console.error(
                      "Error fetching rating percentage for comment:",
                      error,
                    );
                    return comment;
                  }
                }),
              );
              return { ...project, comments: updatedComments };
            }),
          );
          setProjects(updatedProjects);
        } catch (error) {
          console.error("Error fetching rating percentages:", error);
        }
      };

      fetchRatingPercentageForComments();

      // Fin de l'intégration de la récupération des pourcentages de notation

      setProjects(projectsWithComments);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  useEffect(() => {
    fetchProjects();
    const handleLikeButtonClick = async (projectId: number) => {
      try {
        const response = await axios.post(`https://legality-back-production.up.railway.app/projects/like`, {
          id_project: projectId,
          id_user: user?.id_user,
        });
  
        if (response.status === 200) {
          if (response.data.success) {
            const updatedProjects = projects.map((prevProject) => {
              if (prevProject.id_project === projectId) {
                return {
                  ...prevProject,
                  hasLiked: response.data.message.includes("added"),
                  likes: response.data.message.includes("added")
                    ? prevProject.likes + 1
                    : Math.max(0, prevProject.likes - 1),
                };
              } else {
                return prevProject;
              }
            });
  
            setProjects(updatedProjects);
          }
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Error liking/disliking project:", error);
      }
    };
  }, [user]);

  const fetchCommentsForProject = async (
    projectId: number,
  ): Promise<ProjectComment[]> => {
    try {
      const response = await axios.post<{ comments: ProjectComment[] }>(
        "https://legality-back-production.up.railway.app/projects/getAllComments",
        { id_project: projectId },
      );
      return response.data.comments;
    } catch (error) {
      console.error("Error fetching comments for project:", error);
      return [];
    }
  };

  const fetchLikeCountForProject = async (projectId) => {
    try {
      const response = await axios.post(
        "https://legality-back-production.up.railway.app/projects/liked",
        { id_project: projectId },
      );
      return response.data.likeCount;
    } catch (error) {
      console.error("Error fetching like count for project:", error);
      return 0;
    }
  };

  const handleSendRequest = async (projectId) => {
    try {
      const response = await axios.post("https://legality-back-production.up.railway.app/projects/send", {
        id_user: user?.id_user,
        id_project: projectId,
      });

      if (response.status === 200 && response.data.success) {
        const updatedProjects = projects.map((prevProject) =>
          prevProject.id_project === projectId
            ? {
              ...prevProject,
              invitations: [{ id: Date.now(), status: response.data.status }],
            }
            : prevProject
        );
        setProjects(updatedProjects);
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };


  const handleCancelRequest = async (projectId) => {
    try {
      const response = await axios.post("https://legality-back-production.up.railway.app/projects/cancel", {
        id_user: user?.id_user,
        id_project: projectId,
      });

      if (response.status === 200 && response.data.success) {
        const updatedProjects = projects.map((prevProject) =>
          prevProject.id_project === projectId
            ? {
              ...prevProject,
              invitations: [],
            }
            : prevProject
        );
        setProjects(updatedProjects);
      }
    } catch (error) {
      console.error("Error canceling request:", error);
    }
  };


  useEffect(() => {
    const fetchLikeCounts = async () => {
      const counts = {};
      for (const project of projects) {
        const likeCount = await fetchLikeCountForProject(project.id_project);
        counts[project.id_project] = likeCount;
      }
      setLikeCounts(counts);
    };
    fetchLikeCounts();
  }, [projects]);

  const fetchCommentCountForProject = async (
    projectId: number,
  ): Promise<number> => {
    try {
      const response = await axios.post<{ commentCount: number }>(
        "https://legality-back-production.up.railway.app/projects/countComments",
        { id_project: projectId },
      );
      return response.data.commentCount;
    } catch (error) {
      console.error("Error fetching comment count for project:", error);
      return 0;
    }
  };
  const [commentInputt, setCommentInput] = useState(""); 
  const [showInput, setShowInput] = useState(false); 
  const handleCommentInputChange = (projectId: number, comment: string) => {
    setProjects(
      projects.map((project) =>
        project.id_project === projectId
          ? { ...project, commentInput: comment }
          : project,
      ),
    );
  };

  const handleEmojiClick = (projectId: number) => {
    setProjects(
      projects.map((project) =>
        project.id_project === projectId
          ? { ...project, showEmojiMenu: !project.showEmojiMenu }
          : project,
      ),
    );
  };

  const handleEmojiSelect = (emoji: string, projectId: number) => {
    setProjects(
      projects.map((project) =>
        project.id_project === projectId
          ? {
            ...project,
            commentInput: (project.commentInput || "") + emoji,
            showEmojiMenu: false,
          }
          : project,
      ),
    );
    setValueSearch((prev) => prev + emoji);
  };

  const handleLikeButtonClick = async (projectId: number) => {
    try {
      const response = await axios.post(`https://legality-back-production.up.railway.app/projects/like`, {
        id_project: projectId,
        id_user: user?.id_user,
      });

      if (response.status === 200) {
        if (response.data.success) {
          const updatedProjects = projects.map((prevProject) => {
            if (prevProject.id_project === projectId) {
              return {
                ...prevProject,
                hasLiked: response.data.message.includes("added"),
                likes: response.data.message.includes("added")
                  ? prevProject.likes + 1
                  : Math.max(0, prevProject.likes - 1),
              };
            } else {
              return prevProject;
            }
          });

          setProjects(updatedProjects);
        }
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error liking/disliking project:", error);
    }
  };
  const handleAddComment = async (projectId: number, comment: string) => {
    try {
      const response = await axios.post(
        `https://legality-back-production.up.railway.app/projects/addComment`,
        {
          id_project: projectId,
          id_user: user?.id_user,
          comment: comment,
        },
      );

      if (response.status === 200) {
        // const newComment: ProjectComment = {
        //   id_project: projectId,
        //   id_comment: response.data.commentId,
        //   rating: response.data.rating,
        //   id_user: user?.id_user ? Number(user.id_user) : 0, 
        //   firstName_user: user?.firstName_user || "",
        //   lastName_user: user?.lastName_user || "",
        //   avatar_url: user?.avatar_url || "",
        //   comment: comment,
        // };
        // const updatedProjects = projects.map((prevProject) => {
        //   if (prevProject.id_project === projectId) {
        //     return {
        //       ...prevProject,
        //       comments: [...prevProject.comments, newComment],
        //     };
        //   } else {
        //     return prevProject;
        //   }
        // });

        // setProjects(updatedProjects);
        // handleCommentInputChange(projectId, "");
        // const commentCount = await fetchCommentCountForProject(projectId);
        // const updatedProjectsAfterCountRefresh = updatedProjects.map(
        //   (project) =>
        //     project.id_project === projectId
        //       ? { ...project, commentCount }
        //       : project,
        // );
        // setProjects(updatedProjectsAfterCountRefresh);
        const response = await axios.post(
          "https://legality-back-production.up.railway.app/projects/projectbyuser",
          { id_user: user?.id_user 
            ,
          country: user?.country_user,
          },
        );
        const projectsData = response.data;
        const projectsWithComments: ProjectWithComments[] = await Promise.all(
          projectsData.map(async (project: Project) => {
            const comments = await fetchCommentsForProject(
              project.id_project,
            );
            const likes = await fetchLikeCountForProject(project.id_project);
            const commentCount = await fetchCommentCountForProject(
              project.id_project,
            );
            const isLikedResponse = await axios.post(
              "https://legality-back-production.up.railway.app/projects/isLiked",
              {
                id_project: project.id_project,
                id_user: user?.id_user,
              },
            );
            // Ajout de la récupération du statut de l'invitation
            const invitationResponse = await axios.post(
              "https://legality-back-production.up.railway.app/projects/invitation",
              {
                id_project: project.id_project,
                id_user: user?.id_user,
              },
            );
            const invitations = invitationResponse.data.invitations;

            return {
              ...project,
              comments,
              showEmojiMenu: false,
              commentInput: "",
              likes,
              hasLiked: isLikedResponse.data.liked,
              commentCount,
              invitations,
            };
          }),
        );

        setProjects(projectsWithComments);
        fetchProjects()
        setValueSearch("")
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  const handleUpdateComment = async (projectId: number, comment: string, id_comment: number) => {
    try {
      // Send a PUT request to the update endpoint, including the comment ID in the URL path
      const response = await axios.put(
        `https://legality-back-production.up.railway.app/projects/updateComment/${id_comment}`, // Note: The comment ID is now part of the URL
        {
          id_project: projectId,
          id_user: user?.id_user,
          comment: comment,
        }
      );
  
      if (response.status === 200) {
        const updatedComment = {
          id_project: projectId,
          id_comment: id_comment, // Use the original comment ID
          rating: response.data.rating, // Assuming the response includes the updated rating
          id_user: user?.id_user? Number(user.id_user) : 0,
          firstName_user: user?.firstName_user || "",
          lastName_user: user?.lastName_user || "",
          avatar_url: user?.avatar_url || "",
          comment: comment,
        };
        // Find the project and update its comments array
        const updatedProjects = projects.map((prevProject) => {
          if (prevProject.id_project === projectId) {
            // Filter out the old comment and add the updated comment
            const updatedComments = prevProject.comments.filter(c => c.id_comment!== id_comment);
            updatedComments.push(updatedComment);
            return {
             ...prevProject,
              comments: updatedComments,
            };
          } else {
            return prevProject;
          }
        });
        setProjects(updatedProjects);
        const commentCount = await fetchCommentCountForProject(projectId);
        const updatedProjectsAfterCountRefresh = updatedProjects.map(
          (project) =>
            project.id_project === projectId
             ? {...project, commentCount }
              : project,
        );
        setProjects(updatedProjectsAfterCountRefresh);
                fetchProjects();

      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };
  const filteredProjects = searchTerm
    ? projects.filter(
      (project) =>
        project.name_project
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        project.description_project
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    )
    : projects;

  return (
    <Layoutuser>
      <div className="flex bg-[#f8f8f8] font-serif">
        <Headeruser user = {user} />
        <ToastContainer />
        <div className="mx-auto w-2/3 " style={{ marginRight: '17px',  paddingRight : '120px'  }}>
        <link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
/>
        <SideBarMenu />
          <br />
          <br />
          <br />
          <br />
          <div>
          <div className="">
          <div className=" ">
      
    </div>          
      {user && (
              <div className="flex bg-white border  rounded-lg h-full">
                <div className={`flex h-full ${window.innerWidth > 768 ? 'items-center justify-center' : 'flex-col'} p-2`}>
                  <div className="rounded-full flex items-center justify-center bg-gray-200" style={{ width: '10rem', height: '10rem' }}>
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="avatar" className="rounded-full" style={{ width: '100%', height: '100%' }} />
                    ) : (
                      <div style={{ fontSize: '3rem' }}>
                        {user.firstName_user.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="">
  <p className="font-bold text-xl mb-2 text-gray-800">
    {user.firstName_user} {user.lastName_user}
  </p>
  <p className="font-medium text-lg mb-1 text-gray-600">
    {user.occupation_user}
  </p>
  <p className="font-medium text-lg mb-1 text-gray-600">
    {user.email_user}
  </p>
  <p className="font-medium text-lg mb-1 text-gray-600">
    {user.country_user}
  </p>
</div>
                
                </div>
                <div className="flex items-center justify-end space-x-4 flex-grow ml-10">
                <button
                  onClick={openModal}
                  className="flex items-center rounded-full px-2 py-2 text-gray-100 text-white"
                  style={{
                    backgroundColor: "#1C6AE4",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  <IoAdd className="ml-2 mr-2 text-white" />  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  {mounted ? t('common.addPost') : 'Loading...'}
                  </span> 
                </button>
                {showModal && (
                  <Modal onClose={closeModal}>
                    <PostForm setProjects={setProjects}  fetchProjects ={fetchProjects}/>
                  </Modal>
                )}
                   {showModal2 && (
                  <Modal onClose={closeModal2}>
                    <UpdatePost setProjects={setProjects}  fetchProjects ={fetchProjects}  project={currentProject} />
                  </Modal>
                )}
                {showModal1 && (
                <Modal1 onClose={() => setShowModal1(false)}>
               <img src={selectedImageUrl} alt="Selected Project Image" className="w-full h-auto rounded-md object-contain" />
                  </Modal1>
              )}
                 
                </div>

              </div>
            )}
              </div>
             </div>
          

          <div className="max-w-8xl mx-auto">
      <br />
      {filteredProjects.length === 0 ? (
        <div className="mt-4 text-center text-gray-500">
      {mounted ? t('common.noPost') : 'Loading...'}
      </div>
      ) : (
        filteredProjects.map((project) => (
          <div
            key={project.id_project}
            className="mb-4 rounded-lg  bg-white p-4 "
          >
            <div>
              <div className="flex justify-end">
                {user?.id_user === project.user_id_user && (
                  <button
                    onClick={() => {handleOptionsClick(project.id_project)
                    }}
                    className="flex items-center text-gray-500 hover:text-blue-500"
                  >
                    <IoEllipsisHorizontalOutline className="mr-2" />
                    {showText && <span className="ml-2"></span>}
                  </button>
                )}
              </div>
              <div className="relative" >
  {activeProjectId === project.id_project && (
    <div className="absolute top-0 right-0 mt-2 mr-2 bg-white  rounded-lg ">
      <div className="flex flex-col items-start p-2">
        <button
          className="flex items-center bg-red-100 text-red-600 font-bold text-sm py-2 px-4 mb-2 border border-transparent rounded-lg transition-colors duration-300 "
          onClick={() => handleDeleteClick(project.id_project)}
          style={{
            color: 'red',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'red';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#ffe5e5';
            e.target.style.color = 'red';
          }}
        >
          <i className="fas fa-trash-alt mr-2"></i>
          {t('common.delete')} 

        </button>
        <button
          className="flex items-center  text-blue-600 font-bold text-sm py-2 px-4 border border-transparent rounded-lg transition-colors duration-300 "
          onClick={() => handleUpdatePost(project)}
          style={{
            color: '#1C6AE4',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#1C6AE4';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#e5f1ff';
            e.target.style.color = '#1C6AE4';
          }}
        >
          <i className="fas fa-edit mr-2"></i>
          {t('common.update')} 
        </button>
      </div>
    </div>
  )}
</div>
            </div>

                  <div className="mb-2 flex items-center">
                    <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                      {project.user_avatar_url ? (
                        <img
                          src={project.user_avatar_url}
                          alt={`${project.firstName_user}'s Avatar`}
                          className="h-full w-full rounded-full"
                        />
                      ) : (
                        <span className="text-lg text-gray-600">
                          {project.firstName_user.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">
                        {project.firstName_user}&nbsp;{project.lastName_user}
                      </span>
                      <span className="text-sm text-gray-500">
                      {mounted ? formatDistanceToNow(new Date(project.createdAt_project), { addSuffix: true, locale: getLocale() }) : 'Loading...'} 

                      </span>
                    </div>
                  </div>
                  <h4 className="text-2xl font-semibold text-gray-800 leading-tight mb-2">
  {project.name_project}
</h4>
                  <span style={{ wordWrap: "break-word" }}>
                    {project.description_project
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                      ? project.description_project
                        .split(new RegExp(`(${searchTerm})`, "gi"))
                        .map((part, index) => (
                          <span
                            key={index}
                            style={{
                              background:
                                part.toLowerCase() ===
                                  searchTerm.toLowerCase()
                                  ? "#1C6AE4"
                                  : "inherit",
                              color:
                                part.toLowerCase() ===
                                  searchTerm.toLowerCase()
                                  ? "#fff"
                                  : "inherit",
                            }}
                          >
                            {part}
                          </span>
                        ))
                      : project.description_project}
                  </span>

                  <div className="project-images flex flex-wrap gap-2">
                    {Array.isArray(project.images) &&
                      (project.images.length > 0 ? (
                        project.images.slice(0, 2).map((imageUrl, index) => (
                          <div
                            key={index}
                            className={`h-32 w-full rounded-md object-cover md:h-auto md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5`}
                          >
                   {imageUrl ? (
  <img
    src={imageUrl}
    alt={`Project ${project.id_project} image ${index}`}
    className="h-full w-full rounded-md object-cover cursor-pointer"
    onClick={() => handleImageClick(imageUrl)}
  />
) : (
  <div className="h-full w-full rounded-md bg-gray-200"></div>
)}
                          </div>
                        ))
                      ) : (
                        <div className="h-full w-full rounded-md bg-gray-200" />
                      ))}
                  </div>

                  <div className="mt-4 flex justify-between">
                    <button
                      id={`like-button-${project.id_project}`}
                      onClick={() => handleLikeButtonClick(project.id_project)}
                      className="flex items-center text-black hover:text-blue-500"
                    >
                      {project.hasLiked ? (
                        <FcLike size={20} />
                      ) : (
                        <GoHeart size={20} />
                      )}
                      {showText && (
                        <span className="ml-2 text-black font-bold">{t('common.like')}  ({project.likes})</span>
                      )}
                    </button>
                   
                    <button className="flex items-center text-black hover:text-blue-500"
                     onClick={() => toggleCommentInput(project.id_project)}
                     >
                      <GoComment className="mr-2" size={20} />
                      {commentStates[project.id_project] ? (
            <span className="ml-2 text-black font-bold">{t('common.hideComment')}</span>
          ) : (
            <span className="ml-2 text-black font-bold">{t('common.comment')}</span>
          )}
                    </button>
                    
                    {project.invitations.length === 0 && project.user_id_user !== user?.id_user ? (
                      <button
                        onClick={() => handleSendRequest(project.id_project)}
                        className="flex items-center text-black hover:text-blue-500"
                      >
                        <TbUsersPlus className="mr-2" size={28} />
                        {showText && <span className="ml-2 text-black font-bold">Connect</span>}
                      </button>
                    ) : (
                      project.invitations.map((invitation) => (
                        <button
                          key={invitation.id}
                          onClick={() => handleCancelRequest(project.id_project)}
                          className={`flex items-center ${invitation.status === "accepted"
                            ? "text-gray-500 cursor-not-allowed opacity-50"
                            : "text-gray-500 hover:text-blue-500"
                            }`}
                          disabled={invitation.status === "accepted"}
                        >
                          {invitation.status === "pending" ? (
                            <>
                              <IoHourglassOutline className="mr-2" size={28} />
                              {showText && <span className="ml-2">Pending</span>}
                            </>
                          ) : invitation.status === "accepted" ? (
                            <>
                              <FaUserFriends className="mr-2" size={28} />
                              {showText && <span className="ml-2">Friend</span>}
                            </>
                          ) : (
                            <TbUsersPlus className="mr-2" size={28} />
                          )}
                        </button>
                      ))
                    )}

                  </div>
                  <div className="relative mt-4">
                  {commentStates[project.id_project] && (    
                    <>
      <form  onSubmit={(e)=> {
                        e.preventDefault()
                      }}>
  <input
        type="text"
        value={valueSearch}
        onChange={(e) => {
          setValueSearch(e.target.value);
          handleCommentInputChange(project.id_project, e.target.value);
        }}
        placeholder={t('common.yourComment')} 
        className="w-full rounded-md border border-gray-300 px-4 py-2 pr-12 focus:border-blue-500 focus:outline-none"
      />
      <span
      
      onClick={() => {
        handleEmojiClick(project.id_project)
        
      }}
      className="absolute right-8 top-4 cursor-pointer"
    >
      <IoHappyOutline className="text-gray-500 hover:text-blue-500" />
    </span>
    <span className="absolute right-2 top-4 cursor-pointer">
      <button
        onClick={() =>
          handleAddComment(
            project.id_project,
            project.commentInput || "",
          )
        }
        className="flex items-center text-gray-500 hover:text-blue-500"
        disabled={project.commentInput?.length < 1}
      >
        <RiSendPlaneFill className="text-blue-500 hover:text-blue-600" />
      </button>
    </span>
      </form>
    
      
      {project.showEmojiMenu && (
        <div className="mt-2">
          {emojis.map((emoji, index) => (
            <span
              key={index}
              className="cursor-pointer text-xl"
              onClick={() =>
                handleEmojiSelect(emoji, project.id_project)
              }
            >
              {ReactEmoji.emojify(emoji)}
            </span>
          ))}
        </div>
      )}
    </>
  )}
</div>
                  {showMoreComments && (
                    <button
                      onClick={() => setShowMoreComments(false)}
                      className="mt-2 flex items-center text-gray-500 hover:text-blue-500"
                    >
                      <IoRefreshOutline className="mr-2" />
                      <span className="ml-2">{t('common.showLessComments')}</span>
                    </button>
                  )}
                  {!showMoreComments && project.commentCount > 3 && (
                    <button
                      onClick={() => setShowMoreComments(true)}
                      className="mt-2 flex items-center text-gray-500 hover:text-blue-500"
                    >
                      <IoRefreshOutline className="mr-2" />
                      <span className="ml-2">
                      {t('common.showMoreComments')} ({project.commentCount})
                      </span>
                    </button>
                  )}
                  <div>
                    {project.comments
                      .slice(0, showMoreComments ? project.comments.length : 3)
                      .map((comment, index) => (
<div key={index} className="mt-4 p-2 bg-gray-200 rounded-lg ">
<div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                            {comment.avatar_url ? (
                              <img
                                src={comment.avatar_url}
                                className="h-full w-full rounded-full"
                              />
                            ) : (
                              <span className="text-lg text-gray-600">
                                {comment.firstName_user.charAt(0)}
                              
                              </span>
                            )}
                          </div>
                          <div>
                          <div className="flex justify-end" >
                          {comment.created_at ? (
            <span className="text-sm text-gray-500 mr-2">
  {mounted ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: getLocale() }) : 'Loading...'}  
  </span>
          ) : (
            <span className="text-sm text-gray-500 mr-2">Date not available</span>
          )} 
                {user?.id_user === comment.id_user && (
                  <button
                    onClick={() =>{                      
                    handleOptionsCommentClick(comment.id_comment);
                    } }
                    className="flex items-center text-gray-500 hover:text-blue-500"
                  >
                    <IoEllipsisHorizontalOutline className="mr-2" />
                    {showText && <span className="ml-2"></span>}
                  </button>
                )}
                
              </div>
              {!isEditing && activecommentId === comment.id_comment ? (
        <div className="flex items-center">
          <form  onSubmit={(e)=> {
                        e.preventDefault()
                      }}>
  <input
            type="text"
            value={commentInputt}
            onChange={(e) => setCommentInput(e.target.value)}
            className="comment-input flex-grow mr-2 py-1 px-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <button
            className="option-button flex-shrink-0 py-1 px-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
            disabled={commentInputt.length<1}
            onClick={() => {
            
              handleUpdateComment(comment.id_project, commentInputt, comment.id_comment);
              setIsEditing(true);
              setCommentInput('');
            }}
          >
            <RiSendPlaneFill className="text-xl" />
          </button>

             </form>
        </div>
      ) : (
        activecommentId === comment.id_comment && (
          <div className="relative" >
            <div className="absolute top-0 right-0 mt-2 mr-2 bg-white  rounded-lg ">
              <div className="flex flex-col items-start p-2">
                <button
                  className="flex items-center bg-red-100 font-bold py-2 px-4 mb-2 border border-transparent rounded-lg transition-colors duration-300"
                  onClick={() => {
                    handleDeleteComment(comment.id_comment, project.id_project);
                  }}
                  style={{
                    fontSize: '12px',  // Decrease font size here
                    color: 'red',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'red';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#ffe5e5';
                    e.target.style.color = 'red';
                  }}
                >
                  <i className="fas fa-trash-alt mr-2"></i>
                  {t('common.delete')} 
                </button>
                <button
                  className="flex items-center  font-bold py-2 px-4 border border-transparent rounded-lg transition-colors duration-300"
                  onClick={() => {
                    setActiveCommentId(comment.id_comment);
                    setIsEditing(false);
                  }}
                  style={{
                    fontSize: '12px',  // Decrease font size here
                    color: '#1C6AE4',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#1C6AE4';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#e5f1ff';
                    e.target.style.color = '#1C6AE4';
                  }}
                >
                  <i className="fas fa-edit mr-2"></i>
                  {t('common.update')} 
                </button>
              </div>
            </div>
          </div>
        )
      )}
                            <p className="font-semibold">
                              {comment.firstName_user} {comment.lastName_user}
                            </p>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "8px",
                              }}
                            >
                              <p style={{ marginRight: "8px" }}>
                                {comment.comment}
                              </p>
                              <div
                                style={{
                                  position: "relative",
                                  marginLeft: "auto",
                                }}
                              >
                                <AiFillStar
                                  style={{
                                    color: "#ffc107",
                                    width: "24px",
                                    height: "24px",
                                    position: "absolute",
                                    zIndex: 1,
                                    clipPath: `inset(0 ${100 - (comment.ratingPercentage || 0)}% 0 0)`,
                                  }}
                                />
                                <AiFillStar
                                  style={{
                                    color: "white",
                                    width: "24px",
                                    height: "24px",
                                    position: "relative",
                                  }}
                                />
                                <span
                                  style={{
                                    fontSize: "10px",
                                    bottom: "2px",
                                    right: "2px",
                                  }}
                                >
                                  {comment.ratingPercentage}%
                                </span>
                              </div>
                            </div>
                            <div>
                              
                            {user?.id_user !== comment.id_user ? (
    [1, 2, 3, 4, 5].map((ratingValue) => (
        <button
            key={ratingValue}
            onClick={() => handleRating(comment.id_comment, ratingValue)}
            className="mx-1 text-gray-500 hover:text-blue-500"
        >
            {ratingValue <= comment.rating ? (
                <AiFillStar style={{ color: "#ffc107" }} />
            ) : (
                <AiOutlineStar style={{ color: "white" }} />
            )}
        </button>
    ))
) : ""
    
}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <br />
     
    </Layoutuser>
  );
};
export default Dashboard;
