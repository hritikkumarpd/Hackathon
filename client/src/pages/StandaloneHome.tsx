import { useState, useEffect } from 'react';
import ConnectionStatus from "@/components/ConnectionStatus";
import UserProfile from "@/components/UserProfile";
import ChatArea from "@/components/ChatArea";
import ChatInput from "@/components/ChatInput";
import AudioControls from "@/components/AudioControls";
import { Badge } from "@/components/ui/badge";
import { websocket } from "@/lib/websocket";

export default function StandaloneHome() {
  const [connectionState, setConnectionState] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [isMuted, setIsMuted] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<{id: string, name: string, avatar: string}[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [messages, setMessages] = useState([
    {
      id: "1",
      content: "Welcome to Bolo&Seekho! Click 'Find Partner' to start practicing English.",
      senderId: "system",
      senderName: "System",
      timestamp: Date.now(),
      type: "system"
    }
  ]);

  const [currentUser] = useState({
    id: crypto.randomUUID(),
    name: "You",
    avatar: "YO"
  });

  const [partner, setPartner] = useState<{id: string, name: string, avatar: string} | null>(null);

  useEffect(() => {
    if (websocket) {
      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'users_update') {
          setOnlineUsers(data.users);
          setOnlineCount(data.users.length);
        } else if (data.type === 'partner_connected') {
          setPartner(data.partner);
          setConnectionState('connected');
        } else if (data.type === 'message') {
          addMessage(data.message);
        }
      };
    }
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const findNextPartner = () => {
    if (partner) {
      addMessage({
        id: crypto.randomUUID(),
        content: `You've disconnected from ${partner.name}.`,
        senderId: "system",
        senderName: "System",
        timestamp: Date.now(),
        type: "system"
      });
    }

    setPartner(null);
    setConnectionState("connecting");

    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({
        type: "find_partner",
        userId: currentUser.id,
        userName: currentUser.name
      }));
    }

    addMessage({
      id: crypto.randomUUID(),
      content: "Looking for a partner...",
      senderId: "system",
      senderName: "System",
      timestamp: Date.now(),
      type: "system"
    });
  };

  const sendMessage = (content: string) => {
    if (!content.trim() || !partner) return;

    const message = {
      id: crypto.randomUUID(),
      content,
      senderId: currentUser.id,
      senderName: currentUser.name,
      timestamp: Date.now(),
      type: "text"
    };

    addMessage(message);

    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({
        type: "message",
        to: partner.id,
        message
      }));
    }
  };

  const addMessage = (message: any) => {
    setMessages(prev => [...prev, message]);
  };

  return (
    <main className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row h-[95vh] lg:h-[85vh] mx-auto my-4">
      <header className="bg-primary text-white p-4 flex items-center justify-between lg:hidden">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Bolo&Seekho</h1>
          <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
            {onlineCount} online
          </Badge>
        </div>
        <div className="text-sm">
          {connectionState === "connected" ? (
            <span className="inline-flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-1"></span>
              Connected
            </span>
          ) : connectionState === "connecting" ? (
            <span className="inline-flex items-center">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse mr-1"></span>
              Connecting...
            </span>
          ) : (
            <span className="inline-flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-400 mr-1"></span>
              Disconnected
            </span>
          )}
        </div>
      </header>

      <aside className="lg:w-1/3 border-r border-neutral-200 flex flex-col">
        <header className="hidden lg:block bg-primary text-white p-6">
          <h1 className="text-2xl font-bold">Bolo&Seekho</h1>
          <p className="text-sm mt-1 opacity-80">Practice English with new friends</p>
        </header>

        <div className="bg-neutral-50 p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Connection Status</h2>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {onlineCount} online
            </Badge>
          </div>

          <div className="flex items-center gap-2 mb-4">
            {connectionState === "connected" ? (
              <>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-medium">Connected</span>
              </>
            ) : connectionState === "connecting" ? (
              <>
                <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                <span className="font-medium">Connecting...</span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="font-medium">Disconnected</span>
              </>
            )}
          </div>

          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between list-none font-medium text-sm text-neutral-600 hover:text-primary">
              <span>Users Online</span>
              <span className="transition group-open:rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </summary>
            <div className="mt-3 max-h-36 overflow-y-auto flex flex-wrap gap-1.5">
              {onlineUsers.map(user => (
                <Badge key={user.id} variant="outline" className="flex items-center gap-1 p-1 pl-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  {user.name}
                </Badge>
              ))}
            </div>
          </details>
        </div>

        <div className="p-6 border-b border-neutral-200 flex-1">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Your Profile</h2>
            <UserProfile 
              user={currentUser}
              description="English Learner"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Partner</h2>
            {partner ? (
              <UserProfile 
                user={partner}
                description="English Learner"
                isPartner={true}
              />
            ) : (
              <div className="flex items-center waiting-for-partner">
                <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-400 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-neutral-400">
                    {connectionState === "connecting" 
                      ? "Finding partner..." 
                      : "Waiting for partner..."}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="block h-2 w-2 rounded-full bg-neutral-300 animate-pulse"></span>
                    <span className="block h-2 w-2 rounded-full bg-neutral-300 animate-pulse ml-1" style={{animationDelay: '300ms'}}></span>
                    <span className="block h-2 w-2 rounded-full bg-neutral-300 animate-pulse ml-1" style={{animationDelay: '600ms'}}></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 border-t border-neutral-200">
          <div className="flex flex-col space-y-4">
            <button
              onClick={findNextPartner}
              className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
            >
              {connectionState === "connected" ? "Next Partner" : "Find Partner"}
            </button>

            <button
              onClick={toggleMute}
              className={`w-full py-2 px-4 font-medium rounded-lg transition-colors ${
                isMuted
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {isMuted ? "Unmute Microphone" : "Mute Microphone"}
            </button>
          </div>
        </div>
      </aside>

      <section className="lg:w-2/3 flex flex-col h-full">
        <ChatArea 
          messages={messages}
          currentUser={currentUser}
          partner={partner}
        />
        <ChatInput 
          sendMessage={sendMessage}
          isDisabled={connectionState !== "connected"}
        />
      </section>
    </main>
  );
}