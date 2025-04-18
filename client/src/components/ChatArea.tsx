import { useEffect, useRef } from "react";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  type: string;
}

interface ChatAreaProps {
  messages: Message[];
  currentUser: User;
  partner: User | null;
}

export default function ChatArea({ messages, currentUser, partner }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div id="chat-messages" className="flex-1 p-6 overflow-y-auto bg-white">
      {messages.length === 0 && (
        <div className="flex justify-center mb-6">
          <div className="bg-neutral-100 text-neutral-700 rounded-full px-4 py-2 text-sm">
            Welcome to Bolo&Seekho! Click "Next Partner" to start.
          </div>
        </div>
      )}
      
      {messages.map(message => {
        if (message.type === "system") {
          return (
            <div key={message.id} className="flex justify-center mb-6 system-message">
              <div className="bg-neutral-100 text-neutral-700 rounded-full px-4 py-2 text-sm">
                {message.content}
              </div>
            </div>
          );
        }
        
        const isCurrentUser = message.senderId === currentUser.id;
        const avatarText = isCurrentUser ? currentUser.avatar : (partner ? partner.avatar : "??");
        
        return (
          <div 
            key={message.id} 
            className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'mb-4'} mb-4`}
          >
            <div 
              className={`h-8 w-8 rounded-full ${isCurrentUser ? 'bg-primary/10 text-primary ml-2' : 'bg-secondary/10 text-secondary mr-2'} flex items-center justify-center text-sm font-bold flex-shrink-0`}
            >
              {avatarText}
            </div>
            <div 
              className={`${isCurrentUser ? 'bg-primary/10 text-neutral-800 rounded-tr-none' : 'bg-neutral-100 rounded-tl-none'} rounded-2xl px-4 py-2 max-w-[80%]`}
            >
              <p>{message.content}</p>
              <span className="text-xs text-neutral-500 mt-1 block">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
