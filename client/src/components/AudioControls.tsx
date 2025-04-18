import { Button } from "@/components/ui/button";

interface AudioControlsProps {
  isMuted: boolean;
  toggleMute: () => void;
  findNextPartner: () => void;
}

export default function AudioControls({ isMuted, toggleMute, findNextPartner }: AudioControlsProps) {
  return (
    <div className="p-6 bg-neutral-50 border-t border-neutral-200">
      <div className="flex items-center justify-between">
        {/* Mute/Unmute Button */}
        <Button
          id="mute-toggle"
          variant="outline"
          className={`border border-neutral-200 ${isMuted ? 'bg-neutral-200' : 'bg-white'} hover:bg-neutral-100 text-neutral-700 rounded-lg px-4 py-2 flex items-center space-x-2 transition shadow-sm`}
          onClick={toggleMute}
        >
          {isMuted ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
              <span>Mic is Off</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
              <span>Mic is On</span>
            </>
          )}
        </Button>

        {/* Next Partner Button */}
        <Button
          id="next-partner"
          className="bg-primary hover:bg-primary/90 text-white rounded-lg px-4 py-2 flex items-center space-x-2 transition shadow-sm"
          onClick={findNextPartner}
        >
          <span>Next Partner</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </Button>
      </div>
    </div>
  );
}
