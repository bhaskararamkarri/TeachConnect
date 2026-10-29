import React from "react";
import Link from "next/link";
import { GraduationCap, ShieldCheck, Heart, Feather } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#FAF7EE] border-t-2 border-[#F1E8C7] mt-20 text-[#28291F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#4F5B32] border border-[#A38345]/50 flex items-center justify-center text-[#FAF7EE]">
                <GraduationCap className="w-5 h-5 text-[#F1E8C7]" />
              </div>
              <span className="font-serif font-bold text-[#28291F] text-lg">TeachConnect</span>
            </div>
            <p className="text-xs font-serif text-[#555745] leading-relaxed">
              The premier scholarly peer-to-peer repository empowering educators to archive, share, and discover high-impact classroom manuscripts.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-serif font-bold uppercase text-[#4F5B32] tracking-widest mb-4 border-b border-[#F1E8C7] pb-1">
              Scholastic Sections
            </h4>
            <ul className="space-y-2.5 text-xs font-serif text-[#555745]">
              <li><Link href="/search?grade=elementary" className="hover:text-[#4F5B32] hover:underline">Early Academy (Pre-K - 2)</Link></li>
              <li><Link href="/search?grade=middle" className="hover:text-[#4F5B32] hover:underline">Grammar & Middle School</Link></li>
              <li><Link href="/search?grade=high" className="hover:text-[#4F5B32] hover:underline">Upper Academy & High School</Link></li>
              <li><Link href="/search?subject=Math" className="hover:text-[#4F5B32] hover:underline">Mathematical Sciences</Link></li>
              <li><Link href="/search?price=free" className="hover:text-[#4F5B32] hover:underline">Complimentary Folios</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-serif font-bold uppercase text-[#4F5B32] tracking-widest mb-4 border-b border-[#F1E8C7] pb-1">
              Teacher-Authors
            </h4>
            <ul className="space-y-2.5 text-xs font-serif text-[#555745]">
              <li><Link href="/seller/dashboard" className="hover:text-[#4F5B32] hover:underline">Join as Author-Scholar</Link></li>
              <li><Link href="/seller/products/new" className="hover:text-[#4F5B32] hover:underline">Ingest Manuscript</Link></li>
              <li><Link href="/library" className="hover:text-[#4F5B32] hover:underline">Personal Archive Vault</Link></li>
              <li><span className="text-[#A38345]/70">TeachConnect for Academies</span></li>
              <li><span className="text-[#A38345]/70">Institutional Purchase Orders</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-serif font-bold uppercase text-[#4F5B32] tracking-widest mb-4 border-b border-[#F1E8C7] pb-1">
              Provenance & Trust
            </h4>
            <ul className="space-y-2.5 text-xs font-serif text-[#555745]">
              <li className="flex items-center gap-2 text-[#4F5B32] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#A38345] flex-shrink-0" />
                <span>Peer-Reviewed Archives</span>
              </li>
              <li><span>COPPA & FERPA Scholarly Standards</span></li>
              <li><span>Stripe Powered Secure Payouts</span></li>
              <li><span>Classic Copyright & DMCA Protection</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#F1E8C7] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-serif text-[#555745]">
          <p>© 2026 TeachConnect Scholastic Archives Inc. Handcrafted with warm paper and book ink.</p>
          <p className="flex items-center gap-1.5 mt-3 sm:mt-0">
            Dedicated to educators worldwide <Feather className="w-3.5 h-3.5 text-[#A38345]" />
          </p>
        </div>
      </div>
    </footer>
  );
}
