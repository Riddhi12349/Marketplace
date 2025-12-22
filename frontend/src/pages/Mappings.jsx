import React, { useState , useEffect } from 'react';
import { Trash2, Calendar, FileText } from 'lucide-react';
import Header from '../components/Header';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useStats } from "../context/StatsContext";

const Mappings = () => {

  const BACKEND_URL="http://localhost:8000";
  
  const [selectedMapping, setSelectedMapping] = useState(null);
  const [mappings , setMappings] = useState([]);

  const { setStats } = useStats();

  useEffect(()=>{
         getMappings();
  },[]);

 useEffect(() => {

  const totalMappings = mappings.reduce(
  (sum, item) => sum + Number(item.mapping_count || 0),
  0
);

const totalProducts = mappings.reduce(
  (sum, item) => sum + Number(item.product_count || 0),
  0
);

  setStats(prev => {
    return {
      ...prev,
      uploaded_files: mappings.length,
      active_mappings: totalMappings,
      products_mapped: totalProducts
    };
  });
}, [mappings]);


  const getMappings = async ()=>{

    try {
      
      const res = await axios.get(`${BACKEND_URL}/api/mappings/get`);
      setMappings(res.data);
      console.log(mappings);
    } catch (err) {
      console.error(err);
    }
  }

  const handleViewMapping = (mapping) => {
    setSelectedMapping(mapping); 
  };

  const handleDeleteMapping = async (id) => {

    try {

       setMappings((prev) => prev.filter((m) => m.id !== id));
       const res = await axios.delete(`${BACKEND_URL}/api/mappings/delete/${id}`);
       console.log(res.data);
       toast.success('Mapping deleted successfully!');

    } catch (err) {

      toast.error('Unable to Delete');
      console.error(err);
    }
   
  };


  const closeModal = () => {
    setSelectedMapping(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Mappings</h1>
          <p className="mt-2 text-gray-600">
            View and manage your saved attribute mappings.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Mappings</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File & Template
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mappings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mappings.map((mapping) => (
                  <tr key={mapping.id}   className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center" onClick={() => handleViewMapping(mapping)}>
                        <FileText className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {mapping.file_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            → {mapping.template_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {mapping.mapping_count} mapped
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mapping.product_count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(mapping.created_at).toLocaleDateString()}
                        
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                    
                      
                        <button
                          onClick={() => handleDeleteMapping(mapping.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete mapping"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {mappings.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mappings yet</h3>
            <p className="text-gray-600 mb-4">
              Upload a product file and create your first mapping.
            </p>
          </div>
        )}
      </main>

      {selectedMapping && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Mapping Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">File Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">File:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedMapping.file_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Template:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedMapping.template_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Products:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedMapping.product_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(selectedMapping.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4">Attribute Mappings (source → target)</h4>
                <div className="space-y-3">
                  {Object.entries(selectedMapping.mappings).map(([source, target]) => (
                    <div key={source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">{source}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">→</span>
                        <span className="text-sm text-blue-600 font-medium">{target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mappings;