'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieToast() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given or declined
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Delay slightly for smoother entrance
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem('cookieConsent', accepted ? 'true' : 'false');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-6 z-[9999] max-w-sm p-6 rounded-3xl bg-white/70 backdrop-blur-xl shadow-2xl border border-white/40 shadow-myf-teal/10"
        >
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-bold text-myf-charcoal mb-2 font-heading">
                We Value Your Privacy
              </h3>
              <p className="text-sm text-myf-muted leading-relaxed">
                We use functional cookies to ensure embedded services (like forms & maps) work properly, and to track basic website traffic so we can improve our community outreach.
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => handleConsent(true)}
                className="flex-1 bg-myf-teal hover:bg-myf-deep text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Accept
              </button>
              <button
                onClick={() => handleConsent(false)}
                className="flex-1 bg-transparent hover:bg-gray-100/50 text-myf-muted text-sm font-medium py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
