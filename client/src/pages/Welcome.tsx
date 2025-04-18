import { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';

export default function Welcome() {
  const { getStarted, hideFirstVisitModal } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  
  // Check microphone permission on component mount to speed up the process later
  useEffect(() => {
    // First check if permissions are already granted
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const hasMicrophone = devices.some(device => device.kind === 'audioinput');
        if (hasMicrophone) {
          setMicrophonePermission('granted');
        }
      })
      .catch(err => {
        console.log("Error checking devices:", err);
      });
  }, []);
  
  const handleGetStarted = async () => {
    if (loading) return; // Prevent multiple clicks
    
    try {
      setLoading(true);
      console.log("Welcome page: Get Started button clicked");
      
      // Start a timer to automatically proceed if things take too long
      const timeoutId = setTimeout(() => {
        console.log("Proceeding despite timeout");
        // Force continuation after timeout
        hideFirstVisitModal();
      }, 5000); // Proceed after 5 seconds even if we're still waiting
      
      // Attempt normal flow
      const result = await getStarted();
      
      // Clear the timeout if we finished successfully
      clearTimeout(timeoutId);
      
      if (!result) {
        // If getStarted returned false, we need to reset loading state
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during getStarted:", error);
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-primary p-6 text-white">
          <h1 className="text-2xl font-bold">Welcome to Bolo&Seekho</h1>
          <p className="opacity-90 mt-1">Practice English with new friends</p>
        </div>
        
        <div className="p-6">
          <p className="text-neutral-600 mb-6">
            Practice spoken English with random partners from around the world.
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0">
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
              <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0">
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
              <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0">
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
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${microphonePermission === 'granted' ? 'text-green-500' : 'text-primary'} mr-3 flex-shrink-0`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {microphonePermission === 'granted' ? (
                  <path d="M9 12l2 2 4-4"></path>
                ) : (
                  <>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </>
                )}
              </svg>
              <p className="text-sm">
                {microphonePermission === 'granted' 
                  ? "Microphone access already granted. You're ready to go!" 
                  : "We'll need permission to use your microphone. Your conversations remain private and are not recorded."}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleGetStarted}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition ${
              loading 
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary/90 text-white cursor-pointer'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Connecting...
              </div>
            ) : (
              'Get Started'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}