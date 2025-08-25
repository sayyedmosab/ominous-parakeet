import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SimpleHeader from '../../components/SimpleHeader';

const allEpisodes = [
  '1.1','1.2','1.3','1.4',
  '2.1','2.2','2.3','2.4',
  '3.1','3.2','3.3','3.4',
  '4.1','4.2','4.3',
];

const JosoorExplorePage: React.FC = () => {
  const [selectedEpisode, setSelectedEpisode] = React.useState(null);
  const [lessonContent, setLessonContent] = React.useState('');
  const [episodeSummary, setEpisodeSummary] = React.useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = React.useState(false);
  const [completedEpisodes, setCompletedEpisodes] = React.useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('completedEpisodes') || '{}');
      } catch {
        return {};
      }
    }
    return {};
  });
  const episodeIdx = selectedEpisode ? allEpisodes.indexOf(selectedEpisode) : -1;
  const prevEpisode = episodeIdx > 0 ? allEpisodes[episodeIdx - 1] : null;
  const nextEpisode = episodeIdx >= 0 && episodeIdx < allEpisodes.length - 1 ? allEpisodes[episodeIdx + 1] : null;

  useEffect(() => {
    // Debug environment variables
    console.log('Environment check:', {
      hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
      hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      hasGoogleAiKey: !!import.meta.env.VITE_GOOGLE_AI_API_KEY,
      googleAiKeyLength: import.meta.env.VITE_GOOGLE_AI_API_KEY?.length || 0
    });
  }, []);

  useEffect(() => {
    document.title = 'AI Twin Tech - Josoor';
  }, []);

  React.useEffect(() => {
    if (selectedEpisode) {
      fetch(`/lessons/Episode ${selectedEpisode}.md`)
        .then(res => res.ok ? res.text() : '')
        .then(md => {
          // Replace image paths to point to lessons/img folder
          const processedMd = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
            // If the image path doesn't start with http or /, assume it's in lessons/img
            if (!src.startsWith('http') && !src.startsWith('/')) {
              return `![${alt}](/lessons/img/${src})`;
            }
            return match;
          });
          setLessonContent(processedMd || '');
        });
      setEpisodeSummary(''); // Clear previous summary
    } else {
      setLessonContent('');
      setEpisodeSummary('');
    }
  }, [selectedEpisode]);

  function handleEpisodeClick(num) {
    setSelectedEpisode(num);
  }
  function handlePrev() {
    if (prevEpisode) setSelectedEpisode(prevEpisode);
  }
  function handleNext() {
    if (nextEpisode) setSelectedEpisode(nextEpisode);
  }
  function handleComplete() {
    if (!selectedEpisode) return;
    const updated = { ...completedEpisodes, [selectedEpisode]: true };
    setCompletedEpisodes(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('completedEpisodes', JSON.stringify(updated));
    }
  }

  async function handleSummarizeEpisode() {
    if (!selectedEpisode || !lessonContent) {
      console.log('No episode selected or content loaded');
      return;
    }
    
    const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
    console.log('API Key check:', apiKey ? 'Key found' : 'No key found');
    
    if (!apiKey || apiKey === 'your_google_ai_api_key_here') {
      alert('Please set your Google AI API key in the .env file (VITE_GOOGLE_AI_API_KEY)');
      return;
    }
    
    setIsGeneratingSummary(true);
    setEpisodeSummary('Generating summary...');
    
    try {
      console.log('Making API request to Google AI...');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `CRITICAL: Extract exactly 3 specific learning concepts from this lesson where they jointly capture the essence of the lesson. Avoid generic business jargon.

Layout EXACTLY like this with line breaks between bullets:

• <two word learning concept>: <Clear, concrete explanation using simple language>

• <two word learning concept>: <Clear, concrete explanation using simple language>

• <two word learning concept>: <Clear, concrete explanation using simple language>

REQUIREMENTS:
- Each learning concept must be HTML BOLDED and exactly 2 words, very specific to the lesson content
- NO generic terms like "Change Management", "Strategic Planning", "Process Improvement"
- Use concrete, specific terminology from the actual lesson
- Explanations must be practical and specific, not consultant buzzwords
- Write like you're explaining to a smart 16-year-old
- Focus on WHAT and HOW, not abstract concepts
- MUST include blank lines between each bullet point

BAD EXAMPLE: "Change Integration: Combining different approaches for transformation"
GOOD EXAMPLE: "Capability Gaps: The missing link between strategy and execution, where execution on the ground focuses on syncing closing operational gaps necessary to meet strategic objectives"

Lesson content:
${lessonContent.substring(0, 4000)}`
            }]
          }]
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      let summary = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate summary';
      
      // Parse and clean the AI response - remove ** and apply proper formatting
      summary = summary
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **text** to <strong>text</strong>
        .replace(/\*/g, '') // Remove any remaining single asterisks
        .trim();
      
      setEpisodeSummary(summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setEpisodeSummary(`Error generating summary: ${error.message}`);
    } finally {
      setIsGeneratingSummary(false);
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen w-full">
      <SimpleHeader logoSrc="/images/josoorlogo.png" logoAlt="Josoor" />
      <div className="w-full flex flex-row h-[80vh] px-0">
        {/* Left Frame (15%) - Architect Series Navigation */}
        <div className="h-full border-r border-gray-300 bg-gray-100 text-black flex flex-col" style={{ width: '15%', minWidth: '180px' }}>
          <div className="text-center font-bold text-lg py-4 px-2 border-b border-gray-200 sticky top-0 bg-gray-100 z-10">
            Think like an Architect Series
          </div>
          <div className="flex-1 px-3 py-2 space-y-4 overflow-y-auto overflow-x-hidden">
            {/* Chapter 1 */}
            {/* Chapter 1 */}
            <div>
              <div className="font-bold mb-1">CHAPTER 1: THE MECHANICS OF TRANSFORMATION</div>
              <div className="space-y-1">
                <div className="flex items-start justify-between pl-3">
                  <button 
                    onClick={() => handleEpisodeClick('1.1')} 
                    className={`hover:underline text-left flex-1 text-xs leading-relaxed break-words ${selectedEpisode === '1.1' ? 'text-blue-600 font-semibold' : ''} ${completedEpisodes['1.1'] ? 'text-green-600' : ''}`}
                  >
                    Episode 1.1: What is an Organizational Transformation?
                  </button>
                  <a href="/lessons/Episode 1.1.md" download className="text-blue-500 text-xs ml-1 flex-shrink-0" title="Download"><svg xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg></a>
                </div>
                <div className="flex items-start justify-between pl-3">
                  <button 
                    onClick={() => handleEpisodeClick('1.2')} 
                    className={`hover:underline text-left flex-1 text-xs leading-relaxed break-words ${selectedEpisode === '1.2' ? 'text-blue-600 font-semibold' : ''} ${completedEpisodes['1.2'] ? 'text-green-600' : ''}`}
                  >
                    Episode 1.2: What is a Sector Transformation?
                  </button>
                  <a href="/lessons/Episode 1.2.md" download className="text-blue-500 text-xs ml-1 flex-shrink-0" title="Download"><svg xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg></a>
                </div>
                <div className="flex items-start justify-between pl-3">
                  <button 
                    onClick={() => handleEpisodeClick('1.3')} 
                    className={`hover:underline text-left flex-1 text-xs leading-relaxed break-words ${selectedEpisode === '1.3' ? 'text-blue-600 font-semibold' : ''} ${completedEpisodes['1.3'] ? 'text-green-600' : ''}`}
                  >
                    Episode 1.3: The People Transformation
                  </button>
                  <a href="/lessons/Episode 1.3.md" download className="text-blue-500 text-xs ml-1 flex-shrink-0" title="Download"><svg xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg></a>
                </div>
                <div className="flex items-start justify-between pl-3">
                  <button 
                    onClick={() => handleEpisodeClick('1.4')} 
                    className={`hover:underline text-left flex-1 text-xs leading-relaxed break-words ${selectedEpisode === '1.4' ? 'text-blue-600 font-semibold' : ''} ${completedEpisodes['1.4'] ? 'text-green-600' : ''}`}
                  >
                    Episode 1.4: The Entangled Transformation
                  </button>
                  <a href="/lessons/Episode 1.4.md" download className="text-blue-500 text-xs ml-1 flex-shrink-0" title="Download"><svg xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg></a>
                </div>
              </div>
            </div>
            {/* Chapter 2 */}
            <div>
              <div className="font-bold mb-1">CHAPTER 2: THE ARCHITECTURAL BLUEPRINT IN PRACTICE</div>
              <div className="space-y-1">
                <div className="flex items-start justify-between pl-3">
                  <button 
                    onClick={() => handleEpisodeClick('2.1')} 
                    className={`hover:underline text-left flex-1 text-xs leading-relaxed break-words ${selectedEpisode === '2.1' ? 'text-blue-600 font-semibold' : ''} ${completedEpisodes['2.1'] ? 'text-green-600' : ''}`}
                  >
                    Episode 2.1: Strategic Performance (KPIs)
                  </button>
                  <a href="/lessons/Episode 2.1.md" download className="text-blue-500 text-xs ml-1 flex-shrink-0" title="Download"><svg xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg></a>
                </div>
                <div className="flex items-start justify-between pl-3">
                  <button 
                    onClick={() => handleEpisodeClick('2.2')} 
                    className={`hover:underline text-left flex-1 text-xs leading-relaxed break-words ${selectedEpisode === '2.2' ? 'text-blue-600 font-semibold' : ''} ${completedEpisodes['2.2'] ? 'text-green-600' : ''}`}
                  >
                    Episode 2.2: Portfolios & Initiatives
                  </button>
                  <a href="/lessons/Episode 2.2.md" download className="text-blue-500 text-xs ml-1 flex-shrink-0" title="Download"><svg xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg></a>
                </div>
                <div className="flex items-start justify-between pl-3">
                  <button 
                    onClick={() => handleEpisodeClick('2.3')} 
                    className={`hover:underline text-left flex-1 text-xs leading-relaxed break-words ${selectedEpisode === '2.3' ? 'text-blue-600 font-semibold' : ''} ${completedEpisodes['2.3'] ? 'text-green-600' : ''}`}
                  >
                    Episode 2.3: Process Architecture
                  </button>
                  <a href="/lessons/Episode 2.3.md" download className="text-blue-500 text-xs ml-1 flex-shrink-0" title="Download"><svg xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg></a>
                </div>
                <div className="flex items-start justify-between pl-3">
                  <button 
                    onClick={() => handleEpisodeClick('2.4')} 
                    className={`hover:underline text-left flex-1 text-xs leading-relaxed break-words ${selectedEpisode === '2.4' ? 'text-blue-600 font-semibold' : ''} ${completedEpisodes['2.4'] ? 'text-green-600' : ''}`}
                  >
                    Episode 2.4: Organizational Design
                  </button>
                  <a href="/lessons/Episode 2.4.md" download className="text-blue-500 text-xs ml-1 flex-shrink-0" title="Download"><svg xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg></a>
                </div>
              </div>
            </div>
            {/* Chapter 3 */}
            <div>
              <div className="font-bold mb-1">CHAPTER 3: THE MANAGEMENT OPERATING SYSTEM</div>
              <div className="space-y-1">
                <div className="flex items-start justify-between pl-3">
                  <button 
                    onClick={() => handleEpisodeClick('3.1')} 
                    className={`hover:underline text-left flex-1 text-xs leading-relaxed break-words ${selectedEpisode === '3.1' ? 'text-blue-600 font-semibold' : ''} ${completedEpisodes['3.1'] ? 'text-green-600' : ''}`}
                  >
                    Episode 3.1: The Integrated Governance
                  </button>
                  <a href="/lessons/Episode 3.1.md" download className="text-blue-500 text-xs ml-1 flex-shrink-0" title="Download"><svg xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg></a>
                </div>
                <div className="flex items-start justify-between pl-3">
                  <button 
                    onClick={() => handleEpisodeClick('3.2')} 
                    className={`hover:underline text-left flex-1 text-xs leading-relaxed break-words ${selectedEpisode === '3.2' ? 'text-blue-600 font-semibold' : ''} ${completedEpisodes['3.2'] ? 'text-green-600' : ''}`}
                  >
                    Episode 3.2: Strategic Change Management
                  </button>
                  <a href="/lessons/Episode 3.2.md" download className="text-blue-500 text-xs ml-1 flex-shrink-0" title="Download"><svg xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg></a>
                </div>
                <div className="flex items-start justify-between pl-3">
                  <button 
                    onClick={() => handleEpisodeClick('3.3')} 
                    className={`hover:underline text-left flex-1 text-xs leading-relaxed break-words ${selectedEpisode === '3.3' ? 'text-blue-600 font-semibold' : ''} ${completedEpisodes['3.3'] ? 'text-green-600' : ''}`}
                  >
                    Episode 3.3: Business Intelligence & Analytics
                  </button>
                  <a href="/lessons/Episode 3.3.md" download className="text-blue-500 text-xs ml-1 flex-shrink-0" title="Download"><svg xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg></a>
                </div>
                <div className="flex items-start justify-between pl-3">
                  <button 
                    onClick={() => handleEpisodeClick('3.4')} 
                    className={`hover:underline text-left flex-1 text-xs leading-relaxed break-words ${selectedEpisode === '3.4' ? 'text-blue-600 font-semibold' : ''} ${completedEpisodes['3.4'] ? 'text-green-600' : ''}`}
                  >
                    Episode 3.4: Risk Management & Compliance
                  </button>
                  <a href="/lessons/Episode 3.4.md" download className="text-blue-500 text-xs ml-1 flex-shrink-0" title="Download"><svg xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg></a>
                </div>
              </div>
            </div>
            {/* Chapter 4 */}
            <div>
              <div className="font-bold mb-1">CHAPTER 4: THE TRANSFORMATION EXECUTION</div>
              <div className="space-y-1">
                <div className="flex items-start justify-between pl-3">
                  <button 
                    onClick={() => handleEpisodeClick('4.1')} 
                    className={`hover:underline text-left flex-1 text-xs leading-relaxed break-words ${selectedEpisode === '4.1' ? 'text-blue-600 font-semibold' : ''} ${completedEpisodes['4.1'] ? 'text-green-600' : ''}`}
                  >
                    Episode 4.1: Implementation Planning
                  </button>
                  <a href="/lessons/Episode 4.1.md" download className="text-blue-500 text-xs ml-1 flex-shrink-0" title="Download"><svg xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg></a>
                </div>
                <div className="flex items-start justify-between pl-3">
                  <button 
                    onClick={() => handleEpisodeClick('4.2')} 
                    className={`hover:underline text-left flex-1 text-xs leading-relaxed break-words ${selectedEpisode === '4.2' ? 'text-blue-600 font-semibold' : ''} ${completedEpisodes['4.2'] ? 'text-green-600' : ''}`}
                  >
                    Episode 4.2: Monitoring & Control
                  </button>
                  <a href="/lessons/Episode 4.2.md" download className="text-blue-500 text-xs ml-1 flex-shrink-0" title="Download"><svg xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg></a>
                </div>
                <div className="flex items-start justify-between pl-3">
                  <button 
                    onClick={() => handleEpisodeClick('4.3')} 
                    className={`hover:underline text-left flex-1 text-xs leading-relaxed break-words ${selectedEpisode === '4.3' ? 'text-blue-600 font-semibold' : ''} ${completedEpisodes['4.3'] ? 'text-green-600' : ''}`}
                  >
                    Episode 4.3: Continuous Improvement
                  </button>
                  <a href="/lessons/Episode 4.3.md" download className="text-blue-500 text-xs ml-1 flex-shrink-0" title="Download"><svg xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Middle Frame (70%) - Lesson Content */}
        <div className="h-full bg-white flex flex-col" style={{ width: '70%', minWidth: '300px' }}>
          {/* Top Navigation Bar */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-2 flex justify-between items-center">
            <button 
              onClick={handlePrev}
              disabled={!prevEpisode}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${!prevEpisode ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-800'}`}
            >
              Previous
            </button>
            <button 
              onClick={handleComplete}
              disabled={!selectedEpisode}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${!selectedEpisode ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : (completedEpisodes[selectedEpisode] ? 'bg-green-700 text-white' : 'bg-green-600 text-white hover:bg-green-700')}`}
            >
              {completedEpisodes[selectedEpisode] ? '✓ Completed' : 'Mark Complete'}
            </button>
            <button 
              onClick={handleNext}
              disabled={!nextEpisode}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${!nextEpisode ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-800'}`}
            >
              Next
            </button>
          </div>
          {/* Lesson Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedEpisode ? (
              lessonContent ? (
                <div className="prose prose-lg max-w-none 
                  prose-headings:text-gray-900 prose-headings:font-bold 
                  prose-h1:text-3xl prose-h1:mb-6 prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-3
                  prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8
                  prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-blue-800
                  prose-h4:text-lg prose-h4:mb-2 prose-h4:mt-4 prose-h4:font-semibold prose-h4:text-blue-700
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-em:text-gray-600 prose-em:italic
                  prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
                  prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4
                  prose-li:mb-2 prose-li:text-gray-700
                  prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:underline
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:bg-blue-50 prose-blockquote:py-2
                  prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
                  prose-pre:bg-gray-800 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                  prose-img:rounded-lg prose-img:shadow-lg prose-img:border prose-img:border-gray-200">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      img: ({src, alt, ...props}) => {
                        // Fix image paths: convert /img/... to /lessons/img/...
                        const correctedSrc = src?.startsWith('/img/') ? `/lessons${src}` : src;
                        return (
                          <img 
                            src={correctedSrc} 
                            alt={alt} 
                            {...props}
                            className="max-w-full h-auto mx-auto block rounded-lg shadow-lg border border-gray-200 my-6"
                            onError={(e) => {
                              console.error(`Failed to load image: ${correctedSrc}`);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        );
                      },
                      h1: ({children, ...props}) => (
                        <h1 {...props} className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                          {children}
                        </h1>
                      ),
                      h2: ({children, ...props}) => (
                        <h2 {...props} className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                          {children}
                        </h2>
                      ),
                      h3: ({children, ...props}) => (
                        <h3 {...props} className="text-xl font-semibold text-blue-800 mb-3 mt-6">
                          {children}
                        </h3>
                      ),
                      h4: ({children, ...props}) => (
                        <h4 {...props} className="text-lg font-semibold text-blue-700 mb-2 mt-4">
                          {children}
                        </h4>
                      ),
                      p: ({children, ...props}) => (
                        <p {...props} className="text-gray-700 leading-relaxed mb-4">
                          {children}
                        </p>
                      ),
                      ul: ({children, ...props}) => (
                        <ul {...props} className="list-disc ml-6 mb-4 space-y-2">
                          {children}
                        </ul>
                      ),
                      ol: ({children, ...props}) => (
                        <ol {...props} className="list-decimal ml-6 mb-4 space-y-2">
                          {children}
                        </ol>
                      ),
                      li: ({children, ...props}) => (
                        <li {...props} className="text-gray-700 leading-relaxed">
                          {children}
                        </li>
                      ),
                      blockquote: ({children, ...props}) => (
                        <blockquote {...props} className="border-l-4 border-blue-500 pl-6 italic text-gray-600 bg-blue-50 py-3 my-4 rounded-r-lg">
                          {children}
                        </blockquote>
                      ),
                      code: ({children, ...props}) => (
                        <code {...props} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                          {children}
                        </code>
                      ),
                      strong: ({children, ...props}) => (
                        <strong {...props} className="font-semibold text-gray-900">
                          {children}
                        </strong>
                      ),
                      em: ({children, ...props}) => (
                        <em {...props} className="italic text-gray-600">
                          {children}
                        </em>
                      )
                    }}
                  >
                    {lessonContent}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-500">Loading lesson content...</span>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-500">Select an episode from the left to begin</span>
              </div>
            )}
          </div>
        </div>
        {/* Right Frame (15%) - Split Upper and Lower */}
        <div className="h-full bg-gray-50 border-l border-gray-300 flex flex-col" style={{ width: '15%', minWidth: '180px' }}>
          {/* Upper Section (10% of right frame) */}
          <div className="bg-blue-50 border-b border-gray-300 p-2 flex justify-center items-center" style={{ height: '10%' }}>
            <button 
              onClick={handleSummarizeEpisode}
              disabled={!selectedEpisode || !lessonContent || isGeneratingSummary}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${!selectedEpisode || !lessonContent || isGeneratingSummary ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {isGeneratingSummary ? '...' : 'Summarize Episode'}
            </button>
          </div>
          {/* Lower Section (90% of right frame) */}
          <div className="bg-white p-3 flex flex-col overflow-y-auto" style={{ height: '90%' }}>
            {episodeSummary ? (
              <div className="text-sm text-gray-700 leading-relaxed">
                <h4 className="font-semibold mb-2 text-gray-800">Episode Summary:</h4>
                <div 
                  className="whitespace-pre-wrap space-y-3" 
                  style={{ lineHeight: '1.8' }}
                  dangerouslySetInnerHTML={{ __html: episodeSummary }}
                />
              </div>
            ) : (
              <div className="text-xs text-gray-500 italic">
                Click "Summarize Episode" to generate an AI summary of the current lesson.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JosoorExplorePage;