import React from "react";
import Link from "next/link";
import { GraduationCap, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-gray-900 text-lg">TeachConnect</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              The premier peer-to-peer marketplace empowering educators to share, monetize, and discover high-impact classroom materials.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase text-gray-900 tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link href="/search?grade=elementary" className="hover:text-primary-600">Elementary School</Link></li>
              <li><Link href="/search?grade=middle" className="hover:text-primary-600">Middle School</Link></li>
              <li><Link href="/search?grade=high" className="hover:text-primary-600">High School</Link></li>
              <li><Link href="/search?subject=Math" className="hover:text-primary-600">Math Curricula</Link></li>
              <li><Link href="/search?price=free" className="hover:text-primary-600">Free Teaching Resources</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase text-gray-900 tracking-wider mb-3">Educators & Schools</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link href="/seller/dashboard" className="hover:text-primary-600">Become a Teacher-Author</Link></li>
              <li><Link href="/seller/products/new" className="hover:text-primary-600">Upload Resources</Link></li>
              <li><Link href="/library" className="hover:text-primary-600">My Purchased Library</Link></li>
              <li><span className="text-gray-400">TeachConnect for Schools (B2B)</span></li>
              <li><span className="text-gray-400">School Purchase Orders</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase text-gray-900 tracking-wider mb-3">Trust & Security</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-1.5 text-emerald-700">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>Instant Verified Downloads</span>
              </li>
              <li><span>COPPA & FERPA Compliant</span></li>
              <li><span>Stripe Powered Creator Payouts</span></li>
              <li><span>Copyright Protection & DMCA</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
          <p>© 2026 TeachConnect Technologies Inc. Built with care for educators worldwide.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Crafted for teachers by teachers <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
