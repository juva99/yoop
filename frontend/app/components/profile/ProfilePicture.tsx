import React, { useEffect, useState, useRef } from "react";
import AddImgBtn from "./AddPictureBtn";

import { Input } from "@/components/ui/input";
import { authFetch } from "@/lib/authFetch";
import EditImgBtn from "./EditPictureBtn";
import { toast } from "sonner";

type Props = {
  userId: string;
};

const ProfilePic: React.FC<Props> = ({ userId }) => {
  const [picture, setPicture] = useState<string>("/defaultProfilePic.png");
  const [hasCustomPic, setHasCustomPic] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchPic = async () => {
      try {
        const response = await authFetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile-picture/download`,
        );
        if (!response.ok) {
          if (response.status === 404) {
            setHasCustomPic(false);
            setPicture("/defaultProfilePic.png");
          } else {
            toast.error("שגיאה בטעינת תמונה");
          }
          return;
        }

        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setPicture(reader.result as string);
          setHasCustomPic(true);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Failed to fetch picture", error);
        setHasCustomPic(false);
        setPicture("/defaultProfilePic.png");
      }
    };

    fetchPic();
  }, [userId, hasCustomPic]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPicture(reader.result as string);
      setHasCustomPic(true);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
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
        toast.error("שגיאה בהעלאת התמונה");
        console.error("Upload failed:", response.statusText);
        setHasCustomPic(false);
        setPicture("/defaultProfilePic.png");
        return;
      } else {
        setHasCustomPic(true);
        toast.success("התמונה עודכנה בהצלחה");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setHasCustomPic(false);
      setPicture("/defaultProfilePic.png");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative h-30 w-30 rounded-full">
      <img
        src={picture}
        alt="Profile"
        style={{ width: "100%", height: "100%", borderRadius: "50%" }}
      />
      {hasCustomPic ? (
        <EditImgBtn onClick={handleButtonClick} disabled={isUploading} />
      ) : (
        <AddImgBtn onClick={handleButtonClick} disabled={isUploading} />
      )}
      <Input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ProfilePic;
