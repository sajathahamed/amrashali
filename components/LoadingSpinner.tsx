"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function LoadingSpinner({ size = "lg", text }: LoadingSpinnerProps) {
  const sizes = {
    sm: { container: "w-8 h-8", dot: "w-2 h-2" },
    md: { container: "w-12 h-12", dot: "w-3 h-3" },
    lg: { container: "w-16 h-16", dot: "w-4 h-4" },
  };

  const dotVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: { scale: 1.2, opacity: 1 },
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className={`relative ${sizes[size].container}`}>
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner spinning ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-accent"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Pulsing center */}
        <motion.div
          className="absolute inset-3 rounded-full bg-gradient-to-br from-primary to-accent"
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Orbiting dots */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`absolute ${sizes[size].dot} rounded-full bg-accent`}
            style={{
              top: "50%",
              left: "50%",
              marginTop: `-${parseInt(sizes[size].dot.split(" ")[0].replace("w-", "")) / 2 * 4}px`,
              marginLeft: `-${parseInt(sizes[size].dot.split(" ")[0].replace("w-", "")) / 2 * 4}px`,
            }}
            animate={{
              x: [0, 30, 0, -30, 0],
              y: [-30, 0, 30, 0, -30],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
            variants={dotVariants}
          />
        ))}
      </div>

      {text && (
        <motion.p
          className="mt-6 text-text font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {text}
        </motion.p>
      )}

      {/* Loading text animation */}
      <motion.div className="mt-4 flex items-center gap-1">
        {["L", "o", "a", "d", "i", "n", "g"].map((letter, i) => (
          <motion.span
            key={i}
            className="text-sm text-text/60"
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          >
            {letter}
          </motion.span>
        ))}
        <motion.span
          className="text-sm text-text/60"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ...
        </motion.span>
      </motion.div>
    </div>
  );
}
