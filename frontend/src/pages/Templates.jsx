// FOR MARKETPLACE
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, Trash2 } from "lucide-react";
import Header from "../components/Header";
import FileUpload from "../components/FileUpload";
import { toast } from "react-toastify";
import axios from "axios";
import { useStats } from "../context/StatsContext";

const Templates = () => {

  const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [templates, setTemplates] = useState([]);

  const { setStats } = useStats();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/template/list/all`);
    
      setTemplates(res.data.data || []);

      setStats((prv) => ({
         ...prv,
         templates : res.data.data.length
      }));

    } catch (err) {
      console.error(err);
      toast.error("Failed to load templates");
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleDeleteTemplate = async (id) => {

    setTemplates((prev) => prev.filter((t) => t.id !== id));
 
    const res = await axios.delete(`${BACKEND_URL}/api/template/delete/${id}`);
    console.log("Deleted" , res.data);

    toast.success("Template deleted successfully!");

  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Marketplace Templates
            </h1>
            <p className="mt-2 text-gray-600">
              Create and manage marketplace attribute templates.
            </p>
          </div>

          <div className="flex space-x-3">
      
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              <span>Upload CSV</span>
            </button>
          </div>
        </div>

        {showUpload && (
          <div className="bg-white rounded-lg border p-6 mb-6">
            <FileUpload
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              setShowUpload={setShowUpload}
              title="Upload Marketplace Template"
              description="Upload your CSV or Excel file"
              type="Marketplace"
              templates={templates}
              setTemplates={setTemplates}
            />
          </div>
        )}

        {/* LIST */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.isArray(templates) &&
            templates.map((template) => (
              <div
                key={template.id}
                className="cursor-pointer bg-white rounded-lg border p-6 hover:shadow"
                onClick={() => navigate(`/template/${template.id}`)}
              >
                <div className="flex justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <h3 className="text-lg font-semibold">
                      {template.name}
                    </h3>
                  </div>

                  <div className="flex space-x-2">


                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTemplate(template.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600" />
                    </button>
                  </div>
                </div>

                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Attributes</span>
                    <span className="text-blue-600 font-medium">{template.attributes?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span >Created At</span>
                    <span className="text-blue-600 font-medium">
                       {template.created_at?.split('T')[0]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* EMPTY STATE */}
        {templates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No templates yet</h3>
            <button
              onClick={() => setShowUpload(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Create Template
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Templates;
