import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScratchCard from '@/components/ScratchCard2';
import saveTheDateImage from '@/assets/save thedate.png';
import websiteBg from '@/assets/website.jpg (1).jpeg';

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

const Home = () => {
  const [hasStartedScratching, setHasStartedScratching] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // ✅ Fixed wedding date — counts down to 7 July 2026 and NEVER resets on refresh.
    // Change only this line if the date/time changes. Format: 'YYYY-MM-DDTHH:mm:ss' (local time).
    const targetDate = new Date('2026-07-07T00:00:00').getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    const pieces: Confetti[] = [];
    const colors = ['#FFD700', '#FFC125', '#FFDF00', '#FFE55C', '#FFEA70', '#FFF4A3'];
    const shapes = ['circle', 'diamond', 'star', 'square'];
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
    setTimeout(() => {
      setShowConfetti(false);
      setConfetti([]);
    }, 5000);
  }, []);

  const handleHeartComplete = useCallback(() => {
    setCompletedCount(prev => {
      const newCount = prev + 1;
      if (newCount === 3) triggerConfetti();
      return newCount;
    });
  }, [triggerConfetti]);

  const handleScratchStart = () => setHasStartedScratching(true);

  const getShapeStyle = (shape: string): React.CSSProperties => {
    switch (shape) {
      case 'circle': return { borderRadius: '50%' };
      case 'diamond': return { borderRadius: '0%', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' };
      case 'star': return { clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' };
      case 'square':
      default: return { borderRadius: '0%' };
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: 0,
      }}
    >
      {/* Background image */}
{/* Background image */}
<img
  src={websiteBg}
  alt=""
  aria-hidden="true"
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 'auto',              // ✅ Let height follow the image naturally
    objectFit: 'fill',
    objectPosition: 'top center',
    pointerEvents: 'none',
    zIndex: 0,
  }}
