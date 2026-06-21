import { useRef } from "react";
import { User, Trash2, Loader2 ,  Pencil } from "lucide-react";
import { useProfilePicture } from "@/hooks/useProfilePicture";

export const ProfileAvatar = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { pictureUrl, isLoading, isUploading, isDeleting, handleFileChange, deleteProfilePicture } = useProfilePicture();

  return (
    <div className="relative flex-shrink-0 group">
      {/* Avatar Circle */}
      <div className="h-28 w-28 rounded-full bg-secondary border-2 border-border flex items-center justify-center shadow-md overflow-hidden ring-4 ring-background">
        {isLoading || isUploading ? (
          <Loader2 className="h-9 w-9 animate-spin text-muted-foreground" />
        ) : pictureUrl ? (
          <img src={pictureUrl} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <User className="h-12 w-12 text-muted-foreground opacity-40" />
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isDeleting}
          className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center transition-colors"
          title="Upload photo"
        >
       
  <Pencil className="w-3.5 h-3.5 text-white" />

        </button>

        {pictureUrl && (
          <button
            onClick={() => deleteProfilePicture()}
            disabled={isUploading || isDeleting}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-red-500/70 flex items-center justify-center transition-colors"
            title="Remove photo"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Camera badge */}
<div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1ca37b] border-2 border-background flex items-center justify-center shadow-sm pointer-events-none group-hover:opacity-0 transition-opacity">
  <Pencil className="w-3.5 h-3.5 text-white" />
</div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpg,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};