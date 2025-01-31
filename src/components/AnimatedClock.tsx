import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  const hours = formatNumber(time.getHours());
  const minutes = formatNumber(time.getMinutes());
  const seconds = formatNumber(time.getSeconds());

  return (
    <div className="flex items-center justify-center gap-2 font-mono">
      <div className="flex gap-1">
        {hours.split('').map((digit, idx) => (
          <motion.div
            key={`h-${idx}`}
            className="w-12 h-16 bg-primary/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-3xl font-bold border border-primary/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {digit}
          </motion.div>
        ))}
      </div>
      <div className="text-3xl font-bold animate-pulse">:</div>
      <div className="flex gap-1">
        {minutes.split('').map((digit, idx) => (
          <motion.div
            key={`m-${idx}`}
            className="w-12 h-16 bg-primary/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-3xl font-bold border border-primary/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {digit}
          </motion.div>
        ))}
      </div>
      <div className="text-3xl font-bold animate-pulse">:</div>
      <div className="flex gap-1">
        {seconds.split('').map((digit, idx) => (
          <motion.div
            key={`s-${idx}`}
            className="w-12 h-16 bg-primary/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-3xl font-bold border border-primary/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {digit}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedClock;