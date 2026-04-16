import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, Plus, Trash2, Activity, Save, X, List, Layers, Search } from 'lucide-react';

export default function TestManager() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [managedTest, setManagedTest] = useState(null); // For managing parameters
  const [searchTerm, setSearchTerm] = useState('');
  const [newTest, setNewTest] = useState({
    name: '', price: 0, category: 'General', parameters: []
  });

  const [isAddingParam, setIsAddingParam] = useState(false);
  const [newParam, setNewParam] = useState({ paramName: '', unit: '', referenceRange: '' });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/tests`);
      setTests(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCreateTest = async () => {
    if (!newTest.name) return alert("Test name is required!");
    try {
      await axios.post(`${apiUrl}/api/tests`, newTest);
      setShowAddForm(false);
      setNewTest({ name: '', price: 0, category: 'General', parameters: [] });
      fetchTests();
      alert("New test added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add test.");
    }
  };

  const handleDeleteTest = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" permanently from the database? This cannot be undone.`)) {
      try {
        await axios.delete(`${apiUrl}/api/tests/${id}`);
        setTests(tests.filter(t => t._id !== id));
        alert("Test deleted successfully.");
      } catch (err) {
        console.error(err);
        alert("Failed to delete test.");
      }
    }
  };

  const addParameterToMaster = async (testId) => {
    if (!newParam.paramName) return alert("Parameter Name is required!");

    try {
      const res = await axios.put(`${apiUrl}/api/tests/${testId}/parameters`, {
        paramName: newParam.paramName, 
        unit: newParam.unit, 
        referenceRange: newParam.referenceRange, 
        group: managedTest.name
      });
      setManagedTest(res.data);
      setTests(tests.map(t => t._id === testId ? res.data : t));
      setIsAddingParam(false);
      setNewParam({ paramName: '', unit: '', referenceRange: '' });
    } catch (err) {
      console.error(err);
      alert("Failed to add parameter.");
    }
  };

  const removeParameterFromMaster = async (testId, pIndex) => {
    if(!window.confirm("Delete this parameter?")) return;
    
    const updatedParams = [...managedTest.parameters];
    updatedParams.splice(pIndex, 1);

    try {
      // We need a way to update the whole array or delete by ID
      // For now, let's add a backend route for full update or use existing one if tweaked
      const res = await axios.put(`${apiUrl}/api/tests/${testId}`, { parameters: updatedParams });
      setManagedTest(res.data);
      setTests(tests.map(t => t._id === testId ? res.data : t));
    } catch (err) {
      alert("Failed to remove. Ensure backend supports full test update.");
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto h-auto lg:h-[calc(100vh-74px)] overflow-hidden flex flex-col font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Layers className="text-indigo-600" /> Manage Tests
          </h1>
          <p className="text-sm text-gray-500 font-medium italic">Add, view or delete test parameters</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-2.5 text-slate-400" size={18}/>
             <input 
               type="text" 
               placeholder="Search tests..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-9 pr-3 py-2 border rounded-xl outline-none focus:border-indigo-500 shadow-sm text-sm"
             />
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 text-sm uppercase"
          >
            <Plus size={18} /> New Test
          </button>
        </div>
      </div>

      {/* PARAMETERS MANAGEMENT MODAL */}
      {managedTest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-100 flex items-center justify-center p-0 md:p-4 overflow-y-auto">
          <div className="bg-white md:rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 min-h-screen md:min-h-0">

             <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                <div>
                   <h2 className="font-bold text-lg tracking-tight uppercase">{managedTest.name}</h2>
                   <p className="text-[10px] uppercase font-semibold text-indigo-200 tracking-widest">{managedTest.category}</p>
                </div>
                <button onClick={() => setManagedTest(null)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24}/></button>
             </div>
             
             <div className="p-6 h-[400px] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-slate-700 flex items-center gap-2"><List size={18}/> Test Parameters ({managedTest.parameters?.length || 0})</h3>
                   {!isAddingParam && (
                     <button 
                      onClick={() => setIsAddingParam(true)}
                      className="text-[11px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full uppercase hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1"
                     >
                       <Plus size={14}/> Add New Parameter
                     </button>
                   )}
                </div>

                {/* INLINE ADD PARAMETER FORM */}
                {isAddingParam && (
                  <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl mb-4 space-y-3 shadow-inner">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-1"><Plus size={12}/> New Parameter</h4>
                      <button onClick={() => setIsAddingParam(false)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={16}/></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Parameter Name *</label>
                        <input type="text" value={newParam.paramName} onChange={e => setNewParam({...newParam, paramName: e.target.value})} className="w-full text-xs px-3 py-2 border border-emerald-200 rounded-lg outline-none focus:border-emerald-500 font-bold" placeholder="e.g. HEMOGLOBIN" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Unit</label>
                        <input type="text" value={newParam.unit} onChange={e => setNewParam({...newParam, unit: e.target.value})} className="w-full text-xs px-3 py-2 border border-emerald-200 rounded-lg outline-none focus:border-emerald-500 font-semibold" placeholder="e.g. g/dL" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Reference Range</label>
                        <input type="text" value={newParam.referenceRange} onChange={e => setNewParam({...newParam, referenceRange: e.target.value})} className="w-full text-xs px-3 py-2 border border-emerald-200 rounded-lg outline-none focus:border-emerald-500 font-semibold" placeholder="e.g. 13.0 - 17.0" />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                       <button onClick={() => addParameterToMaster(managedTest._id)} className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all shadow-md active:scale-95 flex items-center gap-2">
                         <Save size={14}/> Save 
                       </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                   {managedTest.parameters?.length === 0 ? (
                      <div className="text-center py-10 text-slate-400 italic bg-slate-50 rounded-xl border border-dashed">No parameters defined yet. Add the first one!</div>
                   ) : managedTest.parameters.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl group hover:border-indigo-300 transition-all">
                         <div className="flex-1">
                            <div className="text-xs font-bold text-slate-800 uppercase">{p.paramName}</div>
                            <div className="text-[10px] text-slate-500 font-semibold flex gap-3">
                               <span>UNIT: <span className="text-slate-700">{p.unit || '-'}</span></span>
                               <span>RANGE: <span className="text-slate-700">{p.referenceRange || '-'}</span></span>
                            </div>
                         </div>
                         <button 
                          onClick={() => removeParameterFromMaster(managedTest._id, i)}
                          className="text-slate-300 hover:text-red-500 p-2 transition-colors opacity-0 group-hover:opacity-100"
                         >
                            <Trash2 size={16}/>
                         </button>
                      </div>
                   ))}
                </div>
             </div>

             <div className="p-4 bg-slate-50 border-t flex justify-end">
                <button 
                  onClick={() => setManagedTest(null)}
                  className="bg-slate-800 text-white px-6 py-2 rounded-xl font-bold tracking-tight shadow-md hover:bg-black transition-all"
                >
                  Done
                </button>
             </div>
          </div>
        </div>
      )}

      {/* CREATE NEW TEST MODAL */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
              <h2 className="font-bold text-indigo-900">Create New Test</h2>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-widest">Test Name</label>
                <input 
                  type="text" 
                  value={newTest.name} 
                  onChange={(e) => setNewTest({...newTest, name: e.target.value.toUpperCase()})}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:border-indigo-500 font-bold uppercase transition-all" 
                  placeholder="e.g. SEMEN ANALYSIS"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-widest">Category</label>
                <input 
                  type="text" 
                  value={newTest.category} 
                  onChange={(e) => setNewTest({...newTest, category: e.target.value.toUpperCase()})}
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:border-indigo-500 uppercase transition-all" 
                  placeholder="e.g. CLINICAL PATHOLOGY"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                   <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-widest">Price (Rs)</label>
                   <input 
                     type="number" 
                     value={newTest.price} 
                     onChange={(e) => setNewTest({...newTest, price: Number(e.target.value)})}
                     className="w-full border rounded-lg px-3 py-2 outline-none focus:border-indigo-500 font-bold"
                   />
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex gap-3">
               <button onClick={() => setShowAddForm(false)} className="flex-1 border py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition-all uppercase text-[11px]">Cancel</button>
               <button onClick={handleCreateTest} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 uppercase text-[11px] shadow-lg">
                 <Save size={18}/> Create Test
               </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-[400px]">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          
          {/* DESKTOP TABLE VIEW - Hidden on mobile */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-slate-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Test Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Department</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Price</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Parameters</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {loading ? (
                   <tr><td colSpan="5" className="text-center py-20 font-medium text-gray-400 italic">Loading tests...</td></tr>
                ) : tests.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())).map((test) => (
                  <tr key={test._id} className="hover:bg-indigo-50/50 transition-all group cursor-default">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-800 uppercase tracking-tight">{test.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                        {test.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-slate-700">
                      Rs.{test.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button 
                        onClick={() => setManagedTest(test)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                      >
                        <List size={12}/> Manage {test.parameters?.length || 0} Params
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-1">
                         <button 
                          onClick={() => handleDeleteTest(test._id, test.name)}
                          className="text-slate-300 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Master Test"
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

          {/* MOBILE TEMPLATE CARDS - Hidden on desktop */}
          <div className="md:hidden divide-y divide-slate-100">
             {loading ? (
                <div className="p-10 text-center text-slate-400 font-bold uppercase text-[10px]">Loading Templates...</div>
             ) : tests.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())).map(test => (
                <div key={test._id} className="p-4 bg-white flex flex-col gap-3">
                   <div className="flex justify-between items-start">
                      <div className="flex-1">
                         <h3 className="font-bold text-indigo-900 text-[13px] uppercase leading-tight mb-1">{test.name}</h3>
                         <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{test.category}</span>
                      </div>
                      <div className="text-right">
                         <div className="text-indigo-600 font-bold text-xs">Rs.{test.price}</div>
                         <button 
                           onClick={() => handleDeleteTest(test._id, test.name)}
                           className="text-red-300 hover:text-red-500 p-2 active:bg-red-50 rounded-lg transition-all"
                         >
                           <Trash2 size={16}/>
                         </button>
                      </div>
                   </div>
                   <button 
                      onClick={() => setManagedTest(test)}
                      className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                   >
                      <Layers size={14}/> Manage {test.parameters?.length || 0} Parameters
                   </button>
                </div>
             ))}
          </div>
        </div>
      </div>

    </div>
  );
}