/>

      {/* White overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* All content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >

        {/* ===================== SAVE THE DATE IMAGE ===================== */}
        <div className="flex justify-center items-center w-full pt-3 sm:pt-4 pb-0">
          <img
            src={saveTheDateImage}
            alt="Save the Date"
            style={{
              width: '38vw',
              maxWidth: '160px',
              minWidth: '110px',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* ===================== SECTION 1: SCRATCH CARDS ===================== */}
        <div className="flex flex-col items-center w-full py-8 sm:py-12 md:py-16">

          {/* Three scratch card hearts */}
          <div className="flex gap-1.5 sm:gap-2 md:gap-3 items-center justify-center mb-1.5 sm:mb-2">

            {/* First Heart - Day */}
            <ScratchCard
              width={window.innerWidth < 640 ? 52 : 62}
              height={window.innerWidth < 640 ? 49 : 58}
              onComplete={handleHeartComplete}
              onScratchStart={handleScratchStart}
              content={
                <p
                  className="text-base sm:text-lg md:text-xl font-semibold uppercase"
                  style={{
                    color: '#000000',
                    fontFamily: "'Playfair Display', 'Bodoni Moda', serif",
                    letterSpacing: '0.1em',
                  }}
                >
                  07
                </p>
              }
            />

            {/* Second Heart - Month */}
            <ScratchCard
              width={window.innerWidth < 640 ? 52 : 62}
              height={window.innerWidth < 640 ? 49 : 58}
              onComplete={handleHeartComplete}
              onScratchStart={handleScratchStart}
              content={
                <p
                  className="text-base sm:text-lg md:text-xl font-semibold uppercase"
                  style={{
                    color: '#000000',
                    fontFamily: "'Playfair Display', 'Bodoni Moda', serif",
                    letterSpacing: '0.1em',
                  }}
                >
                  07
                </p>
              }
            />

            {/* Third Heart - Year */}
            <ScratchCard
              width={window.innerWidth < 640 ? 52 : 62}
              height={window.innerWidth < 640 ? 49 : 58}
              onComplete={handleHeartComplete}
              onScratchStart={handleScratchStart}
              content={
                <p
                  className="text-base sm:text-lg md:text-xl font-semibold uppercase"
                  style={{
                    color: '#000000',
                    fontFamily: "'Playfair Display', 'Bodoni Moda', serif",
                    letterSpacing: '0.1em',
                  }}
                >
                  26
                </p>
              }
            />
          </div>

          {/* Scratch hint */}
          <div
            className="text-[9px] sm:text-[10px] tracking-wide text-center mb-1.5 sm:mb-2"
            style={{
              color: '#C9A86A',
              fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
              lineHeight: '2.2',
              opacity: hasStartedScratching ? 0 : 1,
              visibility: hasStartedScratching ? 'hidden' : 'visible',
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
              height: 'auto',
              minHeight: hasStartedScratching ? '20px' : 'auto',
            }}
          >
            Scratch to reveal ✨
          </div>

          {/* We're Getting Married text */}
          <div className="text-center mt-0.5 mb-1">
            <p
              className="text-xs sm:text-sm md:text-base uppercase"
              style={{
                color: '#5A5A5A',
                fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Didot', serif",
                fontWeight: 500,
                letterSpacing: '0px',
                lineHeight: '0.8',
              }}
            >
              WE'RE
            </p>
            <p
              className="text-sm sm:text-base md:text-xl uppercase mt-1"
              style={{
                color: '#5A5A5A',
                fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Didot', serif",
                fontWeight: 500,
                letterSpacing: '0px',
                lineHeight: '1',
              }}
            >
              GETTING MARRIED!
            </p>
          </div>

          {/* Scroll Down Indicator */}
          <div className="flex flex-col items-center mt-1.5" style={{ pointerEvents: 'none' }}>
            <span
              style={{
                color: '#C9A86A',
                fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
                fontSize: '9px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                opacity: 0.8,
              }}
            >
              Scroll
            </span>
            <div className="flex flex-col items-center" style={{ gap: '1px', marginTop: '2px' }}>
              {[0, 1, 2].map((i) => (
                <svg
                  key={i}
                  width="12"
                  height="8"
                  viewBox="0 0 16 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    animation: 'scrollBounce 1.5s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`,
                    opacity: 0,
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
          </div>
        </div>

       {/* ===================== SECTION 2: COUNTDOWN + VENUE ===================== */}
<div className="flex flex-col items-center w-full px-0 md:px-16 lg:px-20 pt-10 pb-12">

  {/* Countdown Title */}
  <h3
    className="text-sm sm:text-base md:text-xl uppercase mb-3 sm:mb-4 px-4 md:px-0"
    style={{
      color: '#6B6B6B',
      fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
      fontWeight: 200,
      lineHeight: '2',
    }}
  >
    COUNTDOWN
  </h3>

  {/* Countdown Timer */}
  <div className="flex gap-1.5 sm:gap-3 md:gap-5 mb-10 sm:mb-12 px-4 md:px-0">

    <div className="flex flex-col items-center">
      <div
        className="text-xl sm:text-2xl md:text-3xl font-light mb-0.5"
        style={{ color: '#4A4A4A', fontFamily: "'Playfair Display', serif", lineHeight: '1' }}
      >
        {String(timeLeft.days).padStart(2, '0')}
      </div>
      <div
        className="text-[7px] sm:text-[8px] md:text-[9px] uppercase"
        style={{ color: '#8A8A8A', fontFamily: "'Playfair Display', serif", lineHeight: '1' }}
      >
        Days
      </div>
    </div>

    <div className="text-xl sm:text-2xl md:text-3xl font-light self-start" style={{ color: '#8A8A8A' }}>:</div>

    <div className="flex flex-col items-center">
      <div
        className="text-xl sm:text-2xl md:text-3xl font-light mb-0.5"
        style={{ color: '#4A4A4A', fontFamily: "'Playfair Display', serif", lineHeight: '1' }}
      >
        {String(timeLeft.hours).padStart(2, '0')}
      </div>
      <div
        className="text-[7px] sm:text-[8px] md:text-[9px] uppercase"
        style={{ color: '#8A8A8A', fontFamily: "'Playfair Display', serif", lineHeight: '1' }}
      >
        Hours
      </div>
    </div>

    <div className="text-xl sm:text-2xl md:text-3xl font-light self-start" style={{ color: '#8A8A8A' }}>:</div>

    <div className="flex flex-col items-center">
      <div
        className="text-xl sm:text-2xl md:text-3xl font-light mb-0.5"
        style={{ color: '#4A4A4A', fontFamily: "'Playfair Display', serif", lineHeight: '1' }}
      >
        {String(timeLeft.minutes).padStart(2, '0')}
      </div>
      <div
        className="text-[7px] sm:text-[8px] md:text-[9px] uppercase"
        style={{ color: '#8A8A8A', fontFamily: "'Playfair Display', serif", lineHeight: '1' }}
      >
        Minutes
      </div>
    </div>

    <div className="text-xl sm:text-2xl md:text-3xl font-light self-start" style={{ color: '#8A8A8A' }}>:</div>

    <div className="flex flex-col items-center">
      <div
        className="text-xl sm:text-2xl md:text-3xl font-light mb-0.5"
        style={{ color: '#4A4A4A', fontFamily: "'Playfair Display', serif", lineHeight: '1' }}
      >
        {String(timeLeft.seconds).padStart(2, '0')}
      </div>
      <div
        className="text-[7px] sm:text-[8px] md:text-[9px] uppercase"
        style={{ color: '#8A8A8A', fontFamily: "'Playfair Display', serif", lineHeight: '1' }}
      >
        Seconds
      </div>
    </div>
  </div>

  {/* Venue Section */}
  <div className="flex flex-col items-center w-full md:max-w-6xl mt-1">
    <div className="text-center mb-8 px-4 md:px-0">
      <p
        className="text-[10px] sm:text-xs uppercase mb-1"
        style={{ color: '#8A8A8A', fontFamily: "'Playfair Display', serif", lineHeight: '1.2' }}
      >
        VENUE:
      </p>
      <p
        className="text-sm sm:text-base md:text-lg uppercase"
        style={{ color: '#6B6B6B', fontFamily: "'Playfair Display', serif", fontWeight: 400, lineHeight: '1.2' }}
      >
        Surat
      </p>
    </div>
<div className="text-center mt-6 px-4 md:px-0">
      <p
        className="text-[10px] sm:text-xs uppercase mb-1"
        style={{ color: '#8A8A8A', fontFamily: "'Playfair Display', serif", lineHeight: '1.2' }}
      >
        Regards
      </p>
      <p
        className="text-xs sm:text-sm md:text-base uppercase"
        style={{ color: '#6B6B6B', fontFamily: "'Playfair Display', serif", fontWeight: 400, lineHeight: '1.2' }}
      >
         Neemani & Kanodia Family
      </p>
    </div>
    {/* Spacer for couple illustration */}
    <div style={{ height: '28vw', maxHeight: '340px', minHeight: '150px' }} />

    {/* Regards - pushed below illustration */}
    
  </div>
</div>
      </div>

      <style>{`
        @keyframes scrollBounce {
          0%   { opacity: 0; transform: translateY(-4px); }
          50%  { opacity: 1; transform: translateY(0px); }
          100% { opacity: 0; transform: translateY(4px); }
        }
      `}</style>

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute"
              style={{
                left: `${piece.x}%`,
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                backgroundColor: piece.color,
                boxShadow: `0 0 ${piece.size * 2}px ${piece.color}`,
                ...getShapeStyle(piece.shape),
              }}
              initial={{ y: piece.y, rotate: 0, opacity: 1, scale: 0 }}
              animate={{
                y: ['0vh', '120vh'],
                rotate: [0, piece.rotation * 3, piece.rotation * 6],
                x: [0, Math.random() * 60 - 30, Math.random() * 80 - 40],
                opacity: [0, 1, 1, 0.8, 0],
                scale: [0, 1, 1, 0.8, 0.5],
              }}
              transition={{
                duration: 3.5 + Math.random() * 2.5,
                delay: piece.delay,
                ease: 'easeIn',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;