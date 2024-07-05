// Import necessary dependencies and components
import React from 'react';
import moment from 'moment';
import { IoThumbsUpOutline, IoChatbubbleOutline, IoSend, IoHourglassOutline, IoHappyOutline, IoRefreshOutline } from 'react-icons/io5';
import { RiSendPlaneFill } from 'react-icons/ri';
import ReactEmoji from 'react-emoji';
import { formatDistanceToNow } from 'date-fns';

// Define interfaces
interface Project {
  id_project: number;
  name_project: string;
  description_project: string;
  user: {
    avatar_url: string;
    firstName: string;
    lastName: string;
  };
  hasLiked: boolean;
  likes: number;
  commentsCount: number;
  invitations: {
    id: number;
    status: string;
  }[];
  commentInput: string;
  showEmojiMenu: boolean;
  images: string[];
  createdAt_project: string; // You might need to adjust this based on your API response
  comments: {
    id: number;
  userId: string; // ID de l'utilisateur qui a fait le commentaire
  comment: string;
  user: {
    firstName: string;
    lastName: string;
    avatar_url?: string;
  };
  }[];
}

interface Props {
  filteredProjects: Project[]; // Correct prop name
  handleLikeButtonClick: (projectId: number) => void;
  handleSendRequest: (projectId: number) => void;
  handleCancelRequest: (projectId: number) => void;
  handleCommentInputChange: (projectId: number, value: string) => void;
  handleAddComment: (projectId: number, comment: string) => void;
  handleEmojiClick: (projectId: number) => void;
  handleEmojiSelect: (emoji: string, projectId: number) => void;
  showMoreComments: boolean;
  setShowMoreComments: (value: boolean) => void;
  searchTerm: string;
  showText: boolean;
}

