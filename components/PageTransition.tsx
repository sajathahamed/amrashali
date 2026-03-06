"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        willChange: "opacity",
        // Ensure Chrome doesn't keep element hidden if hydration is delayed
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
      }}
    >
      {children}
    </motion.div>
  );
}

