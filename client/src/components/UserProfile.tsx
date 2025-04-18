interface User {
  id: string;
  name: string;
  avatar: string;
}

interface UserProfileProps {
  user: User;
  description: string;
  isPartner?: boolean;
}

export default function UserProfile({ user, description, isPartner = false }: UserProfileProps) {
  const bgColor = isPartner ? "bg-secondary/10" : "bg-primary/10";
  const textColor = isPartner ? "text-secondary" : "text-primary";
  
  return (
    <div className="flex items-center">
      <div 
        className={`h-12 w-12 rounded-full ${bgColor} flex items-center justify-center ${textColor} text-xl font-bold mr-3`}
        data-testid={isPartner ? "partner-avatar" : "user-avatar"}
      >
        {user.avatar}
      </div>
      <div>
        <p className="font-medium">
          {isPartner ? user.name : `You (${user.name})`}
        </p>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
    </div>
  );
}
