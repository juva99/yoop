"use client";

import { Button } from "./button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";


const Share = () => {

  const handleShare = async () => {
    const shareData = {
        title: "Yoop Sports",
        text: "הצטרפו למשחק שלי ב-Yoop Sports!",
        url: window.location.href,
    };


      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      }
      else {
        await handleCopyToClipboard(shareData);
      }
    };

  const handleCopyToClipboard = async (shareData: { title: string; text: string; url: string; }) => {
    const shareText = `${shareData.text}\n${shareData.url}`;
    
    try {
      // Check if clipboard API is available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
        toast.success("הקישור הועתק ללוח");
      } else {
        // Fallback method for older browsers or insecure contexts
        fallbackCopyTextToClipboard(shareText);
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      // Try fallback method if modern clipboard API fails
      fallbackCopyTextToClipboard(shareText);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        toast.success("הקישור הועתק ללוח");
      } else {
        toast.error("שגיאה בהעתקת הקישור");
      }
    } catch (error) {
      console.error("Fallback copy failed:", error);
      toast.error("שגיאה בהעתקת הקישור");
    }
  };

  return (
    <div>
      <Button
        onClick={handleShare}
        variant={"ghost"}
        className="relative"
      >
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Share