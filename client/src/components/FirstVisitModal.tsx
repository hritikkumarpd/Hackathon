import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface FirstVisitModalProps {
  onGetStarted: () => Promise<boolean>;
}

export default function FirstVisitModal({ onGetStarted }: FirstVisitModalProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    setIsLoading(true);
    const success = await onGetStarted();
    if (!success) {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Welcome to Bolo&Seekho</h2>
        <p className="text-neutral-600 mb-6">
          Connect with English learners worldwide and practice together through voice chat.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Your Name</label>
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            className="mb-2"
          />
        </div>

        <Button 
          onClick={handleGetStarted}
          disabled={isLoading || !name.trim()}
          className="w-full bg-primary text-white hover:bg-primary/90"
        >
          {isLoading ? "Setting up..." : "Get Started"}
        </Button>
      </div>
    </div>
  );
}