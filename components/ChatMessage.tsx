import React from 'react';
import { Message } from '../types';
import { Bot, User, AlertCircle } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  // Simple heuristic to detect if the text is predominantly Urdu characters
  // This helps apply the correct font and direction
  const isUrdu = /[\u0600-\u06FF]/.test(message.content);

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] lg:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-emerald-600'
        } shadow-sm`}>
          {isUser ? <User size={18} /> : <Bot size={18} />}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`relative px-5 py-3.5 rounded-2xl shadow-sm text-sm md:text-base ${
            isUser 
              ? 'bg-emerald-600 text-white rounded-tr-sm' 
              : message.isError 
                ? 'bg-red-50 border border-red-200 text-red-800 rounded-tl-sm' 
                : 'bg-white border border-slate-200 rounded-tl-sm'
          }`}>
            {message.isError ? (
               <div className="flex items-center gap-2">
                 <AlertCircle size={16} />
                 <span>{message.content}</span>
               </div>
            ) : (
              <div className={isUser ? 'text-white' : ''}>
                {isUser ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                ) : (
                  <MarkdownRenderer content={message.content} isRtl={isUrdu} />
                )}
              </div>
            )}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 px-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;