import type { Variants, Transition } from 'framer-motion';

/**
 * Shared Framer Motion animation variants
 * Use these across the app for consistent animations
 */

// Default transition settings
export const defaultTransition: Transition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1], // ease-out
};

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

// Fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: defaultTransition,
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
};

// Scale animations
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: defaultTransition,
  },
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
};

// Slide animations
export const slideInFromBottom: Variants = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: { ...defaultTransition, duration: 0.4 },
  },
  exit: {
    y: '100%',
    transition: { ...defaultTransition, duration: 0.3 },
  },
};

export const slideInFromTop: Variants = {
  hidden: { y: '-100%' },
  visible: {
    y: 0,
    transition: defaultTransition,
  },
  exit: {
    y: '-100%',
    transition: defaultTransition,
  },
};

export const slideInFromLeft: Variants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: defaultTransition,
  },
  exit: {
    x: '-100%',
    transition: defaultTransition,
  },
};

export const slideInFromRight: Variants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: defaultTransition,
  },
  exit: {
    x: '100%',
    transition: defaultTransition,
  },
};

// Stagger children animations
export const staggerContainerHidden: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Stagger container with initial/animate naming
export const staggerContainer: Variants = {
  initial: { opacity: 1 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

// Modal/Overlay animations
export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.15 },
  },
};

// Dropdown animations
export const dropdown: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

// Toast/Notification animations
export const toast: Variants = {
  hidden: { opacity: 0, x: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    x: 50,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

// Page transitions
export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// Hover animations (use with whileHover)
export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2 },
};

export const hoverLift = {
  y: -4,
  transition: { duration: 0.2 },
};

export const hoverGlow = {
  boxShadow: '0 8px 30px rgba(63, 114, 175, 0.2)',
  transition: { duration: 0.2 },
};

// Tap animations (use with whileTap)
export const tapScale = {
  scale: 0.98,
};

// Card hover animation
export const cardHover: Variants = {
  rest: {
    y: 0,
    boxShadow: '0 4px 20px rgba(17, 45, 78, 0.08)',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  hover: {
    y: -4,
    boxShadow: '0 8px 30px rgba(17, 45, 78, 0.12)',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

// Button press animation
export const buttonPress: Variants = {
  rest: { scale: 1 },
  pressed: { scale: 0.98 },
  hover: { scale: 1.02 },
};

// Spinner animation
export const spinner: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Pulse animation
export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Scroll-triggered reveal
export const scrollReveal: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Alternative variants using initial/animate naming convention
// (for components using initial="initial" animate="animate")
export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

export const slideDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

export const slideLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
};

export const slideRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
};

// Counter animation for numbers
export const counterAnimation = (from: number, to: number, duration: number = 1) => ({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  // Use with useSpring or animate for the actual counting
});
