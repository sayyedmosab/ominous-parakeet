import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DiscussionForum from '../components/DiscussionForum';
import ChapterSection from '../components/ChapterSection';
import SupportingContent from '../components/SupportingContent';
import MarkdownRenderer from '../components/MarkdownRenderer';
import HtmlRenderer from '../components/HtmlRenderer';
import { fetchHtmlWithEncoding } from '../utils/htmlFetch';
import { useAuth } from '../context/AuthContext';

// Generate dummy text for testing
const generateDummyText = (frameName: string, count: number = 200) => {
  const lines = [];
  for (let i = 1; i <= count; i++) {
    lines.push(`${frameName} - Line ${i}`);
  }
  return lines.join('\n');
};

// Mock data for DiscussionForum
const mockComments = [
  {
    id: '1',
    user: 'architect@example.com',
    text: 'Great episode! The concepts really resonate with my experience in sustainable design.',
    timestamp: new Date(Date.now() - 3600000),
    likes: 5,
    replies: [
      {
        id: '1-1',
        user: 'student@example.com',
        text: 'Agreed! The modular approach is brilliant.',
        timestamp: new Date(Date.now() - 1800000),
        likes: 2
      }
    ]
  },
  {
    id: '2',
    user: 'designer@example.com',
    text: 'How do you handle client feedback during the conceptual phase?',
    timestamp: new Date(Date.now() - 7200000),
    likes: 3
  }
];

const mockUser = { id: '1', email: 'test@example.com' };

