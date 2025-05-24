"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const LogoWithMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState({ top: "40px", left: "50%" });

  const moveLogo = () => {
    const top = Math.floor(Math.random() * 80) + "vh";
    const left = Math.floor(Math.random() * 90) + "vw";
    setPosition({ top, left });
  };

  const handleClick = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      clearInterval(intervalRef.current!);
      intervalRef.current = null;
      setPosition({ top: "40px", left: "50%" });
    } else {
      audio.play();
      moveLogo();
      intervalRef.current = setInterval(moveLogo, 200);
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div
      className="absolute z-50 cursor-pointer transition-all duration-300 ease-in-out"
      style={{
        top: position.top,
        left: position.left,
        transform: "translate(-50%, 0)",
      }}
      onClick={handleClick}
    >
      <Image
        src="/logo.png"
        alt="Logo"
        width={200}
        height={200}
        style={{ border: "none" }}
      />
      <audio ref={audioRef} src="/song.mp3" preload="auto" />
    </div>
  );
};

export default LogoWithMusic;
