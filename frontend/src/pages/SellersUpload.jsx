import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import FileUpload from '../components/FileUpload';
import MappingInterface from '../components/MappingInterface';
import { toast } from 'react-toastify';
import axios from 'axios';
import parseFile from "../components/ParseFile";


const SellersUpload = () => {

  const BACKEND_URL="http://localhost:8000";
  
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState({});

  const [fileColumns, setFileColumns] = useState([]);
  const [fileRowCount , setFileRowCount] = useState(0);

  const [mappings, setMappings] = useState({});
  const [step, setStep] = useState(1);

  const [templates, setTemplates] = useState([]);


   useEffect(() => {
      fetchTemplates();
    }, []);
  
    const fetchTemplates = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/template/list/all`);
      
        setTemplates(res.data.data || []);
  
      } catch (err) {
        console.error(err);
        toast.error("Failed to load templates");
      }
    };

  const handleFileSelect = async (file) => {
      setSelectedFile(file);
      const { columns, rowCount } = await parseFile({ file, mode: "columns"});

      setFileColumns(columns);
      setFileRowCount(rowCount);
};

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleMappingChange = (sourceColumn, targetAttribute) => {
    setMappings(prev => ({
      ...prev,
      [sourceColumn]: targetAttribute,
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!selectedFile || !fileColumns.length) {
        toast.error('Please select file');
        return;
      }
      setStep(2);
    }
  };

  const handleSaveMapping = () => {
   
    const requiredAttributes = selectedTemplate?.attributes.filter(attr => attr.required) || [];
    const mappedAttributes = Object.values(mappings).filter(Boolean);
    const missingRequired = requiredAttributes.filter(attr => 
      !mappedAttributes.includes(attr.name)
    );

    if (missingRequired.length > 0) {
      toast.error(`Missing required mappings: ${missingRequired.map(attr => attr.name).join(', ')}`);
      return;
    }

    // Save mapping logic would go here
    toast.success('Mapping saved successfully!');

    //send to backend - mappings object---->
    saveMappings();
    navigate('/mappings');
  };

  const saveMappings = async () => {
  
    try {
      const res = await axios.post(`${BACKEND_URL}/api/mappings/send`, 
      {
      fileName: selectedFile.name,
      templateName: selectedTemplate.name,
      mappingCount: Object.keys(mappings).length,
      productCount: fileRowCount,
      mappings
    }
    );

      console.log(res.data);

    } catch (err) {
      
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload & Map Products</h1>
          <p className="mt-2 text-gray-600">
            Upload your product file and map attributes to marketplace templates.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="font-medium">Upload & Select</span>
            </div>
            <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="font-medium">Map Attributes</span>
            </div>
          </div>
        </div>

        {step === 1 && (
  <div className="space-y-8">
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <FileUpload
        onFileSelect={handleFileSelect}
        selectedFile={selectedFile}
        title="Upload Product File"
        description="Upload your CSV or Excel file containing product data"
      />
    </div>

    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Select Marketplace Template
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              selectedTemplate.id === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            <h4 className="font-medium text-gray-900">{template.name}</h4>
            <p className="text-sm text-gray-600 mt-1">
              {template.attributes.length} attributes •{' '}
              {template.attributes.filter(attr => attr.required).length} required
            </p>
          </div>
        ))}
      </div>
    </div>

    <div className="flex justify-end">
      <button
        onClick={handleNext}
        disabled={!selectedFile || !selectedTemplate}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Next: Map Attributes
      </button>
    </div>
  </div>
)}


        {step === 2 && selectedTemplate && (
          <div className="space-y-8">
            <MappingInterface
              sourceColumns={fileColumns}
              targetAttributes={selectedTemplate.attributes}
              mappings={mappings}
              onMappingChange={handleMappingChange}
            />

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSaveMapping}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Mapping
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SellersUpload;