// Chapters data from ArchitectsForumPage.tsx.backup
const chapters = [
  {
    id: '1',
    title: 'Chapter 1: The Mechanics of Transformation',
    episodes: [
      {
        id: '1.1',
        title: 'Episode 1.1: What is an Organizational Transformation?',
        description: 'Defines transformation as a fundamental re-engineering of an organization\'s core logic to meet a new strategic ambition that exceeds its current capacity. The goal is to build a new engine, not just tune the old one.',
        releaseDate: '2025-09-01',
        contentPath: '/lessons/1.1/Episode 1.1.md',
        audioPath: '/lessons/1.1/1.1.m4a',
        videoPath: '/lessons/1.1/1.1.mp4',
        studyGuidePath: '/lessons/1.1/1.1studyguide.pdf',
        briefPath: '/lessons/1.1/1.1brief.pdf',
        images: ['/lessons/1.1/episode-1.1_1.png', '/lessons/1.1/episode-1.1_2.png'],
        languages: ['English', 'Spanish', 'Arabic', 'French', 'Chinese'],
        isReleased: true
      },
      {
        id: '1.2',
        title: 'Episode 1.2: What is a Sector Transformation?',
        description: 'Elevates the transformation challenge from a single entity to an entire ecosystem. It redesigns how value flows across multiple, interdependent organizations to achieve a shared strategic goal that no single entity could deliver alone.',
        releaseDate: '2025-09-01',
        contentPath: '/lessons/1.2/Episode 1.2.md',
        images: ['/lessons/1.2/episode-1.2_1.png'],
        audioPath: '/lessons/1.2/1.2.m4a',
        videoPath: '/lessons/1.2/1.2.mp4',
        studyGuidePath: '/lessons/1.2/1.2studyguide.pdf',
        briefPath: '/lessons/1.2/1.2brief.pdf',
        languages: ['English', 'Spanish', 'Arabic', 'French', 'Chinese'],
        isReleased: true
      },
      {
        id: '1.3',
        title: 'Episode 1.3: What is the People Transformation?',
        description: 'Addresses the human and political resistance inherent in public sector reform. Acknowledging that a perfect plan can be derailed by cultural inertia is the first step to managing it.',
        releaseDate: '2025-09-01',
        contentPath: '/lessons/1.3/Episode 1.3.md',
        audioPath: '/lessons/1.3/1.3.m4a',
        videoPath: '/lessons/1.3/1.3.mp4',
        studyGuidePath: '/lessons/1.3/1.3studyguide.pdf',
        briefPath: '/lessons/1.3/1.3brief.pdf',
        languages: ['English', 'Spanish', 'Arabic', 'French', 'Chinese'],
        isReleased: true
      },
      {
        id: '1.4',
        title: 'Episode 1.4: The Entangled Transformation Battleground',
        description: 'Introduces the concept of "entangled" transformations, where multiple entities must change simultaneously. It presents the Complexity Index (CI) as a tool to assess this risk and universal cascading (L0-L3) as the foundational discipline for managing it.',
        releaseDate: '2025-09-01',
        contentPath: '/lessons/1.4/Episode 1.4.md',
        audioPath: '/lessons/1.4/1.4.m4a',
        videoPath: '/lessons/1.4/1.4.mp4',
        studyGuidePath: '/lessons/1.4/1.4studyguide.pdf',
        briefPath: '/lessons/1.4/1.4brief.pdf',
        languages: ['English', 'Spanish', 'Arabic', 'French', 'Chinese'],
        isReleased: true
      }
    ]
  },
  {
    id: '2',
    title: 'Chapter 2: The Architectural Blueprint in Practice',
    episodes: [
      {
        id: '2.1',
        title: 'Episode 2.1: Strategic Performance (KPIs)',
        description: 'Explains how to create a "golden thread" from a high-level national objective (L0) down to a frontline process metric (L3). This ensures every action is aligned with strategy and provides a data-driven basis for performance management.',
        releaseDate: '2025-09-08',
        contentPath: '/lessons/2.1/Episode 2.1.md',
        isReleased: false
      },
      {
        id: '2.2',
        title: 'Episode 2.2: Portfolios & Initiatives',
        description: 'Defines the portfolio as the control system that translates strategy into funded work. An architected portfolio ensures capital is allocated to initiatives with a direct, documented link to strategic KPIs.',
        releaseDate: '2025-09-15',
        contentPath: '/lessons/2.2/Episode 2.2.md',
        isReleased: false
      },
      {
        id: '2.3',
        title: 'Episode 2.3: Process Architecture',
        description: 'Establishes that strategy is executed through processes. Defining L3 (executable) processes and linking them to owners and metrics gives the organization direct control over its operational performance.',
        releaseDate: '2025-09-22',
        contentPath: '/lessons/2.3/Episode 2.3.md',
        isReleased: false
      },
      {
        id: '2.4',
        title: 'Episode 2.4: Organizational Design',
        description: 'Frames the organizational structure as the backbone of accountability. A dynamic structure, where every role is mapped to a specific L3 process and KPI, provides clarity and stability during intense change.',
        releaseDate: '2025-09-29',
        contentPath: '/lessons/2.4/Episode 2.4.md',
        isReleased: false
      }
    ]
  },
  {
    id: '3',
    title: 'Chapter 3: The Management Operating System',
    episodes: [
      {
        id: '3.1',
        title: 'Episode 3.1: The Integrated Governance',
        description: 'Defines governance not as bureaucracy, but as the decision-making "operating system" that integrates strategy, execution (PMO), and operations through a structured cadence of reviews. It is the primary risk management forum for the transformation.',
        releaseDate: '2025-10-06',
        contentPath: '/lessons/3.1/Episode 3.1.md',
        audioPath: '/lessons/3.1/3.1.m4a',
        videoPath: '/lessons/3.1/3.1.mp4',
        studyGuidePath: '/lessons/3.1/3.1studyguide.pdf',
        briefPath: '/lessons/3.1/3.1brief.pdf',
        languages: ['English', 'Spanish', 'Arabic', 'French', 'Chinese'],
        isReleased: true
      },
      {
        id: '3.2',
        title: 'Episode 3.2: The Delivery Engine',
        description: 'Outlines the dual disciplines of Value Assurance (Program Management) and Delivery Assurance (Project Management) that execute the decisions made in governance.',
        releaseDate: '2025-10-13',
        contentPath: '/lessons/3.2/Episode 3.2.md',
        audioPath: '/lessons/3.2/3.2.m4a',
        videoPath: '/lessons/3.2/3.2.mp4',
        studyGuidePath: '/lessons/3.2/3.2studyguide.pdf',
        briefPath: '/lessons/3.2/3.2brief.pdf',
        languages: ['English', 'Spanish', 'Arabic', 'French', 'Chinese'],
        isReleased: true
      },
      {
        id: '3.3',
        title: 'Episode 3.3: Change Architecture',
        description: 'Presents Change Architecture as the discipline for mitigating adoption risk. It integrates human readiness activities (training, coaching) directly with the rollout of technical deliverables.',
        releaseDate: '2025-10-20',
        contentPath: '/lessons/3.3/Episode 3.3.md',
        audioPath: '/lessons/3.3/3.3.m4a',
        videoPath: '/lessons/3.3/3.3.mp4',
        studyGuidePath: '/lessons/3.3/3.3studyguide.pdf',
        briefPath: '/lessons/3.3/3.3brief.pdf',
        languages: ['English', 'Spanish', 'Arabic', 'French', 'Chinese'],
        isReleased: true
      },
      {
        id: '3.4',
        title: 'Episode 3.4: The Enablers',
        description: 'Describes the foundational capabilities required to make a transformation sustainable: Digital Support, Corporate Knowledge Management, and a culture that attracts and retains talent.',
        releaseDate: '2025-10-27',
        contentPath: '/lessons/3.4/Episode 3.4.md',
        audioPath: '/lessons/3.4/3.4.m4a',
        videoPath: '/lessons/3.4/3.4.mp4',
        studyGuidePath: '/lessons/3.4/3.4studyguide.pdf',
        briefPath: '/lessons/3.4/3.4brief.pdf',
        languages: ['English', 'Spanish', 'Arabic', 'French', 'Chinese'],
        isReleased: true
      }
    ]
  },
  {
    id: '4',
    title: 'Chapter 4: DTO Practical Implementation Approach',
    episodes: [
      {
        id: '4.1',
        title: 'Episode 4.1: DTO Implementation Framework',
        description: 'This Body of Knowledge is more than a framework; it is a practical, toolkit designed to accelerate your transformation journey. Within 90 days, an organization can use these assets to create a "baby twin" - a small-scale, Use Case 001 working version of the Digital Twin that grows over time.',
        releaseDate: '2025-11-03',
        contentPath: '/lessons/4.1/Episode 4.1.md',
        audioPath: '/lessons/4.1/4.1.m4a',
        videoPath: '/lessons/4.1/4.1.mp4',
        studyGuidePath: '/lessons/4.1/4.1studyguide.pdf',
        briefPath: '/lessons/4.1/4.1brief.pdf',
        languages: ['English', 'Spanish', 'Arabic', 'French', 'Chinese'],
        isReleased: true
      }
    ]
  }
];

const SimpleTestPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for DiscussionForum
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showModeration, setShowModeration] = useState(false); // Keep moderation hidden

  // State for ChapterSection
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null);

  // State for Episode Content
  const [episodeContent, setEpisodeContent] = useState<string>('');
  const [episodeIsHtml, setEpisodeIsHtml] = useState<boolean>(false);

  // State for SupportingContent
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [audioState, setAudioState] = useState<'playing' | 'paused' | 'stopped'>('stopped');
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  // Episode selection handler
  const handleEpisodeSelect = async (episode: any) => {
    if (!episode.isReleased) return;

    setSelectedEpisode(episode);

    const tryLoad = async (path: string) => {
      return await fetchHtmlWithEncoding(path);
    };

    try {
      const id = episode.id;
      const baseDir = episode.contentPath.includes('/') ? episode.contentPath.slice(0, episode.contentPath.lastIndexOf('/') + 1) : '/';
      // Load HTML only (.htm or .html)
      const content = (await tryLoad(`${baseDir}${id}.htm`)) || (await tryLoad(`${baseDir}${id}.html`));

      if (content) {
        setEpisodeIsHtml(true);
        setEpisodeContent(content);
      } else {
        setEpisodeIsHtml(false);
        setEpisodeContent('# Content Not Available\n\nThe episode HTML is missing.');
      }
    } catch (error) {
      setEpisodeIsHtml(false);
      setEpisodeContent('# Content Loading Error\n\nUnable to load the episode content. Please try again later.');
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handlers for DiscussionForum
  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        user: user.email,
        text: newComment,
        timestamp: new Date(),
        likes: 0,
        replies: []
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const handleReplySubmit = (commentId: string) => {
    if (replyText.trim()) {
      const reply = {
        id: `${commentId}-${Date.now()}`,
        user: user.email,
        text: replyText,
        timestamp: new Date(),
        likes: 0
      };

      setComments(comments.map(comment =>
        comment.id === commentId
          ? { ...comment, replies: [...(comment.replies || []), reply] }
          : comment
      ));
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const handleLikeComment = (commentId: string, isReply?: boolean, parentId?: string) => {
    if (isReply && parentId) {
      setComments(comments.map(comment =>
        comment.id === parentId
          ? {
              ...comment,
              replies: comment.replies?.map(reply =>
                reply.id === commentId
                  ? { ...reply, likes: reply.likes + 1 }
                  : reply
              ) || []
            }
          : comment
      ));
    } else {
      setComments(comments.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      ));
    }
  };

  const handleReportComment = (commentId: string, isReply?: boolean, parentId?: string) => {
    // Simple report functionality
    console.log('Reported comment:', commentId);
  };

  const handleModerateComment = (commentId: string, action: 'approve' | 'remove', isReply?: boolean, parentId?: string) => {
    // Simple moderation functionality
    console.log('Moderated comment:', commentId, action);
  };

  // Handlers for SupportingContent
  const handleAudioControl = (action: 'play' | 'pause' | 'stop' | 'forward' | 'backward') => {
    console.log('Audio control:', action);
    // Simple audio control simulation
    if (action === 'play') {
      setAudioState('playing');
    } else if (action === 'pause') {
      setAudioState('paused');
    } else if (action === 'stop') {
      setAudioState('stopped');
      setAudioProgress(0);
    }
  };

  const handleVideoPlay = () => {
    console.log('Video play requested');
    alert('Video playback would start here');
  };

  const handleSupportingContentClick = (url: string, isDownload?: boolean) => {
    console.log('Supporting content click:', url, 'isDownload:', isDownload);
    if (isDownload) {
      alert(`Download would start for: ${url}`);
    } else {
      window.open(url, '_blank');
    }
  };

  const handleNotebookOpen = () => {
    console.log('Notebook open requested');
    alert('Notebook feature would open here');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handlers for login/register functionality
  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: 0
    }}>
      

      {/* Main Content Area - 3 Frame Horizontal Layout */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '20% 1fr 20%',
        overflow: 'hidden',
        minHeight: 0
      }}>
        {/* Frame 1.0 - Left Panel (20%) */}
        <div className="left-panel" style={{ overflowY: 'auto' }}>
          <div className="p-4" style={{ width: 'auto', alignSelf: 'stretch' }}>
            <h2 className="text-lg font-bold text-gray-900 mb-4 px-2">ARCHITECTS FORUM</h2>
            {chapters.map((chapter) => (
              <ChapterSection
                key={chapter.id}
                chapter={chapter}
                selectedEpisode={selectedEpisode}
                onEpisodeSelect={handleEpisodeSelect}
                formatDate={formatDate}
              />
            ))}
          </div>
        </div>

        {/* Frame 2.0 - Middle Panel (60%) */}
        <div style={{
          display: 'grid',
          gridTemplateRows: 'auto minmax(0, 1fr)',
          overflow: 'hidden',
          minHeight: 0
        }}>
          {/* Frame 2.1 - Top Section (5% of middle panel) */}
          <div className="supporting-content" style={{ padding: '4px' }}>
            {selectedEpisode ? (
              <div className="w-full p-2">
                <h3 className="text-xs font-semibold text-gray-900 mb-2">SUPPORTING CONTENT</h3>

                {/* 4 equally-stretched supporting content elements */}
                <div className="grid grid-cols-4 gap-1 w-full mb-2">
                  {/* Audio Podcast */}
                  <button
                    onClick={() => selectedEpisode.audioPath && handleAudioControl('play')}
                    disabled={!selectedEpisode.audioPath}
                    className={`flex items-center justify-center space-x-1 px-2 py-1 text-xs border-0 transition-colors ${selectedEpisode.audioPath
                        ? 'bg-gray-900 hover:bg-gray-800 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>PODCAST</span>
                  </button>

                  {/* Video */}
                  <button
                    onClick={() => selectedEpisode.videoPath && handleVideoPlay()}
                    disabled={!selectedEpisode.videoPath}
                    className={`flex items-center justify-center space-x-1 px-2 py-1 text-xs border-0 transition-colors ${selectedEpisode.videoPath
                        ? 'bg-gray-900 hover:bg-gray-800 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>VIDEO</span>
                  </button>

                  {/* Study Guide */}
                  <button
                    onClick={() => selectedEpisode.studyGuidePath && handleSupportingContentClick(`/lessons/${selectedEpisode.id}/${selectedEpisode.id}studyguide.pdf`, true)}
                    disabled={!selectedEpisode.studyGuidePath}
                    className={`flex items-center justify-center space-x-1 px-2 py-1 text-xs border-0 transition-colors ${selectedEpisode.studyGuidePath
                        ? 'bg-gray-900 hover:bg-gray-800 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>STUDY GUIDE</span>
                  </button>

                  {/* Brief */}
                  <button
                    onClick={() => selectedEpisode.briefPath && handleSupportingContentClick(`/lessons/${selectedEpisode.id}/${selectedEpisode.id}brief.pdf`, true)}
                    disabled={!selectedEpisode.briefPath}
                    className={`flex items-center justify-center space-x-1 px-2 py-1 text-xs border-0 transition-colors ${selectedEpisode.briefPath
                        ? 'bg-gray-900 hover:bg-gray-800 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>BRIEF</span>
                  </button>
                </div>

                {/* Compact Audio Controls */}
                {selectedEpisode.audioPath && audioState !== 'stopped' && (
                  <div className="flex items-center space-x-2 bg-gray-100 px-2 py-1 border-l-2 border-gray-900">
                    <div className="flex items-center space-x-1">
                      <button onClick={() => handleAudioControl('backward')} className="text-gray-900 hover:text-gray-700 text-xs">
                        ⏮
                      </button>
                      <button onClick={() => handleAudioControl(audioState === 'playing' ? 'pause' : 'play')} className="text-gray-900 hover:text-gray-700 text-xs">
                        {audioState === 'playing' ? '⏸' : '▶'}
                      </button>
                      <button onClick={() => handleAudioControl('stop')} className="text-gray-900 hover:text-gray-700 text-xs">
                        ⏹
                      </button>
                      <button onClick={() => handleAudioControl('forward')} className="text-gray-900 hover:text-gray-700 text-xs">
                        ⏭
                      </button>
                    </div>
                    <div className="flex items-center space-x-1 flex-1 min-w-0">
                      <div className="flex-1 bg-gray-300 h-1 min-w-[40px]">
                        <div
                          className="bg-gray-900 h-1"
                          style={{ width: `${(audioProgress / audioDuration) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-900 flex-shrink-0 min-w-[40px]">
                        {formatTime(audioProgress)}/{formatTime(audioDuration)}
                      </span>
                    </div>
                    <button
                      onClick={handleNotebookOpen}
                      className="bg-gray-900 text-white px-1 py-0.5 text-xs hover:bg-gray-800 flex-shrink-0"
                    >
                      ASK
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full p-2">
                <h3 className="text-xs font-semibold text-gray-900 mb-1">SUPPORTING CONTENT</h3>
                <p className="text-gray-500 text-xs">Select an episode to view supporting content</p>
              </div>
            )}
          </div>

          {/* Frame 2.2 - Bottom Section (95% of middle panel) */}
          <div className="content-area" style={{ overflowY: 'auto', minHeight: 0, height: '100%' }}>
            {selectedEpisode ? (
              episodeIsHtml ? (
                <HtmlRenderer html={episodeContent} basePath={`/lessons/${selectedEpisode.id}/`} />
              ) : (
                <MarkdownRenderer content={episodeContent} selectedEpisode={selectedEpisode} />
              )
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <h3 className="text-lg font-medium mb-2">SELECT AN EPISODE TO BEGIN</h3>
                  <p className="text-sm">Choose from the left panel to view episode content</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Frame 3.0 - Right Panel (20%) */}
        <div className="right-panel" style={{ overflowY: 'auto' }}>
          {selectedEpisode ? (
            <DiscussionForum
              comments={comments}
              newComment={newComment}
              setNewComment={setNewComment}
              user={user ? { id: user.id, email: user.email } : null}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              showModeration={showModeration}
              setShowModeration={setShowModeration}
              handleCommentSubmit={handleCommentSubmit}
              handleReplySubmit={handleReplySubmit}
              handleLikeComment={handleLikeComment}
              handleReportComment={handleReportComment}
              handleModerateComment={handleModerateComment}
              isProminent={true}
              hideModeration={true}
              onLogin={handleLogin}
              onRegister={handleRegister}
            />
          ) : (
            <div className="w-full p-2">
              <h3 className="text-xs font-semibold text-gray-900 mb-2">DISCUSSION FORUM</h3>
              <p className="text-gray-500 text-xs">Select an episode to view discussion</p>
            </div>
          )}
        </div>
      </div>

      {/* Actual Footer Component */}
    </div>
  );
};

export default SimpleTestPage;
