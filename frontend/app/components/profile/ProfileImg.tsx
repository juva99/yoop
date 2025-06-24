import React, { useEffect, useState, useRef } from "react";
import AddImgBtn from "./AddImgBtn";

import { Input } from "@/components/ui/input";
import { authFetch } from "@/lib/authFetch";
import EditImgBtn from "./EditImgBtn";

type Props = {
  userId: string;
};

const ProfileImg: React.FC<Props> = ({ userId }) => {
  const [image, setImage] = useState<string>("/defaultProfileImg.png");
  const [hasCustomImage, setHasCustomImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await authFetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile-picture/download`,
        );
        if (!response.ok) {
          setHasCustomImage(false);
          setImage("/defaultProfileImg.png");
          return;
        }

        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string);
          setHasCustomImage(true);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Failed to fetch image", error);
        setHasCustomImage(false);
        setImage("/defaultProfileImg.png");
      }
    };

    fetchImage();
  }, [userId]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // הצגת תמונה מקומית מידית
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setHasCustomImage(true);
    };
    reader.readAsDataURL(file);

    // העלאת קובץ לשרת עם authFetch
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
        // כאן אפשר להוסיף הודעת שגיאה למשתמש אם רוצים
        console.error("Failed to upload image");
        setHasCustomImage(false);
        setImage("/defaultProfileImg.png");
        return;
      }

      // אפשר לקרוא מחדש את התמונה מהשרת אם רוצים דיוק
      // או להשאיר את התמונה שהוצגה כבר
    } catch (error) {
      console.error("Upload error:", error);
      setHasCustomImage(false);
      setImage("/defaultProfileImg.png");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative h-30 w-30 rounded-full">
      <img
        src={image}
        alt="Profile"
        style={{ width: "100%", height: "100%", borderRadius: "50%" }}
      />
      {/* אם יש תמונה, הכפתור יהיה Edit, אחרת Add */}
      {hasCustomImage ? (
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

export default ProfileImg;
