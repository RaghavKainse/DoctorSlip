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
    <div className="p-4 md:p-6 max-w-7xl mx-auto h-auto lg:h-[calc(100vh-74px)] overflow-hidden flex flex-col font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Database className="text-indigo-600" /> Diagnostic History
          </h1>
          <p className="text-sm text-gray-500 font-medium">Archive of all generated laboratory reports</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-xl pl-9 pr-3 py-2 w-full md:w-72 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-1 custom-scrollbar">

          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-[#f8fafc] sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Visit Date</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Identity</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Tests Conducted</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Complexity</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Management</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-24">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Accessing Lab Records...</span>
                  </div>
                </td></tr>
              ) : filteredReports.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-24 text-slate-400 font-medium italic">No diagnostic records found.</td></tr>
              ) : filteredReports.map(item => (
                <tr key={item._id} className="hover:bg-indigo-50/30 transition-all group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-black text-slate-800">{new Date(item.createdAt).toLocaleDateString('en-GB')}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-black text-indigo-900 uppercase tracking-tight">{item.patientDetails?.name || 'Anonymous'}</div>
                    <div className="text-[10px] text-slate-500 font-bold flex items-center gap-2 uppercase tracking-tighter">
                      <span>{item.patientDetails?.age}Y</span> • <span>{item.patientDetails?.gender}</span> • <span>{item.patientDetails?.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {item.tests && item.tests.map((t, i) => (
                        <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-white text-emerald-600 border border-emerald-100 font-black uppercase tracking-tighter shadow-sm">
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="inline-flex items-center px-3 py-1 rounded bg-slate-50 text-[10px] font-black text-slate-500 uppercase border border-slate-100">
                      {item.tests ? item.tests.reduce((acc, t) => acc + (t.results ? Object.keys(t.results).length : 0), 0) : 0} Parameters
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2 opacity-100 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => setViewedReport(item)}
                        className="text-indigo-600 hover:text-indigo-900 font-black text-[10px] px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg uppercase tracking-widest shadow-sm active:scale-95"
                      >
                        View Report
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
      </div>

      {/* VIEW MODAL (WITH AUTO-HEAL LOGIC) */}
      {viewedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex flex-col items-center justify-start lg:justify-center p-0 lg:p-4 overflow-y-auto">
           <div className="w-full lg:max-w-5xl bg-white lg:rounded-t-2xl shadow-2xl p-4 flex flex-col md:flex-row justify-between items-center border-b gap-4 sticky top-0 z-10">
              <div className="flex items-center gap-4 self-start">

                 <button onClick={() => setViewedReport(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-all"><X size={24}/></button>
                 <div>
                    <h2 className="font-black text-indigo-900 uppercase tracking-tight">{viewedReport.patientDetails?.name}</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Diagnostic Report Archive</p>
                 </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto justify-end">
                 <button onClick={handlePrint} className="flex-1 md:flex-none border-2 border-indigo-600 text-indigo-600 px-4 py-2 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all active:scale-95 text-xs uppercase">
                    <Printer size={16}/> Print
                 </button>
                 <button onClick={generatePDF} className="flex-1 md:flex-none bg-indigo-600 text-white px-4 py-2 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg active:scale-95 text-xs uppercase">
                    <Download size={16}/> PDF
                 </button>
                 <button onClick={shareOnWhatsApp} className="bg-emerald-500 text-white p-2 rounded-xl hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
                    <MessageCircle size={22}/>
                 </button>
              </div>
           </div>

           <div className="w-full lg:max-w-5xl bg-slate-200 lg:overflow-y-auto flex-1 lg:rounded-b-2xl shadow-2xl p-4 lg:p-10 flex flex-col items-center custom-scrollbar overflow-x-hidden">
              <div className="transition-all transform scale-[0.42] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 origin-top mb-10 w-fit">
                 <div ref={printRef} className="print-area shadow-2xl bg-white">
                    <ReportPreview 
                      patientDetails={viewedReport.patientDetails} 
                      tests={viewedReport.tests.map(t => {
                        // AUTO-HEAL: If parameters are missing in the report snapshot, fetch them from the master test list
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
