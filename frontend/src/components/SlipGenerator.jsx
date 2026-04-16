import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SlipPreview from './SlipPreview';
import { User, Activity, Printer, Download, MessageCircle, Trash2 } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import html2pdf from 'html2pdf.js';

export default function SlipGenerator() {
  const [patientDetails, setPatientDetails] = useState({
    name: '', age: '', gender: 'Male', phone: '', doctor: 'Self', date: new Date().toISOString().split('T')[0], address: ''
  });
  const [testList, setTestList] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [hidePrice, setHidePrice] = useState(false);
  const [loading, setLoading] = useState(true);

  const printRef = useRef();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tests`)
      .then(res => {
        setTestList(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handlePatientChange = (e) => {
    setPatientDetails({ ...patientDetails, [e.target.name]: e.target.value });
  };

  const addTest = (test) => {
    if (!selectedTests.find(t => t._id === test._id)) {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const removeTest = (id) => {
    setSelectedTests(selectedTests.filter(t => t._id !== id));
  };

  const subtotal = selectedTests.reduce((acc, curr) => acc + curr.price, 0);
  const total = subtotal - discount;

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Slip_${patientDetails.name || 'Patient'}`,
  });

  const handleDownloadPDF = () => {
    const element = printRef.current;
    const opt = {
      margin:       0,
      filename:     `Slip_${patientDetails.name || 'Patient'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleSaveAndShare = async () => {
    if (!patientDetails.name || !patientDetails.phone) {
      alert("Please enter patient name and phone number to save and share.");
      return;
    }
    try {
      const payload = {
        patientDetails,
        tests: selectedTests.map(t => ({ testId: t._id, name: t.name, price: t.price })),
        subtotal, discount, total
      };
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/slips`, payload);
      
      const text = `*SAI DIAGNOSTIC LAB* %0A%0AHi ${patientDetails.name},%0AHere are your slip details:%0A*Tests:* ${selectedTests.map(t => t.name).join(', ')}%0A${hidePrice ? '' : `*Total Amount:* Rs. ${total}/-%0A`}%0AThank you!`;
      const url = `https://wa.me/91${patientDetails.phone}?text=${text}`;
      window.open(url, '_blank');
    } catch (err) {
      console.error(err);
      alert("Failed to save slip.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 h-[calc(100vh-70px)] bg-slate-50 border-t border-slate-200">
      
      {/* LEFT SIDE - Rigid High-UX Container */}
      <div className="w-full lg:w-[400px] flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden shrink-0">
        
        {/* SCROLLABLE FORMS AREA */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 custom-scrollbar">
          
          {/* PATIENT DETAILS FORM */}
          <div className="shrink-0">
            <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="text-indigo-600" size={16} /> Patient Details
            </h2>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input type="text" name="name" value={patientDetails.name} onChange={handlePatientChange} className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800 font-semibold" placeholder="e.g. John Doe" />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Age</label>
                <input type="text" name="age" value={patientDetails.age} onChange={handlePatientChange} className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800 font-semibold" placeholder="30" />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Gender</label>
                <select name="gender" value={patientDetails.gender} onChange={handlePatientChange} className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800 font-semibold cursor-pointer">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mobile No</label>
                <input type="text" name="phone" value={patientDetails.phone} onChange={handlePatientChange} className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800 font-semibold" placeholder="9876543210" />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Address (Optional)</label>
                <input type="text" name="address" value={patientDetails.address} onChange={handlePatientChange} className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800 font-semibold uppercase" placeholder="e.g. Rajpura" />
              </div>
              
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Reffered By</label>
                <input type="text" name="doctor" value={patientDetails.doctor} onChange={handlePatientChange} className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800 font-bold uppercase" placeholder="dr. self" />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
               <input 
                 type="checkbox" 
                 id="hidePriceToggle" 
                 checked={hidePrice} 
                 onChange={e => setHidePrice(e.target.checked)}
                 className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
               />
               <label htmlFor="hidePriceToggle" className="text-[12px] font-black text-slate-700 cursor-pointer uppercase tracking-tight">
                 Hide Prices (Report Mode)
               </label>
            </div>
          </div>

          {/* TEST SELECTION & BILLING */}
          <div className="shrink-0 flex flex-col pt-2 border-t border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Activity className="text-indigo-600" size={16} /> Add Lab Tests
            </h2>
            
            {loading ? (
               <p className="text-center text-slate-500 py-2 mb-3 border rounded-md bg-slate-50 text-xs">Loading master list...</p>
            ) : (
               <select 
                 className="w-full bg-white border-2 border-indigo-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-slate-700 font-semibold cursor-pointer shadow-sm mb-4 shrink-0 transition-all appearance-none uppercase"
                 style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23a5b4fc\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                 onChange={(e) => {
                   if(!e.target.value) return;
                   const test = testList.find(t => t._id === e.target.value);
                   if(test) addTest(test);
                   e.target.value = ""; 
                 }}
                 defaultValue=""
               >
                 <option value="" disabled className="text-slate-400">-- PICK A TEST FROM LIST --</option>
                 {testList.map(test => (
                   <option key={test._id} value={test._id} className="font-medium text-slate-700 py-2">
                     {test.name.toUpperCase()} - RS. {test.price}
                   </option>
                 ))}
               </select>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
              <h3 className="font-bold text-[10px] text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                Selected Tests 
                <span className="bg-indigo-100 text-indigo-700 py-px px-2 rounded-full font-bold">{selectedTests.length}</span>
              </h3>
              
              <div className="space-y-2 mb-3">
                {selectedTests.length === 0 ? (
                   <div className="w-full text-center py-4 text-slate-400 opacity-60">
                     <span className="text-xs">No tests added.</span>
                   </div>
                ) : selectedTests.map(t => (
                  <div key={t._id} className="flex justify-between items-center bg-white p-2 border border-slate-200 shadow-sm rounded">
                    <span className="text-slate-700 font-bold pr-2 text-xs">{t.name}</span>
                    <div className="flex items-center gap-3">
                      {!hidePrice && <span className="font-bold text-slate-800 text-[11px] whitespace-nowrap">Rs. {t.price}</span>}
                      <button onClick={() => removeTest(t._id)} className="text-slate-300 hover:text-red-500 transition-colors" title="Remove Test">
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* BILLING COMPONENT (Visible only if not hidden) */}
              {!hidePrice && (
                <div className="pt-3 border-t-2 border-dashed border-slate-300 text-xs text-slate-600 font-bold space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Subtotal:</span>
                    <span className="text-slate-800">Rs. {subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span>Discount:</span>
                    <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="bg-white border border-slate-300 rounded-md w-16 text-right px-2 py-0.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" min="0" />
                  </div>
                  <div className="flex justify-between items-center font-black text-[13px] text-slate-800 pt-1">
                    <span className="text-indigo-600">Total:</span>
                    <span>Rs. {total}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LOCKED ACTIONS AT BOTTOM */}
        <div className="flex flex-col gap-2 p-4 bg-slate-50 border-t border-slate-200 shrink-0">
          <div className="flex gap-2">
            <button onClick={handlePrint} className="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-2 rounded-md font-bold flex items-center justify-center gap-2 text-xs shadow-sm transition-colors">
              <Printer size={16} /> Print
            </button>
            <button onClick={handleDownloadPDF} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-bold flex items-center justify-center gap-2 text-xs shadow-sm transition-colors">
              <Download size={16} /> Save PDF
            </button>
          </div>
          <button onClick={handleSaveAndShare} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-2.5 rounded-md font-bold flex items-center justify-center gap-2 text-sm shadow-sm transition-colors focus:ring-2 focus:ring-[#25D366] focus:ring-offset-1 mt-1">
            <MessageCircle size={18} /> Share via WhatsApp
          </button>
        </div>
      </div>

      {/* RIGHT SIDE - A4 Preview */}
      <div className="flex-1 overflow-y-auto bg-slate-200/50 p-4 lg:p-8 flex justify-center items-start print:p-0 print:bg-white print:overflow-visible rounded-2xl inner-shadow border border-slate-200">
        <div ref={printRef} className="bg-white shadow-2xl print:shadow-none w-[210mm] h-[297mm] flex flex-col max-w-full relative mx-auto print:mx-0 overflow-hidden box-border print:h-[297mm]">
          <SlipPreview patientDetails={patientDetails} tests={selectedTests} subtotal={subtotal} discount={discount} total={total} hidePrice={hidePrice} />
        </div>
      </div>
    </div>
  );
}
