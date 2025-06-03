"use client";

import { useEffect, useRef, useState } from "react";

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const BouncingBall = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const velocityTracker = useRef<{ x: number; y: number; time: number }[]>([]);
  
  const ball = useRef<Ball>({
    x: 150,
    y: 150,
    vx: 1.5,
    vy: 1.5,
    radius: 30,
  });

  // Helper function to check if mouse is over ball
  const isMouseOverBall = (mouseX: number, mouseY: number) => {
    const dx = mouseX - ball.current.x;
    const dy = mouseY - ball.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= ball.current.radius;
  };
  // Add velocity tracking for more realistic throwing physics
  const trackVelocity = (x: number, y: number) => {
    const now = Date.now();
    velocityTracker.current.push({ x, y, time: now });
    
    // Keep only recent positions (last 200ms for better swipe detection)
    velocityTracker.current = velocityTracker.current.filter(
      pos => now - pos.time < 200
    );
  };

  // Calculate velocity based on recent movement
  const calculateThrowVelocity = () => {
    const tracker = velocityTracker.current;
    if (tracker.length < 2) return { x: 0, y: 0 };

    // Use the most recent positions to detect the swipe direction and speed
    const recent = tracker.slice(-5); // Use last 5 positions for better detection
    
    if (recent.length < 2) return { x: 0, y: 0 };

    // Calculate velocity using the first and last positions for maximum impact
    const first = recent[0];
    const last = recent[recent.length - 1];
    const dt = last.time - first.time;
    
    if (dt <= 0) return { x: 0, y: 0 };

    const vx = (last.x - first.x) / dt;
    const vy = (last.y - first.y) / dt;

    // Much higher scale factor to make throws more noticeable
    const scale = 3;
    
    // Apply maximum velocity limits to prevent ball from flying off screen too fast
    const maxVelocity = 15;
    const finalVx = Math.max(-maxVelocity, Math.min(maxVelocity, vx * scale));
    const finalVy = Math.max(-maxVelocity, Math.min(maxVelocity, vy * scale));

    return {
      x: finalVx,
      y: finalVy
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      // If dragging, move the ball with the mouse and track velocity
      if (isDragging) {
        ball.current.x = mouseRef.current.x - dragOffsetRef.current.x;
        ball.current.y = mouseRef.current.y - dragOffsetRef.current.y;
        
        // Track velocity during drag for realistic throwing
        trackVelocity(mouseRef.current.x, mouseRef.current.y);
        
        // Reset velocity while dragging
        ball.current.vx = 0;
        ball.current.vy = 0;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (isMouseOverBall(mouseX, mouseY)) {
        setIsDragging(true);
        // Store the offset from mouse to ball center
        dragOffsetRef.current = {
          x: mouseX - ball.current.x,
          y: mouseY - ball.current.y,
        };
        
        // Clear velocity tracker and start tracking
        velocityTracker.current = [];
        trackVelocity(mouseX, mouseY);
        
        // Change cursor to grabbing (desktop only)
        if (window.innerWidth > 768) {
          canvas.style.cursor = "grabbing";
        }
      } else {
        setIsInteracting(true);
      }
    };    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        // Apply calculated throwing velocity based on drag movement
        const throwVelocity = calculateThrowVelocity();
        
        // Add minimum throw velocity to ensure some movement
        const minThrow = 0.5;
        if (Math.abs(throwVelocity.x) < minThrow && Math.abs(throwVelocity.y) < minThrow) {
          // If the throw is too weak, add a small impulse in the drag direction
          const dx = mouseRef.current.x - ball.current.x;
          const dy = mouseRef.current.y - ball.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > 10) {
            ball.current.vx = (dx / distance) * 2;
            ball.current.vy = (dy / distance) * 2;
          }
        } else {
          ball.current.vx = throwVelocity.x;
          ball.current.vy = throwVelocity.y;
        }
        
        if (window.innerWidth > 768) {
          canvas.style.cursor = "pointer";
        }
      }
      setIsInteracting(false);
    };

    // Update cursor based on hover (desktop only)
    const handleMouseHover = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (!isDragging && window.innerWidth > 768) {
        canvas.style.cursor = isMouseOverBall(mouseX, mouseY) ? "grab" : "pointer";
      }
    };

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;

      mouseRef.current = { x: touchX, y: touchY };

      if (isMouseOverBall(touchX, touchY)) {
        setIsDragging(true);
        dragOffsetRef.current = {
          x: touchX - ball.current.x,
          y: touchY - ball.current.y,
        };
        
        // Clear velocity tracker and start tracking
        velocityTracker.current = [];
        trackVelocity(touchX, touchY);
      } else {
        setIsInteracting(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouseRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };

      if (isDragging) {
        ball.current.x = mouseRef.current.x - dragOffsetRef.current.x;
        ball.current.y = mouseRef.current.y - dragOffsetRef.current.y;
        
        // Track velocity during drag for realistic throwing
        trackVelocity(mouseRef.current.x, mouseRef.current.y);
        
        ball.current.vx = 0;
        ball.current.vy = 0;
      }
    };    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      if (isDragging) {
        setIsDragging(false);
        // Apply calculated throwing velocity based on drag movement
        const throwVelocity = calculateThrowVelocity();
        
        // Add minimum throw velocity to ensure some movement on mobile
        const minThrow = 0.5;
        if (Math.abs(throwVelocity.x) < minThrow && Math.abs(throwVelocity.y) < minThrow) {
          // If the throw is too weak, add a small impulse in the drag direction
          const dx = mouseRef.current.x - ball.current.x;
          const dy = mouseRef.current.y - ball.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > 10) {
            ball.current.vx = (dx / distance) * 2;
            ball.current.vy = (dy / distance) * 2;
          }
        } else {
          ball.current.vx = throwVelocity.x;
          ball.current.vy = throwVelocity.y;
        }
      }
      setIsInteracting(false);
    };    // Draw realistic soccer ball
    const drawSoccerBall = (x: number, y: number, radius: number) => {
      // Save context for shadow effects
      ctx.save();

      // Add blue glow effect when being dragged or interacting
      if (isDragging || isInteracting) {
        ctx.shadowColor = "rgba(59, 130, 246, 0.8)"; // Blue glow
        ctx.shadowBlur = 20;
        ctx.fillStyle = "rgba(59, 130, 246, 0.1)";
        ctx.beginPath();
        ctx.arc(x, y, radius + 10, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Reset shadow for main ball
      ctx.shadowBlur = 0;
      
      // Create gradient for 3D effect
      const gradient = ctx.createRadialGradient(
        x - radius * 0.3, y - radius * 0.3, 0,
        x, y, radius
      );
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(0.7, "#f0f0f0");
      gradient.addColorStop(1, "#d0d0d0");
      
      // Main ball body
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Ball outline
      ctx.strokeStyle = "#888888";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw soccer ball pattern with more detail
      ctx.fillStyle = "#000000";
      
      // Center pentagon (main black pentagon)
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
        const px = x + Math.cos(angle) * (radius * 0.25);
        const py = y + Math.sin(angle) * (radius * 0.25);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      // Add subtle gradient to pentagon for depth
      const pentGradient = ctx.createRadialGradient(
        x - radius * 0.1, y - radius * 0.1, 0,
        x, y, radius * 0.3
      );
      pentGradient.addColorStop(0, "#333333");
      pentGradient.addColorStop(1, "#000000");
      ctx.fillStyle = pentGradient;
      ctx.fill();

      // Draw hexagonal white patches around the pentagon
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1.5;
      
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
        const centerX = x + Math.cos(angle) * (radius * 0.6);
        const centerY = y + Math.sin(angle) * (radius * 0.6);
        
        // Draw hexagon
        ctx.beginPath();
        for (let j = 0; j < 6; j++) {
          const hexAngle = (j * Math.PI * 2) / 6 + angle;
          const hexRadius = radius * 0.15;
          const px = centerX + Math.cos(hexAngle) * hexRadius;
          const py = centerY + Math.sin(hexAngle) * hexRadius;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Lines connecting pentagon to hexagons
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(angle) * (radius * 0.25), y + Math.sin(angle) * (radius * 0.25));
        ctx.lineTo(x + Math.cos(angle) * (radius * 0.45), y + Math.sin(angle) * (radius * 0.45));
        ctx.stroke();
      }

      // Add highlight for 3D effect
      const highlight = ctx.createRadialGradient(
        x - radius * 0.4, y - radius * 0.4, 0,
        x - radius * 0.4, y - radius * 0.4, radius * 0.3
      );
      highlight.addColorStop(0, "rgba(255, 255, 255, 0.8)");
      highlight.addColorStop(1, "rgba(255, 255, 255, 0)");
      
      ctx.fillStyle = highlight;
      ctx.beginPath();
      ctx.arc(x - radius * 0.4, y - radius * 0.4, radius * 0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const updatePhysics = () => {
      const currentBall = ball.current;

      // Only apply physics if not being dragged
      if (!isDragging) {
        // Mouse interaction for pushing the ball
        if (isInteracting) {
          const dx = mouseRef.current.x - currentBall.x;
          const dy = mouseRef.current.y - currentBall.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const force = 0.08;
            currentBall.vx += (dx / distance) * force;
            currentBall.vy += (dy / distance) * force;
          }
        }

        // Apply gravity
        currentBall.vy += 0.25;

        // Update position
        currentBall.x += currentBall.vx;
        currentBall.y += currentBall.vy;

        // Bounce off walls with energy loss
        if (currentBall.x + currentBall.radius > canvas.width) {
          currentBall.x = canvas.width - currentBall.radius;
          currentBall.vx *= -0.8;
        }
        if (currentBall.x - currentBall.radius < 0) {
          currentBall.x = currentBall.radius;
          currentBall.vx *= -0.8;
        }
        if (currentBall.y + currentBall.radius > canvas.height) {
          currentBall.y = canvas.height - currentBall.radius;
          currentBall.vy *= -0.8;
          currentBall.vx *= 0.95; // Friction
        }
        if (currentBall.y - currentBall.radius < 0) {
          currentBall.y = currentBall.radius;
          currentBall.vy *= -0.8;
        }
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      updatePhysics();

      // Draw ball
      drawSoccerBall(ball.current.x, ball.current.y, ball.current.radius);

      // Draw interaction hints
      if (isInteracting && !isDragging) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 120, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }      // Draw drag trail
      if (isDragging) {
        const dx = mouseRef.current.x - ball.current.x;
        const dy = mouseRef.current.y - ball.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Make the trail color intensity based on drag distance
        const intensity = Math.min(distance / 100, 1);
        ctx.strokeStyle = `rgba(255, 255, 0, ${0.5 + intensity * 0.5})`;
        ctx.lineWidth = 4 + intensity * 4;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(ball.current.x, ball.current.y);
        ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Add arrow to show direction and power
        if (distance > 20) {
          const angle = Math.atan2(dy, dx);
          const arrowLength = Math.min(distance * 0.3, 40);
          const arrowX = ball.current.x + Math.cos(angle) * arrowLength;
          const arrowY = ball.current.y + Math.sin(angle) * arrowLength;
          
          ctx.strokeStyle = `rgba(255, 100, 100, ${0.7 + intensity * 0.3})`;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(ball.current.x, ball.current.y);
          ctx.lineTo(arrowX, arrowY);
          ctx.stroke();
          
          // Arrow head
          const headLength = 15;
          ctx.beginPath();
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(
            arrowX - headLength * Math.cos(angle - Math.PI / 6),
            arrowY - headLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(
            arrowX - headLength * Math.cos(angle + Math.PI / 6),
            arrowY - headLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Event listeners
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousemove", handleMouseHover);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousemove", handleMouseHover);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInteracting, isDragging]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-auto z-10"
      style={{ 
        background: "transparent",
        touchAction: "none",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none"
      }}
    />
  );
};

export default BouncingBall;
