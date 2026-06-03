import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import TheaterCurtain from "@/components/TheaterCurtain";
import Home from "./Home";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleReveal = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
    }
  }, [isOpen]);

  return (
    <div className="relative min-h-screen bg-white">
      {/* SEO */}
      <h1 className="sr-only">Kajal  AND Subham</h1>
      
      {/* Theater Curtain Section - Using min-height for mobile */}
      <section className="relative w-full min-h-screen h-screen max-h-screen overflow-hidden">
        <TheaterCurtain isOpen={isOpen} onOpen={handleReveal} />
        
        {/* Scroll hint - only shows after curtain opens */}
        {isOpen && (
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 flex justify-center animate-bounce z-10">
            <p className="text-[10px] sm:text-xs md:text-sm tracking-widest uppercase text-white/70">
              Scroll down ↓
            </p>
          </div>
        )}
      </section>

      {/* Main Content Section */}
      <section className="relative bg-white">
        <Home />
      </section>
    </div>
  );
};

export default Index;