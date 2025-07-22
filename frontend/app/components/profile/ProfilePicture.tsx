import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authFetch } from "@/lib/authFetch";
import { toast } from "sonner";
import PictureBtn from "./PictureBtn";

type Props = {
  userId: string;
  firstName: string;
  lastName: string;
};

const ProfilePic: React.FC<Props> = ({ userId, firstName, lastName }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("נא לבחור קובץ תמונה בלבד");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("גודל הקובץ לא יכול לעלות על 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("profilePic", file);

      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile-picture/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      toast.success("התמונה עודכנה בהצלחה");

      // Refresh the page to show the updated image
      window.location.reload();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("שגיאה בהעלאת התמונה");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const picture = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile-picture/download/${userId}`;
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  return (
    <div className="relative">
      <Avatar className="h-30 w-30">
        <AvatarImage src={picture} alt="Profile picture" />
        <AvatarFallback className="text-5xl">{initials}</AvatarFallback>
      </Avatar>

      <PictureBtn onClick={handleButtonClick} disabled={isUploading} />

      <Input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default ProfilePic;
