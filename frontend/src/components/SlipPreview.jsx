import React from 'react';
import { Microscope, MapPin, Phone } from 'lucide-react';

export default function SlipPreview({ patientDetails, tests, subtotal, discount, total, hidePrice }) {
  const dateStr = new Date(patientDetails.date).toLocaleDateString('en-GB');

  return (
    <div className="w-full min-h-full flex flex-col bg-[#ffffff] overflow-hidden text-[#111827] relative">
      {/* HEADER SECTION (Top aligned) */}
      <div className="pt-6 px-8 pb-2">
        <div className="flex justify-between items-start border-b-[3px] border-[#1e3a8a] pb-2">
          <div className="flex items-center gap-7">
            {/* Round Logo Area */}
            <div className="w-[100px] h-[100px] rounded-full border-[3px] border-[#1e3a8a] text-[#1e3a8a] flex flex-col items-center justify-center shrink-0 shadow-sm relative">
              <span className="text-[10px] font-bold tracking-tight uppercase leading-none mt-2 text-center w-full">SAI DIAGNOSTIC</span>
              <Microscope size={32} className="text-[#1e3a8a] my-1" strokeWidth={2} />
              <span className="text-[11px] font-bold tracking-tight uppercase leading-none mb-1">LAB</span>
            </div>
            
            {/* Main Title Area */}
            <div className="flex flex-col justify-center">
              <h1 className="text-6xl font-serif font-bold text-[#dc2626] m-0 leading-none tracking-wider">SAI</h1>
              <h1 className="text-[34px] font-serif font-bold text-[#dc2626] tracking-widest mt-1 m-0 leading-none">DIAGNOSTIC LAB</h1>
              <p className="text-[14px] font-bold text-[#1e3a8a] mt-1 tracking-wide">ਇੱਥੇ ਹਰ ਤਰ੍ਹਾਂ ਦੇ ਟੈਸਟ ਬਾਜ਼ਾਰ ਨਾਲੋਂ ਸਸਤੇ ਰੇਟਾਂ ਵਿੱਚ ਕੀਤੇ ਜਾਂਦੇ ਹਨ ।</p>
              <p className="text-[13px] font-bold text-[#1e3a8a] tracking-wide mt-0.5">Fully Automated Biochemistry Analyzer CHEM-6X</p>
            </div>
          </div>
          
          {/* Right Info Area */}
          <div className="text-right text-[#1e3a8a] flex flex-col gap-[2px] pr-2 pt-1 border-l-2 border-[#1e3a8a] pl-4 justify-center items-end self-stretch">
            <div className="flex items-center justify-end gap-1.5 font-bold text-[15px]">
              <MapPin size={16} strokeWidth={2.5} className="text-[#1e3a8a]"/> OLD RAJPURA
            </div>
            <div className="text-[12px] font-bold tracking-wide">Near Zimidara Ashram</div>
            <div className="flex items-center justify-end gap-1.5 font-bold text-[15px] mt-1.5">
              <Phone size={15} strokeWidth={2.5} className="text-[#1e3a8a]"/> 62391-41075
            </div>
            <div className="text-[12px] font-bold mt-1.5">Medical Technologist</div>
            <div className="font-bold text-[16px] mt-0.5 whitespace-nowrap">Rajesh Kumar <span className="text-[12px] uppercase font-bold">DMLT.</span></div>
          </div>
        </div>
      </div>

      {/* BODY SECTION (Takes remaining space) */}
      <div className="flex-1 px-8 flex flex-col">
        {/* PATIENT DETAILS */}
        <div className="flex justify-between items-start mb-2 text-[14px] border border-[#9ca3af] p-2.5 rounded-sm shrink-0">
          <div className="space-y-1 flex-1">
            <div className="flex"><span className="w-24 font-bold text-[#1f2937]">Patient ID:</span> <span className="font-bold text-[#111827]">#SLP{Math.floor(Math.random()*10000).toString().padStart(4,'0')}</span></div>
            <div className="flex"><span className="w-24 font-bold text-[#1f2937]">Name:</span> <span className="uppercase font-bold text-[#111827]">{patientDetails.name || '-'}</span></div>
            {patientDetails.address && (
              <div className="flex leading-tight"><span className="w-24 font-bold text-[#1f2937]">Address:</span> <span className="uppercase font-bold text-[#111827] text-[12px]">{patientDetails.address}</span></div>
            )}
            <div className="flex"><span className="w-24 font-bold text-[#1f2937]">Age / Sex:</span> <span className="font-bold text-[#111827]">{patientDetails.age || '-'} Yrs / {patientDetails.gender}</span></div>
          </div>
          <div className="space-y-1 flex-1 text-right">
            <div className="flex justify-end"><span className="w-20 font-bold text-[#1f2937] text-left">Date:</span> <span className="font-bold whitespace-nowrap">{dateStr}</span></div>
            <div className="flex justify-end"><span className="w-20 font-bold text-[#1f2937] text-left">Phone:</span> <span className="font-bold whitespace-nowrap">{patientDetails.phone || '-'}</span></div>
            <div className="flex justify-end"><span className="w-20 font-bold text-[#1f2937] text-left">Ref By:</span> <span className="uppercase font-bold text-[#111827] whitespace-nowrap">{patientDetails.doctor}</span></div>
          </div>
        </div>

        {/* TESTS TABLE */}
        <div className="flex-1 shrink-0">
          <table className="w-full text-left border-collapse border border-[#9ca3af]">
            <thead>
              <tr className="bg-[#f3f4f6] border-b-2 border-[#9ca3af]">
                <th className="py-2 px-3 font-bold text-[#111827] text-center border-r border-[#9ca3af] w-16">Sr No.</th>
                <th className="py-2 px-4 font-bold text-[#111827] border-r border-[#9ca3af]">Test Description</th>
                {!hidePrice && <th className="py-2 px-4 font-bold text-[#111827] w-40 text-center">Amount (Rs)</th>}
              </tr>
            </thead>
            <tbody>
              {tests && tests.length > 0 ? tests.map((test, idx) => (
                <tr key={idx} className="border-b border-[#d1d5db]">
                  <td className="py-1.5 px-3 text-center font-bold text-[#1f2937] border-r border-[#9ca3af]">{idx + 1}</td>
                  <td className="py-1.5 px-4 font-bold uppercase text-[#111827] border-r border-[#9ca3af]">{test.name}</td>
                  {!hidePrice && <td className="py-1.5 px-4 text-center font-bold text-[#111827]">{test.price.toFixed(2)}</td>}
                </tr>
              )) : (
                <tr>
                  <td colSpan={hidePrice ? "2" : "3"} className="py-8 text-center text-gray-500 font-bold">No tests selected yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TOTALS (Hidden if hidePrice is active) */}
        {!hidePrice && (
          <div className="mt-2 flex justify-end shrink-0 mb-3">
            <div className="w-72 p-2 border-2 border-[#9ca3af] rounded-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-[#1f2937]">Subtotal</span>
                <span className="font-bold text-[15px]">Rs. {subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-[#b91c1c] mb-1 border-b border-[#d1d5db] pb-1">
                  <span className="font-bold">Discount</span>
                  <span className="font-bold">- Rs. {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center font-black text-[17px] pt-1">
                <span className="text-[#111827]">Total Payable</span>
                <span className="text-[#111827]">Rs. {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER SECTION (Bottom locked) */}
      <div className="mt-auto pt-4 shrink-0">
        {/* SIGNATURE */}
        <div className="flex justify-end pr-8 mb-4">
          <div className="text-center w-40">
            <div className="border-b-2 border-[#111827] h-12 w-full mb-1"></div>
            <p className="font-bold text-[14px] text-[#1e3a8a]">Signature</p>
          </div>
        </div>

        {/* TESTS LIST & DR LAL PATHLABS */}
        <div className="flex justify-between items-center text-[11px] text-[#1e3a8a] font-bold px-8 pb-3">
          <div className="flex items-center justify-center p-2 border-[1.5px] border-[#60a5fa] bg-[#eff6ff] rounded-sm h-12">
             <span className="font-serif italic font-black text-[17px] text-[#1e40af] tracking-wide">Dr Lal PathLabs</span>
          </div>
          
          <div className="flex gap-14 text-[12px] pl-4">
             <ul className="list-none leading-[1.3] m-0 p-0 text-left text-[#1e3a8a]">
               <li>Clinical Biochemistry</li>
               <li>Haematology</li>
               <li>Microbiology</li>
             </ul>
             <ul className="list-none leading-[1.3] m-0 p-0 text-left text-[#1e3a8a]">
               <li>Lipid Profile</li>
               <li>Liver Profile</li>
               <li>Kidney Profile</li>
             </ul>
             <div className="leading-[1.3] text-left max-w-[180px] text-[#1e3a8a]">
               Elisa for IH FSH Prolactin<br/>
               Thyroid Aids Hepatitis<br/>
               & All other Routine Test
             </div>
          </div>
        </div>

        {/* BLUE BOTTOM STRIP */}
        <div className="bg-[#1e3a8a] text-[#ffffff] flex justify-between items-center px-8 py-2.5 text-[12px] font-bold border-t border-[#1e3a8a]">
          <div className="flex items-center gap-2">
            <span className="tracking-wide">Timing Summer 7.00 am to 8.00 pm Sunday upto 2.00 pm</span>
            <span className="bg-[#172554] px-2 py-0.5 ml-4 text-[11px] font-bold tracking-widest text-[#93c5fd]">Not Valid for Medico Legal Purpose</span>
          </div>
          <div className="border border-[#ffffffcc] px-4 py-0.5 text-center leading-[1.2] tracking-wide">
            Home Sample Collection<br/>
            also available here.
          </div>
        </div>
      </div>
    </div>
  );
}
