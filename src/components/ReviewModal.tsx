"use client";

import React, { useState } from "react";
import { Star, MessageSquarePlus, X, Check } from "lucide-react";
import { submitReview } from "@/app/actions/review";

interface ReviewModalProps {
  productId: string;
  productTitle: string;
}

export function ReviewModal({ productId, productTitle }: ReviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [gradeTaught, setGradeTaught] = useState("5th Grade");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData();
    fd.append("productId", productId);
    fd.append("rating", rating.toString());
    fd.append("comment", comment);
    fd.append("gradeTaught", gradeTaught);

    const res = await submitReview(fd);
    setIsSubmitting(false);
    if (res.success) {
      setIsDone(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsDone(false);
      }, 1500);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 flex items-center gap-1.5 transition"
      >
        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
        <span>Review Resource</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {isDone ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Thank you for your review!</h3>
                <p className="text-xs text-gray-500">Your classroom feedback helps fellow teachers find great curricula.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Review Curriculum</h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{productTitle}</p>
                </div>

                {/* Rating Stars */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Overall Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? "text-amber-500 fill-amber-400"
                              : "text-gray-200 fill-gray-100"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grade Taught */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Grade You Taught</label>
                  <input
                    type="text"
                    required
                    value={gradeTaught}
                    onChange={(e) => setGradeTaught(e.target.value)}
                    placeholder="e.g. 5th Grade, Kindergarten"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    How did this work in your classroom?
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share how your students responded, helpful tips for other teachers, or lesson highlights..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  {isSubmitting ? "Submitting..." : "Post Teacher Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

