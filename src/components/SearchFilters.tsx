"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, RotateCcw, Check } from "lucide-react";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentGrade = searchParams.get("grade") || "all";
  const currentSubject = searchParams.get("subject") || "all";
  const currentPrice = searchParams.get("price") || "all";
  const currentFormat = searchParams.get("format") || "all";
  const currentSort = searchParams.get("sort") || "popular";
  const currentQ = searchParams.get("q") || "";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/search?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/search");
  };

  const grades = [
    { label: "All Grades", value: "all" },
    { label: "Kindergarten", value: "Kindergarten" },
    { label: "1st Grade", value: "1st Grade" },
    { label: "3rd Grade", value: "3rd Grade" },
    { label: "5th Grade", value: "5th Grade" },
    { label: "6th - 8th Grade", value: "6th Grade" },
    { label: "High School", value: "High School" },
  ];

  const subjects = [
    { label: "All Subjects", value: "all" },
    { label: "Math & Fractions", value: "Math" },
    { label: "ELA & Phonics", value: "ELA" },
    { label: "Science & Labs", value: "Science" },
    { label: "Social Studies & History", value: "Social Studies" },
    { label: "Classroom Routines", value: "Classroom Management" },
  ];

  const formats = [
    { label: "All Formats", value: "all" },
    { label: "⚡ Easel Activity", value: "Easel" },
    { label: "📄 PDF Printable", value: "PDF" },
    { label: "📊 Google Apps", value: "Google" },
  ];

  const prices = [
    { label: "Any Price", value: "all" },
    { label: "Free Resources", value: "free" },
    { label: "Under $5.00", value: "under-5" },
    { label: "$5.00 - $10.00", value: "5-to-10" },
    { label: "$10.00+", value: "10-plus" },
  ];

  const hasActiveFilters =
    currentGrade !== "all" ||
    currentSubject !== "all" ||
    currentPrice !== "all" ||
    currentFormat !== "all" ||
    currentQ !== "";

  return (
    <aside className="bg-white rounded-2xl border border-gray-200 p-5 space-y-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
          <Filter className="w-4 h-4 text-primary-600" />
          <span>Filter Resources</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Grade Level */}
      <div>
        <h4 className="text-xs font-bold uppercase text-gray-700 tracking-wider mb-2.5">
          Grade Level
        </h4>
        <div className="space-y-1">
          {grades.map((g) => (
            <button
              key={g.value}
              onClick={() => updateParam("grade", g.value)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                currentGrade === g.value
                  ? "bg-primary-50 text-primary-800 font-bold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{g.label}</span>
              {currentGrade === g.value && <Check className="w-3.5 h-3.5 text-primary-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Subject */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold uppercase text-gray-700 tracking-wider mb-2.5">
          Subject Area
        </h4>
        <div className="space-y-1">
          {subjects.map((s) => (
            <button
              key={s.value}
              onClick={() => updateParam("subject", s.value)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                currentSubject === s.value
                  ? "bg-primary-50 text-primary-800 font-bold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{s.label}</span>
              {currentSubject === s.value && <Check className="w-3.5 h-3.5 text-primary-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Format */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold uppercase text-gray-700 tracking-wider mb-2.5">
          Resource Format
        </h4>
        <div className="space-y-1">
          {formats.map((f) => (
            <button
              key={f.value}
              onClick={() => updateParam("format", f.value)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                currentFormat === f.value
                  ? "bg-primary-50 text-primary-800 font-bold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{f.label}</span>
              {currentFormat === f.value && <Check className="w-3.5 h-3.5 text-primary-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold uppercase text-gray-700 tracking-wider mb-2.5">
          Price Range
        </h4>
        <div className="space-y-1">
          {prices.map((p) => (
            <button
              key={p.value}
              onClick={() => updateParam("price", p.value)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                currentPrice === p.value
                  ? "bg-primary-50 text-primary-800 font-bold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{p.label}</span>
              {currentPrice === p.value && <Check className="w-3.5 h-3.5 text-primary-600" />}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
