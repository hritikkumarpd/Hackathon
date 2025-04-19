import { useAppContext } from "@/contexts/AppContext";

export default function ConnectionModal() {
  const { cancelConnection } = useAppContext();
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Connecting...</h2>
        <p className="text-neutral-600 mb-6">
          Finding an English practice partner for you. This may take a few moments.
        </p>
        
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
        
        <div className="mt-6 text-center">
          <button 
            id="cancel-connection" 
            className="text-neutral-500 text-sm hover:underline"
            onClick={cancelConnection}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
