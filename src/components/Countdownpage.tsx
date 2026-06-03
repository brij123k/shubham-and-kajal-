import React, { useState, useEffect } from 'react';
import venueImage from '@/assets/Layer 1 (1).png';

// ✅ Fixed wedding date — counts down to 7 July 2026 and NEVER resets on refresh.
// Change only this line if the date/time changes. Format: 'YYYY-MM-DDTHH:mm:ss' (local time).
const WEDDING_DATE = new Date('2026-07-07T00:00:00').getTime();

const CountdownPage = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = WEDDING_DATE - now;

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white relative overflow-hidden px-0 md:px-8 lg:px-16 pt-2 sm:pt-3 pb-6">

      {/* Countdown Title */}
      <h3
        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] uppercase mb-3 sm:mb-4 md:mb-5 leading-tight px-4 md:px-0"
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
      <div className="flex gap-2 sm:gap-4 md:gap-8 mb-6 sm:mb-8 md:mb-10 px-4 md:px-0">

        {/* Days */}
        <div className="flex flex-col items-center">
          <div
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-0.5 leading-none"
            style={{ color: '#4A4A4A', fontFamily: "'Playfair Display', serif", lineHeight: '1' }}
          >
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div
            className="text-[9px] sm:text-[10px] md:text-xs tracking-normal uppercase leading-none"
            style={{ color: '#8A8A8A', fontFamily: "'Playfair Display', serif", letterSpacing: '0em', lineHeight: '1' }}
          >
            Days
          </div>
        </div>

        <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light self-start" style={{ color: '#8A8A8A' }}>:</div>

        {/* Hours */}
        <div className="flex flex-col items-center">
          <div
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-0.5 leading-none"
            style={{ color: '#4A4A4A', fontFamily: "'Playfair Display', serif", lineHeight: '1' }}
          >
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div
            className="text-[9px] sm:text-[10px] md:text-xs tracking-normal uppercase leading-none"
            style={{ color: '#8A8A8A', fontFamily: "'Playfair Display', serif", letterSpacing: '0em', lineHeight: '1' }}
          >
            Hours
          </div>
        </div>

        <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light self-start" style={{ color: '#8A8A8A' }}>:</div>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-0.5 leading-none"
            style={{ color: '#4A4A4A', fontFamily: "'Playfair Display', serif", lineHeight: '1' }}
          >
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div
            className="text-[9px] sm:text-[10px] md:text-xs tracking-normal uppercase leading-none"
            style={{ color: '#8A8A8A', fontFamily: "'Playfair Display', serif", letterSpacing: '0em', lineHeight: '1' }}
          >
            Minutes
          </div>
        </div>

        <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light self-start" style={{ color: '#8A8A8A' }}>:</div>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-0.5 leading-none"
            style={{ color: '#4A4A4A', fontFamily: "'Playfair Display', serif", lineHeight: '1' }}
          >
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div
            className="text-[9px] sm:text-[10px] md:text-xs tracking-normal uppercase leading-none"
            style={{ color: '#8A8A8A', fontFamily: "'Playfair Display', serif", letterSpacing: '0em', lineHeight: '1' }}
          >
            Seconds
          </div>
        </div>
      </div>

      {/* Venue Section */}
      <div className="flex flex-col items-center w-full md:max-w-6xl mt-2 sm:mt-4 md:mt-6">

        {/* Venue Text */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8 px-4 md:px-0">
          <p
            className="text-xs sm:text-sm md:text-base tracking-normal uppercase mb-1 sm:mb-2 leading-none"
            style={{ color: '#8A8A8A', fontFamily: "'Playfair Display', serif", letterSpacing: '0em', lineHeight: '1.2' }}
          >
            VENUE:
          </p>
          <p
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-normal uppercase leading-tight"
            style={{
              color: '#6B6B6B',
              fontFamily: "'Playfair Display', serif",
              letterSpacing: '0em',
              fontWeight: 400,
              lineHeight: '1.2',
            }}
          >
            ADVAITAA BALLROOM & LAWN
          </p>
        </div>

        {/* Venue Image */}
        <div className="w-full m-0 p-0">
          <img
            src={venueImage}
            alt="Advaitaa Ballroom & Lawn"
            className="w-full h-auto object-cover rounded-none md:rounded-sm m-0 p-0"
            style={{ margin: 0, padding: 0 }}
          />
        </div>
      </div>
    </div>
  );
};

export default CountdownPage;