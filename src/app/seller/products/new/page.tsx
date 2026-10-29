"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/app/actions/seller";
import {
  Upload,
  FileText,
  Sparkles,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
  Eye,
} from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceUsd, setPriceUsd] = useState("4.99");
  const [isFree, setIsFree] = useState(false);
  const [pageCount, setPageCount] = useState(25);
  const [isEaselReady, setIsEaselReady] = useState(true);
  const [standards, setStandards] = useState("CCSS.MATH.CONTENT.5.NF.A.1");
  const [fileName, setFileName] = useState("Complete_Instructional_Unit.pdf");
  const [coverImageUrl, setCoverImageUrl] = useState(
    "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80"
  );

  const [selectedGrades, setSelectedGrades] = useState<string[]>(["5th Grade"]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["Math"]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Unit Plans", "Worksheets"]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleGrade = (g: string) => {
    setSelectedGrades((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  const toggleSubject = (s: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMessage("Title and description are required.");
      return;
    }

    if (selectedGrades.length === 0) {
      setErrorMessage("Please select at least one grade level.");
      return;
    }

    if (selectedSubjects.length === 0) {
      setErrorMessage("Please select at least one subject.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const priceCents = isFree ? 0 : Math.round(parseFloat(priceUsd) * 100);
      const standardsList = standards
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await createProduct({
        title,
        description,
        priceCents,
        isFree,
        gradeLevels: selectedGrades,
        subjects: selectedSubjects,
        resourceTypes: selectedTypes,
        pageCount: Number(pageCount),
        fileFormats: isEaselReady ? "PDF, Easel Activity" : "PDF Printable",
        isEaselReady,
        standardsAlignment: standardsList,
        coverImageUrl,
        files: [
          {
            fileName: fileName.trim() || "Resource_Package.pdf",
            fileSize: 14500000,
            mimeType: "application/pdf",
          },
        ],
      });

      if (res.success && res.slug) {
        router.push(`/product/${res.slug}`);
      } else {
        setErrorMessage(res.error || "Failed to publish product.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xs">
        <div className="mb-6 pb-4 border-b border-gray-100">
          <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">
            Teacher-Author Publishing Portal
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-1">
            Upload & Publish New Curriculum
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Our automated asset pipeline extracts preview thumbnails, stamps diagonal watermarks, and configures instant digital fulfillment.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1.5">
              Resource Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 5th Grade Multi-Digit Multiplication & Area Models Mastery Unit"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-1.5">
              Curriculum Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain how to use this resource, what is included (lesson plans, answer keys, worksheets), and how it benefits students..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Grade Level Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-2">
              Target Grade Levels <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "Pre-K",
                "Kindergarten",
                "1st Grade",
                "2nd Grade",
                "3rd Grade",
                "4th Grade",
                "5th Grade",
                "6th Grade",
                "7th Grade",
                "8th Grade",
                "High School",
              ].map((grade) => {
                const isSelected = selectedGrades.includes(grade);
                return (
                  <button
                    type="button"
                    key={grade}
                    onClick={() => toggleGrade(grade)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                      isSelected
                        ? "bg-primary-600 text-white font-bold shadow-xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {grade}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject Area Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-900 mb-2">
              Subject Area <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "Math",
                "ELA",
                "Reading",
                "Writing",
                "Science",
                "Social Studies",
                "Special Education",
                "Classroom Management",
              ].map((sub) => {
                const isSelected = selectedSubjects.includes(sub);
                return (
                  <button
                    type="button"
                    key={sub}
                    onClick={() => toggleSubject(sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                      isSelected
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Standards & Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1.5">
                Standards Alignment (CCSS, TEKS, NGSS)
              </label>
              <input
                type="text"
                value={standards}
                onChange={(e) => setStandards(e.target.value)}
                placeholder="e.g. CCSS.MATH.CONTENT.5.NF.A.1"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1.5">
                Total Page Count
              </label>
              <input
                type="number"
                min="1"
                value={pageCount}
                onChange={(e) => setPageCount(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Digital File Attachment Pipeline */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <Upload className="w-4 h-4 text-primary-600" />
              <span>Digital File Attachment</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Primary Delivery File Name
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-800"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>File will be ingested into the private S3 vault with automated PDF flattening & watermarking.</span>
            </div>
          </div>

          {/* Pricing & Easel Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-900">Pricing</label>
                <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span>Make Free Download</span>
                </label>
              </div>

              {!isFree && (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.25"
                    min="0.50"
                    value={priceUsd}
                    onChange={(e) => setPriceUsd(e.target.value)}
                    className="w-full pl-7 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Easel by TeachConnect Activity</span>
                </div>
                <p className="text-[11px] text-indigo-700 mt-1">
                  Enables interactive digital worksheets and Google Classroom assignment dispatch.
                </p>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-indigo-900 cursor-pointer mt-3">
                <input
                  type="checkbox"
                  checked={isEaselReady}
                  onChange={(e) => setIsEaselReady(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Enable Easel Digital Interactivity</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md transition"
          >
            {isSubmitting ? (
              <span>Publishing Curriculum to TeachConnect...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish to TeachConnect Catalog</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

