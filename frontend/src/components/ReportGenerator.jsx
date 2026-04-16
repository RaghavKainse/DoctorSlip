import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { User, Printer, Download, MessageCircle, Trash2, Save } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import html2pdf from 'html2pdf.js';
import { Link } from 'react-router-dom';
import ReportPreview from './ReportPreview';

export default function ReportGenerator() {
  const [patientDetails, setPatientDetails] = useState({
    name: '', age: '', gender: 'Male', phone: '', doctor: 'DR.SELF', date: new Date().toISOString().split('T')[0],
    note: '', address: ''
  });
  const [testList, setTestList] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  const printRef = useRef();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/tests`);
      setTestList(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handlePatientChange = (e) => {
    setPatientDetails({ ...patientDetails, [e.target.name]: e.target.value });
  };

  const handleTestSelection = (e) => {
    const testId = e.target.value;
    if (!testId) return;
    if (selectedTests.find(t => t._id === testId)) {
       e.target.value = ""; 
       return;
    }

    const test = testList.find(t => t._id === testId);
    if (!test) return;

    setSelectedTests([...selectedTests, test]);
    
    // Initialize results state deeply for this specific test
    const newTestResults = {};
    if (test.parameters) {
      test.parameters.forEach(p => {
        newTestResults[p.paramName] = {
           result: '',
           unit: p.unit || '',
           range: p.referenceRange || ''
        };
      });
    }
    
    setResults(prev => ({
      ...prev,
      [testId]: newTestResults
    }));

    e.target.value = ""; 
  };

  const removeTest = (testId) => {
    const test = selectedTests.find(t => t._id === testId);
    if (window.confirm(`Remove "${test?.name || 'this test'}" from current report?`)) {
      setSelectedTests(selectedTests.filter(t => t._id !== testId));
      setResults(prev => {
        const next = { ...prev };
        delete next[testId];
        return next;
      });
    }
  };

  const handleResultChange = (testId, paramName, field, value) => {
    setResults(prev => ({
      ...prev,
      [testId]: {
        ...(prev[testId] || {}),
        [paramName]: {
          ...(prev[testId]?.[paramName] || {}),
          [field]: value 
        }
      } 
    }));
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Report_${patientDetails.name || 'Patient'}`,
  });

  const generatePDF = () => {
    const element = printRef.current;
    const opt = {
      margin: 0,
      filename: `${patientDetails.name || 'Patient'}_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  const shareOnWhatsApp = () => {
    if (!patientDetails.phone) return alert("Please enter patient phone number!");
    const cleanPhone = patientDetails.phone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    
    const message = `*SAI DIAGNOSTIC LAB*\n\nHello *${patientDetails.name.toUpperCase()}*,\n\nYour Diagnostic Report is ready.\n\n_Stay Healthy!_`;
    window.open(`https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const saveReportToDB = async () => {
    if (!patientDetails.name) return alert("Please enter patient name!");
    
    const emptyTest = selectedTests.find(t => !t.parameters || t.parameters.length === 0);
    if (emptyTest) {
      return alert(`Test "${emptyTest.name}" has no parameters defined in Manage Tests. Please add parameters first!`);
    }

    try {
      const finalTests = selectedTests.map(t => ({
        testId: t._id,
        name: t.name,
        category: t.category,
        parameters: JSON.parse(JSON.stringify(t.parameters)), 
        results: results[t._id] || {}
      }));

      const payload = {
        patientDetails,
        tests: finalTests,
        createdAt: new Date().toISOString()
      };

      await axios.post(`${apiUrl}/api/reports`, payload);
      alert("✅ Full Report Data saved to history successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save report data.");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
       <div className="flex flex-col items-center gap-4">
         <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
         <p className="text-gray-500 font-semibold uppercase tracking-widest text-sm">Loading...</p>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-74px)] overflow-hidden lg:overflow-hidden bg-gray-100 font-sans">
      <div className="w-full lg:w-[450px] bg-white border-r shadow-2xl flex flex-col z-10 lg:h-full overflow-y-auto lg:overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          <section className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b pb-2">
              <User size={14}/> Patient Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input name="name" placeholder="Full Name" onChange={handlePatientChange} value={patientDetails.name} className="border p-2 rounded-lg text-sm font-semibold col-span-2 focus:ring-2 focus:ring-indigo-100 outline-none uppercase" />
              <input name="age" placeholder="Age" onChange={handlePatientChange} value={patientDetails.age} className="border p-2 rounded-lg text-sm" />
              <select name="gender" onChange={handlePatientChange} value={patientDetails.gender} className="border p-2 rounded-lg text-sm font-semibold">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <input name="phone" placeholder="Contact No" onChange={handlePatientChange} value={patientDetails.phone} className="border p-2 rounded-lg text-sm col-span-2" />
              <input name="address" placeholder="Patient Address (Optional)" onChange={handlePatientChange} value={patientDetails.address} className="border p-2 rounded-lg text-sm col-span-2 focus:ring-2 focus:ring-indigo-100 outline-none uppercase" title="Optional Address" />
              <input name="doctor" placeholder="Referred By" onChange={handlePatientChange} value={patientDetails.doctor} className="border p-2 rounded-lg text-sm font-semibold uppercase bg-white" />
              <input name="date" type="date" onChange={handlePatientChange} value={patientDetails.date} className="border p-2 rounded-lg text-sm" />
            </div>
            <div className="mt-4">
               <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1 tracking-widest">Notes</label>
               <textarea 
                name="note" 
                value={patientDetails.note} 
                onChange={handlePatientChange}
                placeholder=""
                className="w-full border rounded-xl p-3 text-sm font-medium h-24 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
               ></textarea>
            </div>
          </section>

          <section className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-h-[300px]">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b pb-2">
               Test Selection
            </h3>

            <select 
              onChange={handleTestSelection} 
              className="w-full border-2 border-indigo-100 rounded-xl p-3 text-sm font-semibold mb-5 shadow-sm focus:border-indigo-500 outline-none transition-all uppercase cursor-pointer bg-white text-slate-700 appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23a5b4fc\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
            >
              <option value="" className="text-slate-400 bg-white py-4">-- SELECT A TEST --</option>
              {testList.map(t => (
                <option key={t._id} value={t._id} className="font-medium text-slate-700 bg-white py-4 border-b border-slate-50 uppercase">
                  {t.name}
                </option>
              ))}
            </select>

            <div className="space-y-6">
              {selectedTests.map((test, tIdx) => (
                <div key={test._id} className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="bg-slate-100/80 px-4 py-3 flex justify-between items-center border-b border-slate-200">
                    <span className="font-bold text-[12px] text-indigo-900 uppercase tracking-tight">{test.name}</span>
                    <button onClick={() => removeTest(test._id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={16}/>
                    </button>
                  </div>

                  {(!test.parameters || test.parameters.length === 0) ? (
                    <div className="p-4 flex flex-col items-center gap-3">
                      <div className="text-[10px] font-bold text-orange-600 bg-orange-50 px-4 py-2 rounded-full uppercase border border-orange-100">No Parameters Found</div>
                      <Link to="/manage" className="text-[9px] font-bold text-indigo-600 underline uppercase tracking-widest hover:text-indigo-800 transition-all">Add parameters to this test</Link>
                    </div>
                  ) : (
                    <div className="p-3 space-y-2 bg-slate-50/30">
                      {test.parameters.map((param, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                          <label className="text-[11px] font-semibold text-indigo-900 uppercase min-w-[150px] truncate leading-tight">
                            {param.paramName}
                          </label>
                          <div className="flex-1">
                            <input 
                              id={`entry-${tIdx}-${i}`}
                              type="text" 
                              value={results[test._id]?.[param.paramName]?.result || ''} 
                              onChange={(e) => handleResultChange(test._id, param.paramName, 'result', e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const nextId = `entry-${tIdx}-${i + 1}`;
                                  const nextEl = document.getElementById(nextId);
                                  if (nextEl) {
                                    nextEl.focus();
                                  } else {
                                    const nextTestFirstId = `entry-${tIdx + 1}-0`;
                                    const nextTestEl = document.getElementById(nextTestFirstId);
                                    if (nextTestEl) nextTestEl.focus();
                                  }
                                }
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm font-semibold text-emerald-600 transition-all text-center"
                              placeholder="Value"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="p-5 border-t bg-slate-50 flex gap-2 shrink-0 sticky bottom-0 z-20">
          <button onClick={saveReportToDB} className="flex-1 bg-white border-2 border-indigo-200 text-indigo-600 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 uppercase tracking-tighter">
            <Save size={18} /> Save
          </button>
          <button onClick={handlePrint} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 uppercase tracking-tighter">
            <Printer size={18} /> Print
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-200 p-2 md:p-6 lg:p-10 overflow-auto flex flex-col items-center custom-scrollbar">
        <div className="mt-4 lg:mt-0 transition-all transform scale-[0.42] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 origin-top mb-10 w-fit">
           <div ref={printRef} className="print-area shadow-2xl bg-white">
             <ReportPreview patientDetails={patientDetails} tests={selectedTests} results={results} />
           </div>
        </div>
        
        <div className="fixed bottom-10 right-10 flex flex-col gap-3 print-hidden">
          <button onClick={generatePDF} className="bg-emerald-600 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-700 transition-all active:scale-90" title="Download PDF">
            <Download size={24} />
          </button>
          <button onClick={shareOnWhatsApp} className="bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:bg-indigo-700 transition-all active:scale-90" title="Share on WhatsApp">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
