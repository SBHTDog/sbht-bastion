// 모달 컴포넌트 - Enhanced Glassmorphism + Responsive
"use client";

import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Enhanced Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-blue-900/30 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Content - Glassmorphism */}
      <div className="relative glass-modal w-full max-w-md sm:max-w-lg md:max-w-xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Close Button - Mobile Friendly */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 transition-all"
          aria-label="닫기"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        {title && (
          <div className="mb-6 pb-4 border-b border-white/20">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 pr-10">{title}</h2>
          </div>
        )}

        {/* Body */}
        {children}
      </div>
    </div>
  );
}
