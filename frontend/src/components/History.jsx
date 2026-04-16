import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Database, Search, FileText, Trash2, X, Printer, Download, MessageCircle } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import html2pdf from 'html2pdf.js';
import ReportPreview from './ReportPreview';

export default function History() {
  const [reports, setReports] = useState([]);
  const [masterTests, setMasterTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewedReport, setViewedReport] = useState(null);

  const printRef = useRef();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reportsRes, testsRes] = await Promise.all([
          axios.get(`${apiUrl}/api/reports`),
          axios.get(`${apiUrl}/api/tests`)
        ]);
        setReports(reportsRes.data || []);
        setMasterTests(testsRes.data || []);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Report_${viewedReport?.patientDetails?.name || 'Patient'}`,
  });

  const generatePDF = () => {
    const element = printRef.current;
    if (!element) return;
    const opt = {
      margin: 0,
      filename: `${viewedReport?.patientDetails?.name || 'Patient'}_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  const shareOnWhatsApp = () => {
    if (!viewedReport?.patientDetails?.phone) return alert("Phone number not found!");
    const cleanPhone = viewedReport.patientDetails.phone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const message = `*SAI DIAGNOSTIC LAB*\n\nHello *${viewedReport.patientDetails.name.toUpperCase()}*,\n\nYour Diagnostic Report is ready.\n\n_Stay Healthy!_`;
    window.open(`https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filteredReports = reports.filter(report => 
    report.patientDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.patientDetails?.phone?.includes(searchTerm)
  );

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete report for "${name}"?`)) {
      try {
        await axios.delete(`${apiUrl}/api/reports/${id}`);
        setReports(reports.filter(r => r._id !== id));
      } catch (err) { console.error(err); }
    }
  };

  return (
    <div className="p-3 md:p-6 w-full max-w-7xl mx-auto h-auto lg:h-[calc(100vh-74px)] lg:overflow-hidden flex flex-col font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4 md:gap-6">
        <div className="w-full md:w-auto">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Database className="text-indigo-600 shrink-0" size={24} /> History
          </h1>
          <p className="text-[10px] md:text-xs lg:text-sm text-gray-500 font-medium tracking-tight mt-1">All lab reports</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto md:flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search name or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-slate-200 rounded-xl pl-9 pr-3 py-2 w-full md:w-72 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 shadow-sm text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-1 custom-scrollbar">

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden lg:block">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-[#f8fafc] sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Info</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tests Done</th>
                  <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Parameters</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-24">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Records...</span>
                    </div>
                  </td></tr>
                ) : filteredReports.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-24 text-slate-400 font-medium italic">No records found.</td></tr>
                ) : filteredReports.map(item => (
                  <tr key={item._id} className="hover:bg-indigo-50/30 transition-all group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-800">{new Date(item.createdAt).toLocaleDateString('en-GB')}</div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">{new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-indigo-900 uppercase tracking-tight">{item.patientDetails?.name || 'Anonymous'}</div>
                      <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-2 uppercase tracking-tighter">
                        <span>{item.patientDetails?.age}Y</span> • <span>{item.patientDetails?.gender}</span> • <span>{item.patientDetails?.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {item.tests && item.tests.map((t, i) => (
                          <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-white text-emerald-600 border border-emerald-100 font-bold uppercase tracking-tighter shadow-sm">
                            {t.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center px-3 py-1 rounded bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border border-slate-100">
                        {item.tests ? item.tests.reduce((acc, t) => acc + (t.results ? Object.keys(t.results).length : 0), 0) : 0} Parameters
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2 opacity-100 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => setViewedReport(item)}
                          className="text-indigo-600 hover:text-indigo-900 font-bold text-[10px] px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg uppercase tracking-widest shadow-sm active:scale-95"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleDelete(item._id, item.patientDetails?.name)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE & TABLET CARD VIEW */}
          <div className="lg:hidden divide-y divide-gray-100">
            {loading ? (
               <div className="p-10 text-center text-slate-400 font-bold uppercase text-xs tracking-widest animate-pulse">Loading Records...</div>
            ) : filteredReports.length === 0 ? (
               <div className="p-10 text-center text-slate-400 italic">No records.</div>
            ) : filteredReports.map(item => (
              <div key={item._id} className="p-4 bg-white border-b border-gray-100 last:border-0 hover:bg-slate-50 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0 pr-2">
                    <h2 className="font-bold text-indigo-900 uppercase leading-none mb-1 text-sm truncate">{item.patientDetails?.name}</h2>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest flex-wrap">
                       <span>{new Date(item.createdAt).toLocaleDateString('en-GB')}</span>
                       <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                       <span>{new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(item._id, item.patientDetails?.name)}
                    className="p-2 text-slate-200 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase mb-3 bg-slate-50 w-fit px-2 py-1 rounded-lg border border-slate-100">
                   <span>{item.patientDetails?.age}Y</span>
                   <span className="text-slate-300">|</span>
                   <span>{item.patientDetails?.gender}</span>
                   <span className="text-slate-300">|</span>
                   <span>{item.patientDetails?.phone}</span>
                </div>
                
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.tests && item.tests.map((t, i) => (
                    <span key={i} className="text-[9px] px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 font-bold uppercase tracking-tighter border border-emerald-100/50">
                      {t.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setViewedReport(item)}
                    className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <FileText size={14}/> View
                  </button>
                  <div className="bg-slate-100 px-3 py-2.5 rounded-xl flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                    {item.tests ? item.tests.reduce((acc, t) => acc + (t.results ? Object.keys(t.results).length : 0), 0) : 0} P
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* VIEW MODAL (WITH RESPONSIVE SCALING) */}
      {viewedReport && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex flex-col items-center justify-start lg:justify-center p-0 lg:p-4 overflow-y-auto">
           <div className="w-full lg:max-w-5xl bg-white lg:rounded-t-3xl shadow-2xl p-4 flex flex-col md:flex-row justify-between items-center border-b border-slate-100 gap-4 sticky top-0 z-10">
              <div className="flex items-center gap-3 self-start">
                 <button onClick={() => setViewedReport(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-all">
                    <X size={24}/>
                 </button>
                 <div>
                    <h2 className="font-bold text-indigo-900 uppercase tracking-tight text-sm md:text-base">{viewedReport.patientDetails?.name}</h2>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">Report View</p>
                 </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto justify-end">
                 <button onClick={handlePrint} className="flex-1 md:flex-none border-2 border-indigo-600 text-indigo-600 px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all active:scale-95 text-xs uppercase">
                    <Printer size={16}/> Print
                 </button>
                 <button onClick={generatePDF} className="flex-1 md:flex-none bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg active:scale-95 text-xs uppercase">
                    <Download size={16}/> PDF
                 </button>
                 <button onClick={shareOnWhatsApp} className="bg-emerald-500 text-white p-2 rounded-xl hover:bg-emerald-600 transition-all shadow-lg active:scale-95" title="Share via WhatsApp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                    </svg>
                 </button>
              </div>
           </div>

           <div className="w-full lg:max-w-5xl bg-slate-200 lg:overflow-y-auto flex-1 lg:rounded-b-3xl shadow-2xl p-1 md:p-6 lg:p-10 flex flex-col items-center custom-scrollbar overflow-x-auto overflow-y-auto">
              {/* Intelligent Scaling Wrapper */}
              <div className="min-w-fit transition-all transform scale-[0.35] xs:scale-[0.45] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 origin-top mb-10 shadow-2xl hover:shadow-indigo-500/10">
                 <div ref={printRef} className="print-area bg-white">
                    <ReportPreview 
                      patientDetails={viewedReport.patientDetails} 
                      tests={viewedReport.tests.map(t => {
                        const master = masterTests.find(m => String(m._id) === String(t.testId));
                        return { 
                          ...t, 
                          _id: String(t.testId || t._id),
                          parameters: t.parameters && t.parameters.length > 0 ? t.parameters : (master?.parameters || [])
                        };
                      })} 
                      results={viewedReport.tests.reduce((acc, t) => {
                        const kid = String(t.testId || t._id);
                        return { ...acc, [kid]: t.results };
                      }, {})} 
                    />
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
