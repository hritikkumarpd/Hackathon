import { useAppContext } from "@/contexts/AppContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  type: string;
  sentiment?: number; // Added sentiment field
  language?: string; // Added language field
}

export default function ChatArea() {
  const { messages } = useAppContext();

  const getSentimentColor = (score: number) => {
    if (score > 0) return "bg-green-500";
    if (score < 0) return "bg-red-500";
    return "bg-gray-500";
  };

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.type === "system" ? "items-center" : "items-start"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">
                {message.type === "system" ? "System" : message.senderName}
              </span>
              {message.sentiment !== undefined && (
                <Badge variant="secondary" className={getSentimentColor(message.sentiment)}>
                  Sentiment: {message.sentiment}
                </Badge>
              )}
              {message.language && (
                <Badge variant="outline">
                  Language: {message.language}
                </Badge>
              )}
            </div>
            <div
              className={`rounded-lg px-4 py-2 ${
                message.type === "system"
                  ? "bg-gray-100 text-gray-600"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}