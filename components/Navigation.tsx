"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import DarkModeToggle from "./DarkModeToggle";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      const savedTheme = localStorage.getItem("theme");
      // Default to light mode if no saved preference
      const shouldBeDark = savedTheme === "dark";
      setIsDark(shouldBeDark);
    };
    
    checkTheme();
    
    // Listen for theme changes (from desktop toggle or other sources)
    const handleStorageChange = () => {
      checkTheme();
    };
    
    // Listen for storage events (when theme changes in another tab/component)
    window.addEventListener("storage", handleStorageChange);
    
    // Also check periodically (for same-tab changes)
    const interval = setInterval(checkTheme, 100);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      // Focus trap - focus first element
      const firstFocusable = menuRef.current?.querySelector('a, button') as HTMLElement;
      firstFocusable?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/articles", label: "Journal" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white dark:bg-gray-900 shadow-md"
          : "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-serif font-bold text-primary">
              AA
            </span>
            <span className="hidden sm:inline text-sm text-text">
              Amras Ali
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative group"
              >
                <span
                  className={`text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-primary"
                      : "text-text hover:text-primary"
                  }`}
                >
                  {link.label}
                </span>
                {pathname === link.href && (
                  <motion.div
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            <DarkModeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-text hover:text-primary hover:bg-white/10 dark:hover:bg-gray-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <motion.svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {isMobileMenuOpen ? (
                <motion.path
                  d="M6 18L18 6M6 6l12 12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <>
                  <motion.path
                    d="M4 6h16"
                    initial={false}
                    animate={{ pathLength: 1 }}
                  />
                  <motion.path
                    d="M4 12h16"
                    initial={false}
                    animate={{ pathLength: 1 }}
                  />
                  <motion.path
                    d="M4 18h16"
                    initial={false}
                    animate={{ pathLength: 1 }}
                  />
                </>
              )}
            </motion.svg>
          </button>
        </div>
      </div>

      {/* Premium Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop with glassmorphism */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              aria-hidden="true"
            />

            {/* Menu Content */}
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden fixed inset-0 z-50 flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Decorative background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/98 to-primary/5 dark:from-gray-900/95 dark:via-gray-900/98 dark:to-primary/10 backdrop-blur-xl" />
              
              {/* Animated gradient blob */}
              {!shouldReduceMotion && (
                <motion.div
                  className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/5 dark:bg-accent/10 rounded-full blur-3xl"
                  animate={{
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
              
              {/* Subtle noise texture */}
              <div
                className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Header with close button and theme toggle */}
              <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-4">
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.1, duration: 0.3 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-text hover:text-primary hover:bg-white/10 dark:hover:bg-gray-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>

                {/* Theme Toggle */}
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.1, duration: 0.3 }}
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg text-text hover:text-primary hover:bg-white/10 dark:hover:bg-gray-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent"
                  aria-label="Toggle dark mode"
                >
                  {isDark ? (
                    <motion.svg
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-6 h-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </motion.svg>
                  ) : (
                    <motion.svg
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-6 h-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </motion.svg>
                  )}
                </motion.button>
              </div>

              {/* Navigation Links */}
              <nav className="relative z-10 flex-1 flex flex-col justify-center px-6 pb-20">
                <div className="space-y-2">
                  {navLinks.map((link, index) => {
                    const isActive = pathname === link.href;
                    const totalLinks = navLinks.length;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ 
                          opacity: 0, 
                          y: shouldReduceMotion ? 0 : 10,
                          transition: {
                            delay: shouldReduceMotion ? 0 : (totalLinks - 1 - index) * 0.05,
                            duration: shouldReduceMotion ? 0.1 : 0.3,
                          }
                        }}
                        transition={{
                          delay: shouldReduceMotion ? 0 : 0.15 + index * 0.08,
                          duration: shouldReduceMotion ? 0.1 : 0.4,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`group relative block py-4 px-2 -mx-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent ${
                            isActive
                              ? "text-primary"
                              : "text-text hover:text-primary"
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
                              {link.label}
                            </span>
                            {isActive && (
                              <motion.div
                                layoutId="mobile-menu-indicator"
                                className="ml-3 h-1 w-1 rounded-full bg-accent"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              />
                            )}
                          </div>
                          <motion.div
                            className={`absolute inset-0 rounded-lg ${
                              isActive
                                ? "bg-primary/5 dark:bg-primary/10"
                                : "bg-transparent group-hover:bg-white/5 dark:group-hover:bg-gray-800/30"
                            }`}
                            initial={false}
                            transition={{ duration: 0.2 }}
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Divider */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : 0.5,
                    duration: shouldReduceMotion ? 0.1 : 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="my-8 h-px bg-gradient-to-r from-transparent via-text/20 to-transparent"
                />

                {/* Optional: Footer text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : 0.6,
                    duration: 0.3,
                  }}
                  className="text-center"
                >
                  <p className="text-sm text-text/60">
                    Amras Ali
                  </p>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

