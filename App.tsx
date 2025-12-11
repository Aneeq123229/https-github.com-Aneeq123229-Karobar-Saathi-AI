import React, { useState, useRef, useEffect } from 'react';
import { Send, Store, TrendingUp, Lightbulb, ShoppingBag, Menu, MessageSquarePlus, X } from 'lucide-react';
import { Message } from './types';
import { sendMessageToGemini } from './services/gemini';
import ChatMessage from './components/ChatMessage';
import QuickPromptCard from './components/QuickPromptCard';

// Initial suggestions for the user
const SUGGESTIONS = [
  {
    id: '1',
    title: 'Start a Small Shop',
    description: 'How to start a grocery store (Kiryana) with 5 Lakh PKR?',
    prompt: 'Mujhe 5 Lakh PKR mein Kiryana store shuru karna hai. Mukammal plan batayen.',
    icon: <Store size={20} />
  },
  {
    id: '2',
    title: 'Online Selling',
    description: 'Guide to selling on Daraz or Facebook Marketplace.',
    prompt: 'Main Daraz aur Facebook par cheezain bechna chahta hoon. Kaise shuru karoon?',
    icon: <ShoppingBag size={20} />
  },
  {
    id: '3',
    title: 'Student Side Hustle',
    description: 'Low investment business ideas for university students.',
    prompt: 'Main student hoon. Kam investment mein koi business idea batayen.',
    icon: <Lightbulb size={20} />
  },
  {
    id: '4',
    title: 'Marketing Strategy',
    description: 'How to promote a food stall using WhatsApp?',
    prompt: 'Mere food stall ki sale barhane ke liye WhatsApp marketing kaise karoon?',
    icon: <TrendingUp size={20} />
  }
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const responseText = await sendMessageToGemini(messages, text);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "Maaf kijiye, kuch takneeki kharabi hai. Dobara koshish karein.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const startNewChat = () => {
    setMessages([]);
    setInputText('');
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile by default */}
      <aside className={`
        fixed md:relative z-30 w-64 h-full bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-2 font-bold text-emerald-700 text-lg">
             <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
               <Store size={18} />
             </div>
             Karobar Saathi
           </div>
           <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-500">
             <X size={20} />
           </button>
        </div>

        <div className="p-4 flex-grow overflow-y-auto">
          <button 
            onClick={startNewChat}
            className="w-full flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-medium text-sm mb-6"
          >
            <MessageSquarePlus size={18} />
            New Chat
          </button>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">About</h3>
            <div className="px-2 text-sm text-slate-600 leading-relaxed">
              <p>Karobar Saathi is your personal AI business consultant tailored for Pakistan.</p>
              <p className="mt-2 text-xs text-slate-400">Powered by Google Gemini</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full w-full relative">
        
        {/* Header (Mobile only menu trigger) */}
        <div className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-sm flex items-center px-4 justify-between md:hidden z-10 sticky top-0">
          <div className="flex items-center gap-2 font-bold text-emerald-700">
             <Store size={20} />
             <span>Karobar Saathi</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="text-slate-600 p-2 rounded-md hover:bg-slate-100">
            <Menu size={24} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 scroll-smooth">
          <div className="max-w-3xl mx-auto">
            
            {/* Empty State */}
            {messages.length === 0 && (
              <div className="py-8 md:py-12 flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-200">
                  <Store size={36} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 text-center mb-2">
                  Salam! <span className="text-emerald-600">Karobar Saathi</span> here.
                </h1>
                <p className="text-slate-500 text-center max-w-md mb-10">
                  I can help you with business ideas, marketing strategies, and cost estimations for the Pakistani market.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {SUGGESTIONS.map((suggestion) => (
                    <QuickPromptCard 
                      key={suggestion.id}
                      title={suggestion.title}
                      description={suggestion.description}
                      icon={suggestion.icon}
                      onClick={() => handleSendMessage(suggestion.prompt)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Message History */}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start w-full mb-6">
                <div className="flex gap-3 max-w-[80%]">
                   <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-sm">
                      <Store size={18} />
                   </div>
                   <div className="bg-white border border-slate-200 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                   </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
          <div className="max-w-3xl mx-auto relative">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask about business ideas, marketing, or costs..."
              className="w-full pl-5 pr-14 py-3.5 bg-slate-100 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all resize-none max-h-[120px] text-slate-800 placeholder:text-slate-400"
              style={{ minHeight: '52px' }}
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim() || isLoading}
              className="absolute right-2 bottom-2 p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors shadow-sm"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400">
              AI can make mistakes. Please verify important financial information.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}