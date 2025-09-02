import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, User, LogIn, UserPlus } from 'lucide-react';

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
  likes: number;
  isReported?: boolean;
  isModerated?: boolean;
  replies?: Comment[];
}

interface ForumUser {
  id: string;
  email: string;
}

interface DiscussionForumProps {
  comments: Comment[];
  newComment: string;
  setNewComment: (comment: string) => void;
  user: ForumUser | null;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  showModeration: boolean;
  setShowModeration: (show: boolean) => void;
  handleCommentSubmit: () => void;
  handleReplySubmit: (commentId: string) => void;
  handleLikeComment: (commentId: string, isReply?: boolean, parentId?: string) => void;
  handleReportComment: (commentId: string, isReply?: boolean, parentId?: string) => void;
  handleModerateComment: (commentId: string, action: 'approve' | 'remove', isReply?: boolean, parentId?: string) => void;
  isProminent?: boolean;
  hideModeration?: boolean;
  onLogin?: () => void;
  onRegister?: () => void;
}

const DiscussionForum: React.FC<DiscussionForumProps> = ({
  comments,
  newComment,
  setNewComment,
  user,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
  showModeration,
  setShowModeration,
  handleCommentSubmit,
  handleReplySubmit,
  handleLikeComment,
  handleReportComment,
  handleModerateComment,
  isProminent = false,
  hideModeration = false,
  onLogin,
  onRegister
}) => {
  return (
    <div className={`${isProminent ? 'h-full flex flex-col p-2' : 'mt-12 pt-8 border-t border-gray-200'}`}>
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-gray-900" />
          <h3 className="text-xs font-bold text-gray-900">ARCHITECT'S FORUM</h3>
          <span className="bg-gray-900 text-white px-1 py-0.5 text-xs">
            {comments.length}
          </span>
        </div>
        {user && !hideModeration && (
          <button
            onClick={() => setShowModeration(!showModeration)}
            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 transition-colors border-0"
          >
            {showModeration ? 'HIDE' : 'MOD'}
          </button>
        )}
      </div>

      {/* Comment Form - Moved to top for prominence */}
      {user ? (
        <div className="mb-3 p-2 bg-gray-50 border-l-2 border-gray-900 flex-shrink-0">
          <div className="flex items-center space-x-1 mb-2">
            <User className="w-3 h-3 text-gray-900" />
            <span className="text-xs text-gray-900">{user.email}</span>
          </div>
          <textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border border-gray-300 text-gray-900 focus:ring-1 focus:ring-gray-900 focus:border-transparent text-xs resize-none overflow-hidden"
            rows={3}
            style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
          />
          <button
            onClick={handleCommentSubmit}
            className="mt-2 bg-gray-900 text-white px-3 py-1 hover:bg-gray-800 transition-colors text-xs border-0"
          >
            POST
          </button>
        </div>
      ) : (
        <div className="mb-3 p-2 bg-gray-50 border-l-2 border-gray-900 flex-shrink-0">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2 text-gray-900">
              <MessageSquare className="w-3 h-3" />
              <span className="text-xs">JOIN DISCUSSION</span>
            </div>
            <div className="flex flex-col space-y-1">
              <button
                onClick={onLogin}
                className="inline-flex items-center justify-center gap-1 bg-gray-900 text-white px-2 py-1 hover:bg-gray-800 transition-colors text-xs border-0"
              >
                <LogIn className="w-3 h-3" />
                LOGIN
              </button>
              <button
                onClick={onRegister}
                className="inline-flex items-center justify-center gap-1 bg-white text-gray-900 border border-gray-900 px-2 py-1 hover:bg-gray-100 transition-colors text-xs"
              >
                <UserPlus className="w-3 h-3" />
                REGISTER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="space-y-2 flex-1 overflow-y-auto">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`border-l-4 p-2 overflow-hidden ${
                comment.isReported
                  ? 'border-l-red-500 bg-red-50'
                  : comment.isModerated
                    ? 'border-l-green-500 bg-green-50'
                    : 'border-l-blue-400 bg-blue-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    <h4 className="text-xs text-gray-900 break-words min-w-0">{comment.user}</h4>
                    <span className="text-xs text-gray-500 break-words min-w-0">
                      {comment.timestamp.toLocaleDateString()} {comment.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-800 text-xs leading-relaxed break-words">{comment.text}</p>
                </div>
                <div className="flex items-center space-x-3 ml-4">
                  <button 
                    onClick={() => handleLikeComment(comment.id)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">{comment.likes}</span>
                  </button>
                  {user && !comment.isReported && (
                    <button
                      onClick={() => handleReportComment(comment.id)}
                      className="text-xs text-gray-500 hover:text-red-600 whitespace-nowrap"
                    >
                      REPORT
                    </button>
                  )}
                </div>
              </div>
              
              {/* Moderation Controls */}
              {showModeration && comment.isReported && (
                <div className="mt-3 flex justify-end space-x-2">
                  <button 
                    onClick={() => handleModerateComment(comment.id, 'approve')}
                    className="text-xs bg-green-200 text-green-900 px-3 py-1 hover:bg-green-300 border-0"
                  >
                    APPROVE
                  </button>
                  <button 
                    onClick={() => handleModerateComment(comment.id, 'remove')}
                    className="text-xs bg-red-200 text-red-900 px-3 py-1 hover:bg-red-300 border-0"
                  >
                    REMOVE
                  </button>
                </div>
              )}
              
              {/* Reply Button */}
              {user && (
                <div className="mt-3 flex justify-end">
                  <button 
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-xs text-gray-900 hover:text-gray-700 border border-gray-300 px-3 py-1 hover:bg-gray-100 transition-colors"
                  >
                    {replyingTo === comment.id ? 'CANCEL' : 'REPLY'}
                  </button>
                </div>
              )}
              
              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="mt-4 pl-1 border-l-2 border-gray-300">
                  <textarea
                    placeholder="Write your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-2 text-xs border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none overflow-hidden"
                    rows={3}
                    style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => handleReplySubmit(comment.id)}
                      className="text-xs bg-gray-900 text-white px-4 py-2 hover:bg-gray-800 border-0"
                    >
                      POST REPLY
                    </button>
                  </div>
                </div>
              )}
              
              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 pl-1 border-l-2 border-gray-200 space-y-3">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`p-1 ${
                        reply.isReported
                          ? 'bg-red-50 border border-red-200'
                          : reply.isModerated
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-green-50 border border-green-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <User className="w-3 h-3 text-gray-600 flex-shrink-0" />
                            <h5 className="text-xs text-gray-900 break-words min-w-0">{reply.user}</h5>
                            <span className="text-xs text-gray-500 break-words min-w-0">
                              {reply.timestamp.toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-800 leading-relaxed break-words">{reply.text}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-3">
                          <button 
                            onClick={() => handleLikeComment(reply.id, true, comment.id)}
                            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                          >
                            <Heart className="w-3 h-3" />
                            <span className="text-xs">{reply.likes}</span>
                          </button>
                          {user && !reply.isReported && (
                            <button
                              onClick={() => handleReportComment(reply.id, true, comment.id)}
                              className="text-xs text-gray-500 hover:text-red-500 whitespace-nowrap"
                            >
                              REPORT
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Moderation Controls for Replies */}
                      {showModeration && reply.isReported && (
                        <div className="mt-2 flex justify-end space-x-2">
                          <button 
                            onClick={() => handleModerateComment(reply.id, 'approve', true, comment.id)}
                            className="text-xs bg-green-200 text-green-900 px-2 py-1 hover:bg-green-300 border-0"
                          >
                            APPROVE
                          </button>
                          <button 
                            onClick={() => handleModerateComment(reply.id, 'remove', true, comment.id)}
                            className="text-xs bg-red-200 text-red-900 px-2 py-1 hover:bg-red-300 border-0"
                          >
                            REMOVE
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionForum;
