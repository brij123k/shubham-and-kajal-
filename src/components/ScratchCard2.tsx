import React, { useRef, useEffect, useState, useCallback } from 'react';
import goldenGlitterHeart from '@/assets/golden-glitter-heart8.png';
import whiteHeart from '@/assets/white_hart1.png';

interface GlitterParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
}

interface ScratchCardProps {
  width?: number;
  height?: number;
  onComplete?: () => void;
  onScratchStart?: () => void;
  content?: React.ReactNode;
}

const ScratchCard: React.FC<ScratchCardProps> = ({
  width = 280,
  height = 260,
  onComplete,
  onScratchStart,
  content,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [particles, setParticles] = useState<GlitterParticle[]>([]);
  const particleIdRef = useRef(0);
  const animationFrameRef = useRef<number>();
  const scratchStartedRef = useRef(false);

  const heartPath = `
    M ${width/2} ${height * 0.92}
    C ${width * 0.15} ${height * 0.65} ${width * 0.05} ${height * 0.4} ${width * 0.05} ${height * 0.3}
    C ${width * 0.05} ${height * 0.12} ${width * 0.2} ${height * 0.05} ${width * 0.35} ${height * 0.05}
    C ${width * 0.45} ${height * 0.05} ${width * 0.48} ${height * 0.12} ${width/2} ${height * 0.2}
    C ${width * 0.52} ${height * 0.12} ${width * 0.55} ${height * 0.05} ${width * 0.65} ${height * 0.05}
    C ${width * 0.8} ${height * 0.05} ${width * 0.95} ${height * 0.12} ${width * 0.95} ${height * 0.3}
    C ${width * 0.95} ${height * 0.4} ${width * 0.85} ${height * 0.65} ${width/2} ${height * 0.92}
    Z
  `;

  const spawnGlitter = useCallback((x: number, y: number) => {
    const newParticles: GlitterParticle[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 4 + 2,
        opacity: 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20,
        life: 1,
      });
    }
    setParticles(prev => [...prev.slice(-50), ...newParticles]);
  }, []);

  useEffect(() => {
    if (particles.length === 0) return;
    const animate = () => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.15,
            rotation: p.rotation + p.rotationSpeed,
            life: p.life - 0.02,
            opacity: p.life,
          }))
          .filter(p => p.life > 0)
      );
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [particles.length]);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    const img = new Image();
    img.src = goldenGlitterHeart;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      const path = new Path2D(heartPath);
      ctx.save();
      ctx.clip(path);
      const highlightGradient = ctx.createLinearGradient(0, 0, width * 0.5, height * 0.5);
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
      highlightGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = highlightGradient;
      ctx.fill(path);
      ctx.restore();
    };
  }, [width, height, heartPath]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    spawnGlitter(x, y);
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }
    const percent = (transparentPixels / (pixels.length / 4)) * 100;
    if (percent > 50 && !isRevealed) {
      setIsRevealed(true);
      onComplete?.();
    }
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsScratching(true);
    const pos = getPosition(e);
    scratch(pos.x, pos.y);
    if (!scratchStartedRef.current) {
      scratchStartedRef.current = true;
      onScratchStart?.();
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isScratching) return;
    e.preventDefault();
    const pos = getPosition(e);
    scratch(pos.x, pos.y);
  };

  const handleEnd = () => setIsScratching(false);

  return (
    <div className="relative select-none" style={{ width, height }}>
      <div className="absolute inset-0">
        <img
          src={whiteHeart}
          alt="Heart background"
          className="absolute inset-0 w-full h-full object-contain"
        />
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-2"
          style={{ clipPath: `path('${heartPath}')` }}
        >
          {content}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute inset-0 cursor-pointer touch-none z-20"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />

      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute pointer-events-none z-30"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            transform: `rotate(${particle.rotation}deg)`,
            background: 'linear-gradient(135deg, #D4C4A8, #C9B896, #B8A67D)',
            borderRadius: particle.size > 3 ? '2px' : '50%',
            boxShadow: '0 0 4px rgba(201, 184, 150, 0.8)',
          }}
        />
      ))}
    </div>
  );
};

export default ScratchCard;