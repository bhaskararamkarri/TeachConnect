"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Eye, ShieldAlert } from "lucide-react";

export interface PreviewItem {
  id: string;
  previewUrl: string;
  pageNumber: number;
  watermarkText: string;
}

interface WatermarkPreviewModalProps {
  previews: PreviewItem[];
  title: string;
}

export function WatermarkPreviewModal({ previews, title }: WatermarkPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!previews || previews.length === 0) return null;

  const currentPreview = previews[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : previews.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < previews.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full mt-3 py-2 px-4 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
      >
        <Eye className="w-4 h-4 text-primary-400" />
        <span>View Watermarked Sample Pages ({previews.length})</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <div>
                <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">
                  Sample Preview (Page {currentIndex + 1} of {previews.length})
                </span>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{title}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Image Stage with Watermark Layer */}
            <div className="flex-1 relative bg-gray-100 flex items-center justify-center overflow-hidden min-h-[420px] select-none">
              {/* The Actual Page Image */}
              <img
                src={currentPreview.previewUrl}
                alt={`Preview page ${currentPreview.pageNumber}`}
                className="max-h-[60vh] w-auto object-contain shadow-lg"
              />

              {/* Diagonal Watermark Overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center rotate-[-25deg] space-y-12 opacity-35">
                <span className="text-2xl sm:text-4xl font-black text-gray-950 tracking-widest uppercase border-4 border-gray-950 px-6 py-2 rounded-xl">
                  {currentPreview.watermarkText}
                </span>
                <span className="text-xl sm:text-3xl font-black text-gray-950 tracking-widest uppercase">
                  TEACHCONNECT PREVIEW ONLY
                </span>
              </div>

              {/* Nav Buttons */}
              {previews.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md transition"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md transition"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {previews.length > 1 && (
              <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-3">
                {previews.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition ${
                      currentIndex === idx
                        ? "border-primary-600 scale-105 shadow-md"
                        : "border-gray-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={item.previewUrl}
                      alt={`Thumb ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Footer Notice */}
            <div className="px-4 py-2.5 bg-gray-100/90 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
              <span className="flex items-center gap-1.5 text-gray-700">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Protected by TeachConnect Digital Rights Management. Full un-watermarked high-res files delivered upon purchase.</span>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-primary-700 hover:text-primary-800"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
