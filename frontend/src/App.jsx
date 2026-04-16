import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import History from './components/History';
import ReportGenerator from './components/ReportGenerator';
import TestManager from './components/TestManager';
import { FileText, Database, Activity, Settings, Menu, X } from 'lucide-react';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
        <nav className="bg-white shadow-md border-b sticky top-0 z-40 print-hidden shrink-0">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-4 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-indigo-700 font-bold text-xl md:text-2xl group cursor-pointer">
                <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-indigo-200 shadow-lg group-hover:rotate-12 transition-transform">
               
                </div>
                <Link to="/">
                <span className="leading-tight uppercase tracking-tighter flex flex-col">
                  <span className="text-sm md:text-lg font-bold">SAI DIAGNOSTIC</span>
                 
                </span>
                </Link>
              </div>
              
              {/* Hamburger Button */}
              <button 
                className="md:hidden p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all active:scale-95"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
            
            {/* Desktop Menu & Mobile Dropdown */}
            <div className={`${menuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-stretch md:items-center justify-center gap-2 w-full md:w-auto bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-2xl md:rounded-none border md:border-0 border-slate-100`}>
              <Link onClick={() => setMenuOpen(false)} to="/" className="flex-1 md:flex-none text-left md:text-center px-4 py-3 md:py-2 rounded-xl text-[11px] md:text-sm font-bold uppercase tracking-widest transition-all hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 flex items-center justify-between md:justify-center gap-2">
                <span className="flex items-center gap-2"><Activity size={18} className="md:size-[20px] text-emerald-500 md:text-inherit"/> Report</span>
              </Link>
              <Link onClick={() => setMenuOpen(false)} to="/history" className="flex-1 md:flex-none text-left md:text-center px-4 py-3 md:py-2 rounded-xl text-[11px] md:text-sm font-bold uppercase tracking-widest transition-all hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 flex items-center justify-between md:justify-center gap-2">
                <span className="flex items-center gap-2"><Database size={18} className="md:size-[20px] text-indigo-500 md:text-inherit"/> Records</span>
              </Link>
              <Link onClick={() => setMenuOpen(false)} to="/manage" className="flex-1 md:flex-none text-left md:text-center px-4 py-3 md:py-2 rounded-xl text-[11px] md:text-sm font-bold uppercase tracking-widest transition-all hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 flex items-center justify-between md:justify-center gap-2">
                <span className="flex items-center gap-2"><Settings size={18} className="md:size-[20px] text-slate-500 md:text-inherit"/> Manage</span>
              </Link>
            </div>
          </div>
        </nav>

        <main className="p-0 flex-1 flex flex-col min-h-0 relative">
          <Routes>
            <Route path="/" element={<ReportGenerator />} />
            <Route path="/history" element={<History />} />
            <Route path="/manage" element={<TestManager />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
