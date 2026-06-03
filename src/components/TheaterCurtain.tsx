import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import curtainVideo from "@/assets/curtain-video.mp4";
import curtainOpenImage from "@/assets/curtain-open.jpg";
import andImage from "@/assets/and (1).png";

interface TheaterCurtainProps {
  isOpen?: boolean;
  onOpen?: () => void;
  currentPage?: number;
}

interface Confetti {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  delay: number;
  size: number;
  shape: string;
}

const TheaterCurtain = ({ isOpen = false, onOpen, currentPage = 0 }: TheaterCurtainProps) => {
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");
  const [showContent, setShowContent] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Responsive line-height: 19px on mobile (<768px), 44px on desktop
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const nameLineHeight = isMobile ? '19px' : '44px';

  // Confetti state
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = curtainOpenImage;
  }, []);

  useEffect(() => {
    const setStableHeight = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${window.innerHeight}px`;
      }
    };
    setStableHeight();
    window.addEventListener('orientationchange', setStableHeight);
    return () => window.removeEventListener('orientationchange', setStableHeight);
  }, []);

  useEffect(() => {
    if (videoRef.current && !videoError) {
      videoRef.current.load();
      const timer = setTimeout(() => setIsInitialLoad(false), 500);
      return () => clearTimeout(timer);
    }
  }, [videoError]);

  const handleVideoError = useCallback(() => {
    setVideoError(true);
    setIsInitialLoad(false);
  }, []);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    const pieces: Confetti[] = [];
    const colors = ["#FFD700", "#FFC125", "#FFDF00", "#FFE55C", "#FFEA70", "#FFF4A3"];
    const shapes = ["circle", "diamond", "star", "square"];
    for (let i = 0; i < 200; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100,
        y: -20,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        size: Math.random() * 8 + 3,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }
    setConfetti(pieces);
  }, []);

  const handleClick = useCallback(() => {
    if (phase !== "closed") return;
    setPhase("opening");
    triggerConfetti();
    if (videoRef.current && !videoError) {
      videoRef.current.play().catch(() => {});
    }
    setTimeout(() => setShowContent(true), 800);
    onOpen?.();
  }, [phase, onOpen, videoError, triggerConfetti]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || phase !== "opening") return;
    if (video.duration - video.currentTime < 0.3) setPhase("open");
  }, [phase]);

  const handleVideoEnd = useCallback(() => setPhase("open"), []);

  useEffect(() => {
    if (phase === "open") {
      requestAnimationFrame(() => setShowContent(true));
      const timer = setTimeout(() => {
        setShowConfetti(false);
        setConfetti([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const [imageLoaded, setImageLoaded] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = curtainOpenImage;
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full cursor-pointer overflow-hidden"
      onClick={handleClick}
      style={{ height: '100vh', position: 'relative', backgroundColor: '#000' }}
    >
      {/* Video */}
      {(phase === "closed" || phase === "opening") && !videoError && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={curtainVideo}
          muted
          playsInline
          preload="auto"
          loop={phase === "closed"}
          onEnded={handleVideoEnd}
          onTimeUpdate={handleTimeUpdate}
          onError={handleVideoError}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      )}

      {/* Fallback image */}
      {(phase === "closed" || phase === "opening") && videoError && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${curtainOpenImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}

      {/* Open curtain image */}
      {phase === "open" && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${curtainOpenImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      )}

      {/* Tap to open */}
      {phase === "closed" && !isInitialLoad && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <p
            className="text-xs sm:text-sm md:text-base lg:text-lg tracking-widest uppercase animate-pulse px-4 text-center"
            style={{
              color: "(0,0,0)",
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
              fontFamily: "'Georgia', serif",
              letterSpacing: '0.2em',
            }}
          >
            Tap to open
          </p>
        </div>
      )}

      {/* Loading state */}
      {phase === "closed" && isInitialLoad && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none" />
      )}

      {/* Invitation Content */}
      {showContent && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{
            opacity: showContent ? 1 : 0,
            y: currentPage && currentPage > 0 ? "-100vh" : 0,
          }}
          transition={{
            opacity: { duration: 1.2, delay: 0.4, ease: "easeOut" },
            y: { duration: 1.6, ease: [0.25, 0.1, 0.25, 1] },
          }}
        >
          <div className="flex flex-col items-center justify-center min-h-screen px-3 sm:px-6 md:px-8 py-2 sm:py-12 md:py-16 text-center w-full">
            {/* Prayer text */}
            <motion.div
              className="mb-4 sm:mb-6 md:mb-8 lg:mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <p
                className="pt-44 font-serif-elegant text-[12px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm tracking-[0.2em] xs:tracking-[0.22em] sm:tracking-[0.25em] md:tracking-[0.3em] lg:tracking-[0.35em] text-gray-700 sm:text-muted-foreground leading-tight uppercase"
                style={{ textShadow: "0 2px 8px rgba(255,255,255,0.8), 0 2px 12px rgba(0,0,0,0.5)" }}
              >
                THIS IS WHERE
              </p>
              <p
                className="font-serif-elegant text-[12px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm tracking-[0.2em] xs:tracking-[0.22em] sm:tracking-[0.25em] md:tracking-[0.3em] lg:tracking-[0.35em] text-gray-700 sm:text-muted-foreground leading-tight uppercase"
                style={{ textShadow: "0 2px 8px rgba(255,255,255,0.8), 0 2px 12px rgba(0,0,0,0.5)" }}
              >
                OUR FOREVER BEGINS.
              </p>
            </motion.div>

            {/* Names section */}
            <motion.div
              className="flex flex-col items-center justify-center gap-0 w-full max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              {/* ✅ KAJAL — lineHeight: 19px mobile / 44px desktop */}
              <motion.h1
                className="text-[24px] xs:text-[20px] sm:text-[24px] md:text-[32px] lg:text-[42px] xl:text-[52px] 2xl:text-[62px] leading-tight md:leading-normal lg:leading-relaxed break-words max-w-full px-2 whitespace-nowrap md:whitespace-normal"
                style={{
                  fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Libre Baskerville', serif",
                  color: '#2d2d2d',
                  fontWeight: 400,
                  letterSpacing: '0.03em',
                  lineHeight: nameLineHeight,
                  textShadow: "0 2px 10px rgba(255,255,255,0.9), 0 4px 15px rgba(0,0,0,0.4)",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={showContent ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
              >
                KAJAL
              </motion.h1>

              {/* "and" image */}
              <motion.div
                className="flex-shrink-0 relative z-10 -mb-2 xs:-mb-3 sm:-mb-4 md:-mb-6 lg:-mb-8 xl:-mb-10"
                style={{ paddingLeft: '19px' }}
                initial={{ opacity: 0 }}
                animate={showContent ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                <img
                  src={andImage}
                  alt="and"
                  className="w-20 xs:w-16 sm:w-20 md:w-28 lg:w-36 xl:w-44 2xl:w-52 h-auto object-contain mx-auto"
                  style={{
                    filter: 'opacity(0.9) drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                    display: 'block',
                    visibility: 'visible',
                  }}
                />
              </motion.div>

              {/* ✅ SUBHAM — lineHeight: 19px mobile / 44px desktop */}
              <motion.h1
                className="text-[24px] xs:text-[20px] sm:text-[24px] md:text-[32px] lg:text-[42px] xl:text-[52px] 2xl:text-[62px] leading-tight md:leading-normal lg:leading-relaxed break-words max-w-full px-2 whitespace-nowrap md:whitespace-normal"
                style={{
                  fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Libre Baskerville', serif",
                  color: '#2d2d2d',
                  fontWeight: 400,
                  letterSpacing: '0.03em',
                  lineHeight: nameLineHeight,
                  textShadow: "0 2px 10px rgba(255,255,255,0.9), 0 4px 15px rgba(0,0,0,0.4)",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={showContent ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1, delay: 1.7, ease: "easeOut" }}
              >
                SUBHAM
              </motion.h1>
            </motion.div>

            {/* Save the Date */}
            <motion.div
              className="mt-4 xs:mt-5 sm:mt-6 md:mt-8 lg:mt-10 xl:mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 2.0 }}
            >
              {/* Empty */}
            </motion.div>

            {/* Scroll Down Indicator */}
            <motion.div
              className="flex flex-col items-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={showContent ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 2.5 }}
              style={{ marginTop: '8px' }}
            >
              <span
                style={{
                  color: '#C9A86A',
                  fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  opacity: 0.85,
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
              >
                Scroll
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', marginTop: '4px' }}>
                {[0, 1, 2].map((i) => (
                  <svg
                    key={i}
                    width="16"
                    height="10"
                    viewBox="0 0 16 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      animation: 'scrollBounce 1.5s ease-in-out infinite',
                      animationDelay: `${i * 0.2}s`,
                      opacity: 0,
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                    }}
                  >
                    <path
                      d="M1 1L8 8L15 1"
                      stroke="#C9A86A"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Scroll bounce keyframe */}
      <style>{`
        @keyframes scrollBounce {
          0%   { opacity: 0; transform: translateY(-4px); }
          50%  { opacity: 1; transform: translateY(0px); }
          100% { opacity: 0; transform: translateY(4px); }
        }
      `}</style>

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
          {confetti.map((piece) => {
            const getShapeStyle = () => {
              switch (piece.shape) {
                case "circle": return { borderRadius: "50%" };
                case "diamond": return { borderRadius: "0%", transform: "rotate(45deg)", clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" };
                case "star": return { clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" };
                default: return { borderRadius: "0%" };
              }
            };

            return (
              <motion.div
                key={piece.id}
                className="absolute"
                style={{
                  left: `${piece.x}%`,
                  width: `${piece.size}px`,
                  height: `${piece.size}px`,
                  backgroundColor: piece.color,
                  boxShadow: `0 0 ${piece.size * 2}px ${piece.color}`,
                  ...getShapeStyle(),
                }}
                initial={{ y: piece.y, rotate: 0, opacity: 1, scale: 0 }}
                animate={{
                  y: ["0vh", "120vh"],
                  rotate: [0, piece.rotation * 3, piece.rotation * 6],
                  x: [0, Math.random() * 60 - 30, Math.random() * 80 - 40],
                  opacity: [0, 1, 1, 0.8, 0],
                  scale: [0, 1, 1, 0.8, 0.5],
                }}
                transition={{
                  duration: 3.5 + Math.random() * 2.5,
                  delay: piece.delay,
                  ease: "easeIn",
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TheaterCurtain;