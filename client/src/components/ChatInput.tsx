import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  sendMessage: (content: string) => void;
  isDisabled: boolean;
}

export default function ChatInput({ sendMessage, isDisabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      sendMessage(message);
      setMessage("");
    }
  };
  
  return (
    <div className="p-4 border-t border-neutral-200 bg-white">
      <form id="chat-form" className="flex items-center" onSubmit={handleSubmit}>
        <Input
          type="text"
          id="message-input"
          className="flex-1 rounded-r-none focus:ring-2 focus:ring-primary/50"
          placeholder={isDisabled ? "Connect with a partner to chat..." : "Type a message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isDisabled}
        />
        <Button 
          type="submit" 
          className="bg-primary text-white px-4 py-3 rounded-l-none hover:bg-primary/90 transition"
          disabled={isDisabled || !message.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </Button>
      </form>
    </div>
  );
}
