import React from 'react';
import { Microscope, MapPin, Phone } from 'lucide-react';

export default function ReportPreview({ patientDetails, tests, results }) {
  // Advanced numeric evaluation to determine High/Low bounds accurately
  const checkRangeDeviation = (val, rangeStr) => {
    if (!val || !rangeStr) return null;
    const numericVal = parseFloat(val.toString().replace(/,/g, ''));
    if (isNaN(numericVal)) return null;

    const parts = rangeStr.split('-').map(s => s.trim());
    if (parts.length === 2) {
      const min = parseFloat(parts[0].replace(/,/g, ''));
      const max = parseFloat(parts[1].replace(/,/g, ''));
      if (!isNaN(min) && !isNaN(max)) {
        if (numericVal < min) return 'L';
        if (numericVal > max) return 'H';
      }
    } else {
      // Handle "< X" or "> Y"
      const matchLess = rangeStr.match(/<\s*(\d+(\.\d+)?)/);
      if (matchLess) {
        if (numericVal >= parseFloat(matchLess[1])) return 'H';
      }
      const matchGreater = rangeStr.match(/>\s*(\d+(\.\d+)?)/);
      if (matchGreater) {
        if (numericVal <= parseFloat(matchGreater[1])) return 'L';
      }
    }
    return null;
  };

  const todayStr = new Date().toLocaleString('en-GB', { 
    day: '2-digit', month: '2-digit', year: 'numeric', 
    hour: '2-digit', minute: '2-digit', hour12: false 
  });
  
  const dateStr = patientDetails.date ? new Date(patientDetails.date).toLocaleDateString('en-GB') : '';

  return (
    <div className="w-[210mm] h-[297mm] flex flex-col bg-[#ffffff] text-[#000000] relative font-sans mx-auto shadow-sm overflow-hidden">
      
      {/* Background Watermark */}
      <div className="absolute inset-0 z-0 flex justify-center items-center opacity-[0.03] pointer-events-none overflow-hidden mt-40">
         <h1 className="text-[150px] font-bold -rotate-30 tracking-widest uppercase text-[#1e3a8a]">SAI LAB</h1>
      </div>

      <div className="z-10 flex flex-col min-h-full">
        {/* HEADER SECTION (Copied from Slip Design) */}
        <div className="pt-6 px-8 pb-2">
          <div className="flex justify-between items-start border-b-[3px] border-[#1e3a8a] pb-2">
            <div className="flex items-center gap-7">
              {/* Round Logo Area */}
              <div className="w-[100px] h-[100px] rounded-full border-[3px] border-[#1e3a8a] text-[#1e3a8a] flex flex-col items-center justify-center shrink-0 shadow-sm relative bg-[#ffffff]">
                <span className="text-[10px] font-bold tracking-tight uppercase leading-none mt-2 text-center w-full">SAI DIAGNOSTIC</span>
                <Microscope size={32} className="text-[#1e3a8a] my-1" strokeWidth={2} />
                <span className="text-[11px] font-bold tracking-tight uppercase leading-none mb-1">LAB</span>
              </div>
              
              {/* Main Title Area */}
              <div className="flex flex-col justify-center">
                <h1 className="text-6xl font-serif font-bold text-[#dc2626] m-0 leading-none tracking-wider">SAI</h1>
                <h1 className="text-[34px] font-serif font-bold text-[#dc2626] tracking-widest mt-1 m-0 leading-none">DIAGNOSTIC LAB</h1>
                <p className="text-[14px] font-bold text-[#1e3a8a] mt-1 tracking-wide">ਇੱਥੇ ਹਰ ਤਰ੍ਹਾਂ ਦੇ ਟੈਸਟ ਬਾਜ਼ਾਰ ਨਾਲੋਂ ਸਸਤੇ ਰੇਟਾਂ ਵਿੱਚ ਕੀਤੇ ਜਾਂਦੇ ਹਨ ।</p>
                <p className="text-[13px] font-bold text-[#1e3a8a] tracking-wide mt-0.5 uppercase">Technician: RAJESH KUMAR (DMLT)</p>
              </div>
            </div>
            
            {/* Right Info Area */}
            <div className="text-right text-[#1e3a8a] flex flex-col gap-[2px] pr-2 pt-1 border-l-2 border-[#1e3a8a] pl-4 justify-center items-end self-stretch">
              <div className="flex items-center justify-end gap-1.5 font-bold text-[15px]">
                <MapPin size={16} strokeWidth={2.5} className="text-[#1e3a8a]"/> OLD RAJPURA
              </div>
              <div className="text-[12px] font-bold tracking-wide text-[#1e3a8a]">Near Zimidara Ashram</div>
              <div className="flex items-center justify-end gap-1.5 font-bold text-[15px] mt-1.5">
                <Phone size={15} strokeWidth={2.5} className="text-[#1e3a8a]"/> 62391-41075
              </div>
              <div className="text-[12px] font-bold mt-1.5 text-[#1e3a8a]">Reg No: 1541/2024</div>
            </div>
          </div>
        </div>

        {/* PATIENT DETAILS (Professional Table Style) */}
        <div className="px-8 mt-1">
            <div className="flex justify-between items-start mb-2 text-[13px] border border-[#9ca3af] p-3 rounded-sm bg-[#f8fafc]">
                <div className="space-y-1.5 flex-1">
                    <div className="flex"><span className="w-28 font-bold text-[#4b5563]">Patient Name:</span> <span className="uppercase font-black text-[#000000]">{patientDetails.name || '-'}</span></div>
                    {patientDetails.address && (
                      <div className="flex leading-tight"><span className="w-28 font-bold text-[#4b5563]">Address:</span> <span className="uppercase font-black text-[#000000] text-[11px]">{patientDetails.address}</span></div>
                    )}
                    <div className="flex"><span className="w-28 font-bold text-[#4b5563]">Age / Sex:</span> <span className="font-black text-[#000000]">{patientDetails.age || '-'} Yrs / {patientDetails.gender}</span></div>
                    <div className="flex"><span className="w-28 font-bold text-[#4b5563]">Ref By:</span> <span className="uppercase font-black text-[#000000]">{patientDetails.doctor}</span></div>
                </div>
                <div className="space-y-1.5 flex-1 text-right">
                    <div className="flex justify-end"><span className="w-28 text-left font-bold text-[#4b5563]">Report Date:</span> <span className="font-black whitespace-nowrap text-[#000000]">{dateStr}</span></div>
                    <div className="flex justify-end"><span className="w-28 text-left font-bold text-[#4b5563]">Sample Date:</span> <span className="font-black whitespace-nowrap text-[#000000]">{dateStr}</span></div>
                    <div className="flex justify-end"><span className="w-28 text-left font-bold text-[#4b5563]">Mobile No:</span> <span className="font-black whitespace-nowrap text-[#000000]">{patientDetails.phone || '-'}</span></div>
                </div>
            </div>
        </div>

        {/* TEST RESULTS SECTION */}
        <div className="px-8 mt-0 flex-1 relative">

          {!tests || tests.length === 0 ? (
             <div className="text-center text-[#9ca3af] font-bold mt-20">Select tests to preview the report.</div>
          ) : (
            <div className="border border-[#000000] pb-2 mb-2 min-h-[400px]">
              <table className="w-full text-left text-[11px] font-bold leading-[1.6]">
                <thead>
                  <tr className="bg-[#e2e8f0] border-b-2 border-[#000000] text-center">
                    <th className="py-1.5 px-4 text-left w-[45%]">Test Name</th>
                    <th className="py-1.5 px-2 border-l border-[#000000]">Result</th>
                    <th className="py-1.5 px-2 border-l border-[#000000]">Unit</th>
                    <th className="py-1.5 px-4 border-l border-[#000000]">Reference Range</th>
                  </tr>
                </thead>
                <tbody>
                  
                  {tests.map((test, testIndex) => (
                    <React.Fragment key={test._id}>
                      {/* Master Section Header */}
                      <tr>
                        <td colSpan="4" className="bg-[#d9e2ec] font-black text-center py-1 text-[13px] tracking-wide uppercase border-b border-[#000000]">
                          {test.category && test.category !== 'General' ? test.category : test.name}
                        </td>
                      </tr>
                      
                      {/* Parameters mapping */}
                      {test.parameters?.map((param, i) => {
                        const resultObj = results[test._id]?.[param.paramName] || {};
                        const valResult = resultObj.result || '';
                        const valUnit = resultObj.unit !== undefined ? resultObj.unit : param.unit;
                        const valRange = resultObj.range !== undefined ? resultObj.range : param.referenceRange;
                        
                        const deviation = checkRangeDeviation(valResult, valRange);
                        const isRed = deviation !== null;

                        return (
                          <tr key={`${test._id}_${i}`} className="border-b border-[#f1f5f9] last:border-0 text-[#000000]">
                            <td className={`px-4 ${param.group && param.group !== test.name ? "pl-6" : ""} uppercase py-1`}>
                              {param.paramName}
                            </td>
                            <td className={`px-2 text-center py-1 border-l border-[#d1d5db] ${isRed ? 'text-[#ef4444] font-black' : 'text-[#000000]'}`}>
                              <span className="text-[12px]">{valResult}</span>
                              {deviation && <span className="text-[9px] block leading-none uppercase">({deviation})</span>}
                            </td>
                            <td className="px-2 text-center lowercase py-1 border-l border-[#d1d5db] text-[#000000]">{valUnit}</td>
                            <td className="px-4 text-center py-1 border-l border-[#d1d5db] text-[#000000]">{valRange}</td>
                          </tr>
                        );
                      })}
                      
                      {testIndex < tests.length - 1 && (
                        <tr><td colSpan={4} className="h-4 border-b-2 border-[#000000]"></td></tr>
                      )}
                    </React.Fragment>
                  ))}

                  <tr><td colSpan={4} className="h-4"></td></tr>
                  
                  <tr>
                    <td colSpan={4} className="text-center pb-2 pt-2 text-[11px] font-bold border-t border-dashed border-[#9ca3af]">
                      ************ End Of Report ************
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* INTERPRETATION / NOTE SECTION */}
          {patientDetails.note && (
            <div className="mt-4 px-2">
               <h3 className="font-black text-[12px] underline mb-1 uppercase text-[#1e3a8a]">Interpretation / Note:</h3>
               <p className="text-[11px] font-bold text-[#1f2937] whitespace-pre-wrap leading-relaxed">
                 {patientDetails.note}
               </p>
            </div>
          )}
        </div>

        {/* FOOTER SECTION (Copied from Slip Design) */}
        <div className="mt-auto pt-4 shrink-0">
          {/* SIGNATURE AREA (Professional) */}
          <div className="flex justify-between items-end px-12 mb-4">
          
              <div className="text-center translate-y-[-10px]">
                  <p className="text-[12px] font-black underline text-[#000000]">Dr Lal PathLabs Partner</p>
              </div>
              <div className="text-center">
                  <div className="border-b border-[#000000] w-32 mb-1 text-[#000000]"></div>
                  <p className="text-[10px] font-bold text-[#000000]">Signature</p>
              </div>
          </div>

          {/* BLUE BOTTOM STRIP (Exactly like Slip) */}
          <div className="bg-[#1e3a8a] text-[#ffffff] flex justify-between items-center px-8 py-2.5 text-[12px] font-bold border-t border-[#1e3a8a]">
            <div className="flex items-center gap-2">
              <span className="tracking-wide text-[11px]">Report Generated on: {todayStr}</span>
              <span className="bg-[#172554] px-2 py-0.5 ml-4 text-[10px] font-bold tracking-widest text-[#93c5fd]">Not Valid for Medico Legal Purpose</span>
            </div>
            <div className="border border-[#ffffff] px-4 py-0.5 text-center leading-[1.2] tracking-wide text-[11px]">
               Home Sample Collection Available<br/>
               Mob: 62391-41075
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
