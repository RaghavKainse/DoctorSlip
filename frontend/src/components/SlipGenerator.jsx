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
    <div className="flex flex-col lg:flex-row gap-6 p-2 md:p-4 lg:p-6 h-auto lg:h-[calc(100vh-70px)] bg-slate-50 border-t border-slate-200 overflow-x-hidden">
      
      {/* LEFT SIDE - Entry Panel */}
      <div className="w-full lg:w-[400px] flex flex-col h-auto lg:h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden shrink-0">

        
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
            <button onClick={handlePrint} className="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-2 rounded-md font-bold flex items-center justify-center gap-2 text-[11px] shadow-sm transition-colors uppercase">
              <Printer size={16} /> Print
            </button>
            <button onClick={handleDownloadPDF} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-bold flex items-center justify-center gap-2 text-[11px] shadow-sm transition-colors uppercase">
              <Download size={16} /> PDF
            </button>
          </div>
          <button onClick={handleSaveAndShare} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-2.5 rounded-md font-bold flex items-center justify-center gap-2 text-[12px] shadow-sm transition-colors focus:ring-2 focus:ring-[#25D366] focus:ring-offset-1 mt-1 uppercase">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
            </svg> Share via WhatsApp
          </button>
        </div>
      </div>


      {/* RIGHT SIDE - A4 Preview */}
      <div className="flex-1 bg-slate-200 p-2 md:p-6 lg:p-10 overflow-auto flex flex-col items-center custom-scrollbar">
        <div className="mt-4 lg:mt-0 transition-all transform scale-[0.42] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 origin-top mb-10 w-fit">
           <div ref={printRef} className="print-area shadow-2xl bg-white">
             <SlipPreview patientDetails={patientDetails} tests={selectedTests} subtotal={subtotal} discount={discount} total={total} hidePrice={hidePrice} />
           </div>
        </div>
      </div>
    </div>
  );
}
