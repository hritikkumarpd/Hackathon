import { useAppContext } from "@/contexts/AppContext";
import ConnectionStatus from "@/components/ConnectionStatus";
import UserProfile from "@/components/UserProfile";
import ChatArea from "@/components/ChatArea";
import ChatInput from "@/components/ChatInput";
import AudioControls from "@/components/AudioControls";
import { useEffect } from "react";

export default function Home() {
  const { 
    connectionState, 
    currentUser, 
    partner, 
    messages, 
    sendMessage,
    findNextPartner,
    toggleMute,
    isMuted
  } = useAppContext();

  return (
    <main className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row h-[95vh] lg:h-[85vh] mx-auto my-4">
      {/* Mobile Header */}
      <header className="bg-primary text-white p-4 flex items-center justify-between lg:hidden">
        <h1 className="text-xl font-bold">Bolo&Seekho</h1>
        <ConnectionStatus isMobile={true} />
      </header>

      {/* Sidebar */}
      <aside className="lg:w-1/3 border-r border-neutral-200 flex flex-col">
        {/* Desktop Header */}
        <header className="hidden lg:block bg-primary text-white p-6">
          <h1 className="text-2xl font-bold">Bolo&Seekho</h1>
          <p className="text-sm mt-1 opacity-80">Practice English with new friends</p>
        </header>

        {/* Connection Status */}
        <div className="bg-neutral-50 p-6 border-b border-neutral-200">
          <h2 className="text-lg font-semibold mb-4">Connection Status</h2>
          <ConnectionStatus isMobile={false} />
        </div>

        {/* User Info */}
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
                  <i className="fas fa-user"></i>
                </div>
                <div>
                  <p className="font-medium text-neutral-400">
                    {connectionState === "connecting" 
                      ? "Finding partner..." 
                      : "Waiting for partner..."}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="block h-2 w-2 rounded-full bg-neutral-300 animate-pulse"></span>
                    <span className="block h-2 w-2 rounded-full bg-neutral-300 animate-pulse-delay-1 ml-1"></span>
                    <span className="block h-2 w-2 rounded-full bg-neutral-300 animate-pulse-delay-2 ml-1"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Audio Controls */}
        <AudioControls 
          isMuted={isMuted}
          toggleMute={toggleMute}
          findNextPartner={findNextPartner}
        />
      </aside>

      {/* Chat Area */}
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
