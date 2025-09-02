import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  selectedEpisode: {
    id: string;
  };
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, selectedEpisode }) => {
  return (
    <div className="prose prose-lg max-w-none px-3 font-normal">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-[rgba(74,144,226,1)] mb-6 border-b-2 border-gray-900 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-gray-900 mb-4 mt-8">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold text-gray-900 mb-2 mt-4">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm font-semibold text-gray-900 mb-2 mt-3">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-semibold text-gray-700 mb-2 mt-3">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="text-gray-800 mb-4 leading-relaxed text-sm">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-none space-y-2 mb-4 pl-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-none space-y-2 mb-4 pl-0 counter-reset-[item]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start space-x-3 text-sm text-gray-800 before:content-['▪'] before:text-gray-900 before:font-bold before:min-w-[20px]">
              <span className="flex-1">{children}</span>
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-900 pl-4 py-2 my-4 bg-gray-50 italic text-sm text-gray-700">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-gray-100 text-gray-900 px-1 py-0.5 font-mono text-xs border border-gray-300">
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-gray-900 text-white p-4 overflow-x-auto my-4 font-mono text-xs">
                <code>{children}</code>
              </pre>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-gray-300 text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-bold text-gray-900">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-4 py-2 text-gray-800">
              {children}
            </td>
          ),
          img: ({ src, alt }) => {
            const raw = (src || '').trim();
            // Unwrap angle brackets used in reference definitions: <...>
            const unwrapped = raw.startsWith('<') && raw.endsWith('>') ? raw.slice(1, -1).trim() : raw;
            const isData = unwrapped.startsWith('data:');
            const isHttp = unwrapped.startsWith('http://') || unwrapped.startsWith('https://');
            let imagePath = unwrapped;
            if (!isData && !isHttp) {
              if (imagePath.startsWith('/img/')) {
                imagePath = imagePath.replace('/img/', '');
              }
              imagePath = imagePath.startsWith('/') ? imagePath : `/lessons/${selectedEpisode.id}/${imagePath}`;
            }
            return (
              <img
                src={isData || isHttp ? unwrapped : imagePath}
                alt={alt}
                className="max-w-full h-auto border border-gray-300 shadow-sm my-6 block"
              />
            );
          },
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-gray-900 underline hover:text-gray-700 font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-800">
              {children}
            </em>
          ),
          hr: () => (
            <hr className="my-8 border-t-2 border-gray-900" />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
