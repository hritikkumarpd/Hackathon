import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";

export default function FirstVisitModal() {
  const { getStarted } = useAppContext();
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-lg mx-4">
        <h2 className="text-2xl font-bold mb-2">Welcome to Bolo&Seekho</h2>
        <p className="text-neutral-600 mb-6">
          Practice spoken English with random partners from around the world.
        </p>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Voice Chat</h3>
              <p className="text-sm text-neutral-600">
                Practice speaking with real people in real-time
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Text Chat</h3>
              <p className="text-sm text-neutral-600">
                Send messages to clarify or practice writing
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9"></polyline>
                <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                <polyline points="7 23 3 19 7 15"></polyline>
                <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Meet New People</h3>
              <p className="text-sm text-neutral-600">
                Click "Next Partner" anytime to connect with someone new
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-neutral-50 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p className="text-sm">
              We'll need permission to use your microphone. Your conversations remain private and are not recorded.
            </p>
          </div>
        </div>
        
        <Button
          id="get-started-btn"
          className="bg-primary hover:bg-primary/90 text-white w-full py-6 rounded-lg font-medium transition"
          onClick={getStarted}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
