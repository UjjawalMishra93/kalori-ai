'use client';

import { motion, Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

// Re-export motion primitives with pre-configured variants
// so page.tsx can stay as a Server Component

export const MotionNav = ({ children }: { children: React.ReactNode }) => (
  <motion.nav
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto w-full z-50"
  >
    {children}
  </motion.nav>
);

export const MotionHeroText = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={staggerContainer}
    initial="hidden"
    animate="visible"
    className="flex flex-col space-y-8 relative z-10"
  >
    {children}
  </motion.div>
);

export const MotionFadeUp = ({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    transition={{ delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const MotionHeroImage = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
    className="relative h-[500px] lg:h-[650px] w-full mt-10 lg:mt-0"
  >
    {children}
  </motion.div>
);

export const MotionCard = ({
  children,
  className,
  delay = 0,
  fromY = 50,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  fromY?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: fromY }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const MotionScaleIn = ({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const MotionSlideIn = ({
  children,
  className,
  direction = 'left',
}: {
  children: React.ReactNode;
  className?: string;
  direction?: 'left' | 'right';
}) => (
  <motion.div
    initial={{ opacity: 0, x: direction === 'left' ? -50 : 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

export const MotionStagger = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={staggerContainer}
    className={className}
  >
    {children}
  </motion.div>
);

export const MotionStaggerItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div variants={fadeUp} className={className}>
    {children}
  </motion.div>
);

export const MotionNotification = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, rotate: 3 }}
    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    className="relative h-[600px] w-full flex justify-center md:justify-end"
  >
    {children}
  </motion.div>
);
