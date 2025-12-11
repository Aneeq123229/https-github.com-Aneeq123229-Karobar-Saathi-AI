import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  isRtl?: boolean;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isRtl = false }) => {
  return (
    <div className={`prose prose-slate max-w-none ${isRtl ? 'urdu-text text-right' : 'text-left'}`}>
      <ReactMarkdown
        components={{
          h1: ({node, ...props}) => <h1 className="text-xl font-bold text-emerald-800 mb-2 mt-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-lg font-bold text-emerald-700 mb-2 mt-3" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-md font-semibold text-emerald-600 mb-1 mt-2" {...props} />,
          ul: ({node, ...props}) => <ul className={`list-disc ${isRtl ? 'pr-5' : 'pl-5'} space-y-1 mb-2`} {...props} />,
          ol: ({node, ...props}) => <ol className={`list-decimal ${isRtl ? 'pr-5' : 'pl-5'} space-y-1 mb-2`} {...props} />,
          li: ({node, ...props}) => <li className="text-slate-700" {...props} />,
          strong: ({node, ...props}) => <strong className="font-bold text-slate-900" {...props} />,
          p: ({node, ...props}) => <p className="mb-2 text-slate-700 leading-relaxed" {...props} />,
          a: ({node, ...props}) => <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;