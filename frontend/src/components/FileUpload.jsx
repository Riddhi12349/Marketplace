import React, { useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import axios from "axios";
import  parseFile  from "./ParseFile";
import { toast } from "react-toastify";


const FileUpload = ({
  onFileSelect,
  selectedFile,
  setShowUpload,
  accept = '.csv,.xlsx,.xls',
  title,
  description,
  type,
  templates,
  setTemplates
}) => {
  
  const validExtensions = ['.csv', '.xlsx', '.xls'];
  const [error, setError] = useState('');
 
  const [template , setTemplate] = useState({});

  const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) validateAndSelect(file);
  };

  const validateAndSelect = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext =>
      fileName.endsWith(ext)
    );

    if (!isValid) {
      setError('Please upload a valid CSV or Excel file');
      return;
    }

    setError('');
    onFileSelect(file);
    const { rows } = await parseFile({ file, mode: "rows"});
    setTemplate({ name: file.name, attributes: rows , created_at :  new Date().toISOString()});
    console.log("Template : " , template);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) validateAndSelect(file);
  };

  const handleSubmitMP = async () => {
     
    if(!selectedFile){
       alert("Please select a file");
       return;
    }
    
    try {

     const res = await axios.post(`${BACKEND_URL}/api/template/create` , template);
     console.log(res.data);
     
    toast.success("Template created successfully!");

    setShowUpload(false);

    setTemplates([...templates, template]);        

   } catch (err) {

     console.error(err);
   }
  };

return (
  <div className="w-full">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-900">
            {title}
          </h3>
          <button
            onClick={() => setShowUpload(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>

    {/* Error */}
    {error && (
      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
        {error}
      </div>
    )}

    {/* File or Upload */}
    {selectedFile ? (
      <>
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <File className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          <button
            onClick={() => onFileSelect(null)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
 <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex justify-end">
          {type === "Marketplace" && (
            <button
              onClick={handleSubmitMP}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          )}
        </div>
      </>
    ) : (
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-sm text-gray-600 mb-2">
          Drag and drop your file here, or{' '}
          <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
            browse
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleFileInput}
            />
          </label>
        </p>
        <p className="text-xs text-gray-500">
          Supports CSV, Excel files (max 5MB)
        </p>
      </div>
    )}
  </div>
);
}
export default FileUpload;