const ProjectCard: React.FC<Props> = ({
  filteredProjects, // Correct prop name
  handleLikeButtonClick,
  handleSendRequest,
  handleCancelRequest,
  handleCommentInputChange,
  handleAddComment,
  handleEmojiClick,
  handleEmojiSelect,
  showMoreComments,
  setShowMoreComments,
  searchTerm,
  showText,
}) => {

  // Example emojis, you can adjust as needed
  const emojis = ['😀', '😍', '🚀', '👍', '❤️', '😊', '🎉'];

  return (
    <div>
      {filteredProjects && filteredProjects.length === 0 ? (
        <div className="mt-4 text-center text-gray-500">No project found with this name or description.</div>
      ) : (
        filteredProjects.map((project) => (
          <div
            key={project.id_project} // Ensure each project has a unique key
            className="mb-4 rounded-lg border bg-white p-4 shadow-md"
          >
            {/* Project details */}
            <div className="mb-2 flex items-center">
              <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                {project.user.avatar_url ? (
                  <img
                    src={project.user.avatar_url}
                    alt="User Avatar"
                    className="h-full w-full rounded-full"
                  />
                ) : (
                  <span className="text-lg text-gray-600">
                    {project.user.firstName
                      ? project.user.firstName.charAt(0)
                      : "INCONNU" // Replace with a default value or appropriate indicator
                    }
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">
                  {/* Display project name with the searched word in blue */}
                  {project.name_project
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                    ? project.name_project
                      .split(new RegExp(`(${searchTerm})`, "gi"))
                      .map((part, index) => (
                        <span
                          key={index}
                          style={{
                            color:
                              part.toLowerCase() === searchTerm.toLowerCase()
                                ? "#1C6AE4"
                                : "inherit",
                          }}
                        >
                          {part}
                        </span>
                      ))
                    : project.name_project}
                </span>
                <span className="text-sm text-gray-500">
                  {project.createdAt_project ? (
                    <>
                      {formatDistanceToNow(
                        new Date(project.createdAt_project),
                      )}{" "}
                      ago
                    </>
                  ) : (
                    "Invalid date"
                  )}
                </span>
              </div>
            </div>
            {/* Project description */}
            <span>
              {/* Display project description with the searched word in blue */}
              {project.description_project
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
                ? project.description_project
                  .split(new RegExp(`(${searchTerm})`, "gi"))
                  .map((part, index) => (
                    <span
                      key={index}
                      style={{
                        color:
                          part.toLowerCase() === searchTerm.toLowerCase()
                            ? "#1C6AE4"
                            : "inherit",
                      }}
                    >
                      {part}
                    </span>
                  ))
                : project.description_project}
            </span>
            {/* Section to display images */}
            <div className="project-images flex flex-wrap gap-2">
              {Array.isArray(project.images) && (
                project.images.length === 1 ? (
                  // Single image display
                  <img
                    src={project.images[0]}
                    alt={`Project ${project.id_project} image`}
                    className="h-full w-full object-cover rounded-md"
                  />
                ) : project.images.length > 1 ? (
                  // Two or more images
                  <div className="flex flex-wrap gap-2">
                    {project.images.map((imageUrl, index) => (
                      <div
                        key={index}
                        className={`w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 h-64 md:h-auto object-cover rounded-md`}
                      >
                        <img
                          src={imageUrl}
                          alt={`Project ${project.id_project} image ${index}`}
                          className="h-full w-full object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  // No images
                  <div className="h-full w-full bg-gray-200 rounded-md" />
                )
              )}
            </div>
            {/* Action buttons */}
            <div className="mt-4 flex justify-between">
              <button
                id={`like-button-${project.id_project}`}
                onClick={() => handleLikeButtonClick(project.id_project)}
                className="flex items-center text-gray-500"
                style={{
                  color: project.hasLiked ? "#007FFF" : "black",
                }}
              >
                <IoThumbsUpOutline className="mr-2" />
                {showText && (
                  <span className="ml-2">Like ({project.likes})</span>
                )}
              </button>
              <button className="flex items-center text-gray-500 hover:text-blue-500">
                <IoChatbubbleOutline className="mr-2" />
                {showText && <span className="ml-2">Comment</span>}
              </button>
              {project.invitations.length === 0 ? (
                <button
                  onClick={() => handleSendRequest(project.id_project)}
                  className="flex items-center text-gray-500 hover:text-blue-500"
                >
                  <IoSend className="mr-2" />
                  {showText && <span className="ml-2">Send Request</span>}
                </button>
              ) : (
                project.invitations.map((invitation) => (
                  <button
                    key={invitation.id}
                    onClick={() => handleCancelRequest(project.id_project)} // Call a function to cancel the invitation
                    className="flex items-center text-gray-500 hover:text-blue-500"
                  >
                    {invitation.status === "pending" ? (
                      <>
                        <IoHourglassOutline className="mr-2" />
                        {showText && (
                          <span className="ml-2">Cancel Request</span>
                        )}
                      </>
                    ) : (
                      "Send Request"
                    )}
                  </button>
                ))
              )}
            </div>
            {/* Comment input */}
            <div className="relative mt-4">
              <input
                type="text"
                value={project.commentInput || ""}
                onChange={(e) =>
                  handleCommentInputChange(
                    project.id_project,
                    e.target.value,
                  )
                }
                placeholder="Your comment..."
                className="w-full rounded-md border border-gray-300 px-4 py-2 pr-12 focus:border-blue-500 focus:outline-none"
              />
              <span
                onClick={() => handleEmojiClick(project.id_project)}
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
                >
                  <RiSendPlaneFill className="text-blue-500 hover:text-blue-600" />
                </button>
              </span>
            </div>
            {/* Emoji menu */}
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
            {/* Show more/less comments */}
            {showMoreComments ? (
              <button
                onClick={() => setShowMoreComments(false)}
                className="mt-2 flex items-center text-gray-500 hover:text-blue-500"
              >
                <IoRefreshOutline className="mr-2" />
                <span className="ml-2">Show less comments</span>
              </button>
            ) : (
              project.commentsCount > 3 && (
                <button
                  onClick={() => setShowMoreComments(true)}
                  className="mt-2 flex items-center text-gray-500 hover:text-blue-500"
                >
                  <IoRefreshOutline className="mr-2" />
                  <span className="ml-2">
                    Show more comments ({project.commentsCount})
                  </span>
                </button>
              )
            )}
            {/* Comments */}
            <div>
  {project.comments
    .slice(0, showMoreComments ? project.comments.length : 3)
    .map((comment) => (
      <div key={comment.id} className="mt-4 flex items-start">
        <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
          <span className="text-lg text-gray-600">
            {comment.user.avatar_url ? (
              <img
                src={comment.user.avatar_url}
                alt={`${comment.user.firstName} ${comment.user.lastName}`}
                className="h-full w-full rounded-full"
              />
            ) : (
              <span className="text-lg text-gray-600">N</span> // Remplacez par une valeur par défaut appropriée
            )}
          </span>
        </div>
        <div>
          <p className="font-semibold">
            {comment.user.firstName && comment.user.lastName ? (
              `${comment.user.firstName} ${comment.user.lastName}`
            ) : (
              "Unknown User"
            )}
          </p>
          <p>{comment.comment}</p>
        </div>
      </div>
    ))}
</div>

          </div>
        ))
      )}
    </div>
  );
};

export default ProjectCard;
