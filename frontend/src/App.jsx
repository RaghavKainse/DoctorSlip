import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import History from './components/History';
import ReportGenerator from './components/ReportGenerator';
import TestManager from './components/TestManager';
import { FileText, Database, Activity, Settings } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
        <nav className="bg-white shadow-sm border-b px-4 md:px-6 py-3 flex flex-col md:flex-row items-center justify-between print-hidden shrink-0 gap-4">
          <div className="flex items-center gap-2 text-indigo-600 font-black text-lg md:text-xl self-start md:self-auto">
            <FileText size={24} />
            <span className="leading-none uppercase tracking-tighter">SAI <br className="hidden md:inline"/> DIAGNOSTIC LAB</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3 md:gap-6 w-full md:w-auto">
            <Link to="/" className="text-emerald-700 hover:text-emerald-800 font-black text-[11px] md:text-sm flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg md:bg-transparent md:p-0 transition-all uppercase tracking-tight">
              <Activity size={18}/> Report
            </Link>
            <Link to="/history" className="text-gray-600 hover:text-indigo-600 font-bold text-[11px] md:text-sm flex items-center gap-1.5 px-3 py-1.5 hover:bg-indigo-50 rounded-lg md:hover:bg-transparent md:p-0 transition-all uppercase tracking-tight">
              <Database size={18}/> Records
            </Link>
            <Link to="/manage" className="text-gray-600 hover:text-indigo-600 font-bold text-[11px] md:text-sm flex items-center gap-1.5 px-3 py-1.5 hover:bg-indigo-50 rounded-lg md:hover:bg-transparent md:p-0 transition-all uppercase tracking-tight">
              <Settings size={18}/> Manage
            </Link>
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
