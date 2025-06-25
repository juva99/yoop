import { authFetch } from "@/lib/authFetch";
import { useEffect, useState } from "react";

export function useProfilePic(userId: string): string | undefined {
  const [pic, setPic] = useState<string | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    const fetchPic = async () => {
      try {
        const response = await authFetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile-picture/download/${userId}`,
        );
        if (!response.ok) {
          setPic(undefined);
          return;
        }
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (isMounted) setPic(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } catch {
        setPic(undefined);
      }
    };

    fetchPic();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  return pic;
}
