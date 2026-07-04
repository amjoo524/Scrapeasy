"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Recycle, Menu, X, ChevronRight, Leaf, Truck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-emerald-100/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 group-hover:shadow-emerald-600/40 transition-all">
              <Recycle size={22} />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">Scrap<span className="text-emerald-600">Easy</span></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Home</Link>
            <Link href="/about" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">How it Works</Link>
            <Link href="/pricing" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Rates</Link>
            <Link href="/contact" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Contact</Link>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <Link href="/login" className="text-sm font-bold text-slate-700 hover:text-emerald-600 transition-colors">
                Log in
              </Link>
              <Link href="/signup" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-600/25 transition-all hover:scale-105">
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-700">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white/95 border-t border-emerald-100/50 px-6 py-4 space-y-4"
          >
            <Link href="/" className="block text-sm font-semibold text-slate-600 py-2">Home</Link>
            <Link href="/about" className="block text-sm font-semibold text-slate-600 py-2">How it Works</Link>
            <Link href="/pricing" className="block text-sm font-semibold text-slate-600 py-2">Rates</Link>
            <Link href="/contact" className="block text-sm font-semibold text-slate-600 py-2">Contact</Link>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link href="/login" className="text-center text-sm font-bold text-slate-700 py-2">Log in</Link>
              <Link href="/signup" className="text-center px-5 py-3 bg-emerald-600 text-white text-sm font-bold rounded-full">Get Started</Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-100/60 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-200/50">
              <Leaf size={14} />
              <span>Eco-Friendly Scrap Management</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 leading-tight">
              Turn Your Scrap Into <br />
              <span className="text-emerald-600">Real Cash</span>
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              Pakistan's easiest platform to sell scrap from your home. 
              Schedule a pickup, get paid instantly, and save the environment.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-xl shadow-emerald-600/25 transition-all hover:scale-105 flex items-center justify-center gap-2">
                Schedule a Pickup <ChevronRight size={18} />
              </button>
              <button className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-full border border-slate-200 transition-all hover:scale-105 flex items-center justify-center gap-2">
                View Rates <Truck size={18} />
              </button>
            </div>

            <div className="flex items-center gap-6 pt-6 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Verified Pickups</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Leaf size={16} className="text-emerald-600" />
                <span>100% Eco-Friendly</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative hidden lg:block"
          >
            <img 
              src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600" 
              alt="Scrap collection" 
              className="rounded-3xl shadow-2xl shadow-emerald-600/10 border border-white/20"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}