import { motion } from "framer-motion";

const TapPrompt = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <div className="text-center mt-32 sm:mt-36 md:mt-40">
        <motion.div
          className="animate-pulse-soft"
        >
<p className="font-serif-elegant text-sm tracking-[0.7em] uppercase text-black">
  Tap to open
</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TapPrompt;