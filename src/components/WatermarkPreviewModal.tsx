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
        className="w-full mt-4 py-3 px-4 bg-[#28291F] hover:bg-black text-[#FAF7EE] text-xs font-serif font-bold rounded-2xl flex items-center justify-center gap-2 transition shadow-md border border-[#A38345]/40"
      >
        <Eye className="w-4 h-4 text-[#A38345]" />
        <span>Inspect Watermarked Manuscript Samples ({previews.length} pages)</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#28291F]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#FAF7EE] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-[#A38345]/40">
            {/* Modal Header */}
            <div className="p-4.5 border-b border-[#F1E8C7] flex items-center justify-between bg-[#F1E8C7]/60">
              <div>
                <span className="text-xs font-serif font-bold text-[#4F5B32] uppercase tracking-wider">
                  Archival Manuscript Sample (Folio {currentIndex + 1} of {previews.length})
                </span>
                <h3 className="text-sm font-serif font-bold text-[#28291F] line-clamp-1">{title}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#555745] hover:text-[#28291F] rounded-full hover:bg-[#F1E8C7] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Image Stage with Watermark Layer */}
            <div className="flex-1 relative bg-[#F1E8C7]/30 flex items-center justify-center overflow-hidden min-h-[420px] select-none p-4">
              {/* The Actual Page Image */}
              <img
                src={currentPreview.previewUrl}
                alt={`Preview page ${currentPreview.pageNumber}`}
                className="max-h-[60vh] w-auto object-contain shadow-lg rounded-xl border border-[#A38345]/30 bg-[#FAF7EE]"
              />

              {/* Diagonal Watermark Overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center rotate-[-25deg] space-y-12 opacity-30">
                <span className="text-2xl sm:text-4xl font-serif font-black text-[#28291F] tracking-widest uppercase border-4 border-[#28291F] px-6 py-2 rounded-xl bg-[#FAF7EE]/60 shadow-sm">
                  {currentPreview.watermarkText}
                </span>
                <span className="text-xl sm:text-3xl font-serif font-black text-[#28291F] tracking-widest uppercase">
                  TEACHCONNECT ARCHIVE PREVIEW
                </span>
              </div>

              {/* Nav Buttons */}
              {previews.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 p-2.5 rounded-full bg-[#FAF7EE] hover:bg-[#F1E8C7] text-[#28291F] shadow-md transition border border-[#A38345]/30"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 p-2.5 rounded-full bg-[#FAF7EE] hover:bg-[#F1E8C7] text-[#28291F] shadow-md transition border border-[#A38345]/30"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {previews.length > 1 && (
              <div className="p-3.5 bg-[#F1E8C7]/50 border-t border-[#F1E8C7] flex items-center justify-center gap-3">
                {previews.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
                      currentIndex === idx
                        ? "border-[#4F5B32] scale-105 shadow-md bg-[#FAF7EE]"
                        : "border-[#A38345]/30 opacity-70 hover:opacity-100 bg-[#FAF7EE]"
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
            <div className="px-5 py-3 bg-[#F1E8C7]/80 border-t border-[#F1E8C7] flex items-center justify-between text-[11px] font-serif text-[#555745]">
              <span className="flex items-center gap-1.5 text-[#28291F]">
                <ShieldAlert className="w-3.5 h-3.5 text-[#A38345]" />
                <span>Protected by TeachConnect Scholastic DRM. Unaltered high-resolution PDFs delivered upon acquisition.</span>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs font-serif font-bold text-[#4F5B32] hover:text-[#3B4425]"
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
