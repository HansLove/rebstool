/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { FiX, FiCopy, FiShare2, FiCheck } from "react-icons/fi";
// import { QRCodeSVG } from "qrcode.react";
import QRCode from "react-qr-code";
import { motion, AnimatePresence,Variants } from "framer-motion";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string | number;
  // userSlug: string;
  userSlug: string | null;
}

export default function InviteModal({
  isOpen,
  onClose,
  // accountId,
  userSlug,
}: InviteModalProps) {
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Generate the referral link when the component mounts or when userSlug changes
  useEffect(() => {
    if (userSlug) {
      const inviteUrl = `https://go.puprime.partners/visit/?bta=41047&brand=pu&utm_campaign=${userSlug}`;
      setReferralLink(inviteUrl);
    } else {
      fetchReferralLink();
    }
  }, [userSlug]);

  const fetchReferralLink = () => {
    const referralUrl = `https://go.puprime.partners/visit/?bta=41047&brand=pu&utm_campaign=${userSlug}`;
    setReferralLink(referralUrl);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const message = `Join me on Affill! Use my referral link: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareTwitter = () => {
    const message = `I'm using Affill for my affiliate marketing needs. Join using my referral link: ${referralLink}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  // Handle clicking outside to close modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if the click was directly on the backdrop, not on its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };


  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { delay: 0.2, duration: 0.3 },
    },
  };
  
  const modalVariants: Variants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const, // <-- FIX
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      y: 30,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };
  
  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={handleBackdropClick}
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6 relative text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX size={20} />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              className="flex flex-col space-y-5"
              variants={contentVariants}
            >
              <motion.h2
                className="text-xl font-bold text-gray-900 dark:text-white"
                variants={itemVariants}
              >
                Invite Friends to Affill
              </motion.h2>
              <motion.p className="text-gray-600 dark:text-gray-300" variants={itemVariants}>
                Share your unique referral link and earn rewards when friends
                sign up with Affill!
              </motion.p>

              {/* Referral Link with Copy Button */}
              <motion.div
                className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
                variants={itemVariants}
              >
                <div className="text-sm text-gray-700 dark:text-gray-300 font-medium overflow-hidden overflow-ellipsis whitespace-nowrap flex-1 mr-2">
                  {referralLink}
                </div>
                <motion.button
                  onClick={handleCopy}
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
                  <span className="ml-1">{copied ? "Copied!" : "Copy"}</span>
                </motion.button>
              </motion.div>

              {/* QR Code Section */}
              <motion.div variants={itemVariants}>
                <motion.button
                  onClick={() => setShowQR(!showQR)}
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {showQR ? "Hide QR Code" : "Show QR Code"}
                </motion.button>

                <AnimatePresence>
                  {showQR && (
                    <motion.div
                      className="mt-3 flex justify-center"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        transition: { duration: 0.3 },
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <motion.div
                        className="border border-gray-300 dark:border-gray-700 p-3 rounded-md bg-white"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                      >
                        {/* <QRCodeSVG value={referralLink} size={200} /> */}
                        <QRCode
                          value={referralLink}
                          size={200}
                          bgColor="#FFFFFF"
                          fgColor="#000000"
                        />

                        <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-500">
                          Scan to open link
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Share options */}
              <motion.div className="pt-2" variants={itemVariants}>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Or share directly to:
                </p>
                <div className="flex space-x-2">
                  <motion.button
                    onClick={shareWhatsApp}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-md px-3 py-2 flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FiShare2 size={16} className="mr-1" />
                    WhatsApp
                  </motion.button>
                  <motion.button
                    onClick={shareTwitter}
                    className="flex-1 bg-blue-400 hover:bg-blue-500 text-white rounded-md px-3 py-2 flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FiShare2 size={16} className="mr-1" />
                    Twitter
                  </motion.button>
                </div>
              </motion.div>

              {/* Promotional Message */}
              <motion.div
                className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700"
                variants={itemVariants}
              >
                <p className="text-center font-medium text-blue-600 dark:text-blue-400 py-2">
                  Earn $100 for each friend who signs up and makes a deposit!
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
