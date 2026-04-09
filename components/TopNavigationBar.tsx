"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Instagram, ChevronDown, Menu, X } from 'lucide-react';

export default function TopNavigationBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // =========================================================================
  // MODULAR LINKS FOR FUTURE MAINTAINERS:
  // Update the `href` values below to change where the menu links go.
  // =========================================================================
  const LINKS = {
    social: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com"
    },
    home: "/",
    about: {
      atAGlance: "/about/at-a-glance",
      history: "/about/history",
      boardOfDirectors: "/about/board"
    },
    scholarship: {
      becomeContestant: "/competition/contestant",
      forms: "/competition/forms",
      handbook: "/competition/handbook",
      judgingCriteria: "/competition/judging",
      requestScholarship: "/competition/request-scholarship"
    },
    serviceTeam: {
      join: "/service-team/join"
    },
    sponsor: "/sponsor",
    donate: "/donate",
    contact: {
      reachOut: "/contact/reach-out",
      alumni: "/contact/alumni-corner"
    }
  };

  // Nav Item Structure for DRY rendering
  const navItems = [
    { label: "HOME", href: LINKS.home },
    {
      label: "ABOUT US",
      dropdown: [
        { label: "MYF At a Glance", href: LINKS.about.atAGlance },
        { label: "History of Excellence", href: LINKS.about.history },
        { label: "MYF Board of Directors", href: LINKS.about.boardOfDirectors },
      ]
    },
    {
      label: "SCHOLARSHIP COMPETITION",
      dropdown: [
        { label: "Become a Contestant", href: LINKS.scholarship.becomeContestant },
        { label: "Contestant Forms", href: LINKS.scholarship.forms },
        { label: "Contestant Handbook", href: LINKS.scholarship.handbook },
        { label: "Judging Criteria", href: LINKS.scholarship.judgingCriteria },
        { label: "Request Your Scholarship", href: LINKS.scholarship.requestScholarship },
      ]
    },
    {
      label: "STUDENT SERVICE TEAM",
      dropdown: [
        { label: "Join MYF Student Service Team", href: LINKS.serviceTeam.join },
      ]
    },
    { label: "BECOME A SPONSOR", href: LINKS.sponsor },
    { label: "DONATE", href: LINKS.donate },
    {
      label: "CONTACT US",
      dropdown: [
        { label: "Reach Out", href: LINKS.contact.reachOut },
        { label: "Alumni Corner", href: LINKS.contact.alumni }
      ]
    }
  ];

  return (
    <nav className="relative z-50 w-full bg-myf-surface/90 backdrop-blur-md border-b border-black/5">
      {/* 
        TOP TIER: Logo & Socials 
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">

          {/* Logo Area */}
          <div className="flex-shrink-0 flex items-center gap-3">
            {/* Note: Using synthetic logo to match screenshot style */}
            <div className="w-12 h-12 relative flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-myf-gold fill-current">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div className="text-xl md:text-2xl font-sans text-myf-charcoal">
              manteca<span className="text-myf-teal font-bold italic">youthfocus</span>
            </div>
          </div>

          {/* Social Icons (Desktop) & Mobile Hamburger */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 text-myf-teal">
              <a href={LINKS.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-myf-tealDeep transition-colors">
                <Facebook className="w-8 h-8 fill-current" />
              </a>
              <a href={LINKS.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-myf-deep transition-colors">
                <Instagram className="w-8 h-8" strokeWidth={2.5} />
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-myf-charcoal hover:text-myf-teal transition-colors p-2"
              >
                {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 
        BOTTOM TIER: Desktop Navigation Links
      */}
      <div className="hidden md:block bg-myf-bg border-t border-black/5 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2">
            {navItems.map((item, index) => (
              <li
                key={index}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.href ? (
                  // Direct Link
                  <a
                    href={item.href}
                    className="text-sm font-semibold tracking-wide uppercase transition-colors relative py-2 block text-myf-charcoal/80 hover:text-myf-teal"
                  >
                    {item.label}
                    {/* Hover Underline */}
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-myf-teal scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  </a>
                ) : (
                  // Dropdown Trigger
                  <div className="cursor-pointer text-myf-charcoal/80 hover:text-myf-teal text-sm font-semibold tracking-wide uppercase flex items-center gap-1 py-2 relative">
                    {item.label}
                    <ChevronDown className="w-4 h-4" />
                    {/* Hover Underline */}
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-myf-teal scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />

                    {/* Desktop Dropdown Floating Card */}
                    <AnimatePresence>
                      {activeDropdown === item.label && item.dropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="absolute top-full left-0 mt-2 w-64 bg-myf-surface rounded-xl shadow-xl border border-black/5 overflow-hidden z-50 py-2"
                        >
                          {item.dropdown.map((dropItem, dIdx) => (
                            <a
                              key={dIdx}
                              href={dropItem.href}
                              className="block px-6 py-3 text-sm font-medium text-myf-charcoal/70 hover:text-myf-teal hover:bg-myf-bg transition-colors normal-case"
                            >
                              {dropItem.label}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 
        MOBILE MENU: Accordion Layout
      */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-myf-surface border-t border-black/5"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item, index) => (
                <div key={index} className="border-b border-black/5 pb-2">
                  {item.href ? (
                    <a
                      href={item.href}
                      className={`block py-3 text-base font-semibold text-myf-charcoal`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <div>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                        className="flex items-center justify-between w-full py-3 text-base font-semibold text-myf-charcoal"
                      >
                        {item.label}
                        <ChevronDown className={`w-5 h-5 transition-transform ${activeDropdown === item.label ? 'rotate-180 text-myf-teal' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === item.label && item.dropdown && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-4 pr-2"
                          >
                            {item.dropdown.map((dropItem, dIdx) => (
                              <a
                                key={dIdx}
                                href={dropItem.href}
                                className="block py-3 text-sm text-myf-charcoal/70 active:text-myf-teal"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {dropItem.label}
                              </a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Socials */}
              <div className="flex justify-center gap-6 pt-6 pb-4 text-myf-teal">
                <a href={LINKS.social.facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook className="w-8 h-8 fill-current" />
                </a>
                <a href={LINKS.social.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-8 h-8" strokeWidth={2.5} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
