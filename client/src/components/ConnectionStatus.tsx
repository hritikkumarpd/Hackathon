import { useAppContext } from "@/contexts/AppContext";

interface ConnectionStatusProps {
  isMobile: boolean;
}

export default function ConnectionStatus({ isMobile }: ConnectionStatusProps) {
  const { connectionState } = useAppContext();
  
  let statusColor = "bg-destructive";
  let statusText = "Disconnected";
  
  if (connectionState === "connecting") {
    statusColor = "bg-neutral-300";
    statusText = "Connecting...";
  } else if (connectionState === "connected") {
    statusColor = "bg-success";
    statusText = "Connected";
  }
  
  return (
    <div className="flex items-center space-x-3">
      <span 
        className={`inline-block ${isMobile ? 'h-3 w-3' : 'h-4 w-4'} rounded-full ${statusColor}`}
        id={isMobile ? "status-indicator-mobile" : "status-indicator"}
      />
      <span 
        className={`${isMobile ? 'text-sm' : 'font-medium'}`}
        id={isMobile ? "status-text-mobile" : "status-text"}
      >
        {statusText}
      </span>
    </div>
  );
}
