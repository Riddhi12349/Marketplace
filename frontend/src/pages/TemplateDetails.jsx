import React , { useEffect , useState} from "react";
import axios from 'axios';
import Header from "../components/Header";
import { useParams } from "react-router-dom";

const TemplateDetails = () => {
   
    const BACKEND_URL=process.env.REACT_APP_BACKEND_URL;
    const  {id } = useParams();
    const [template , setTemplate ] = useState(null);
    const [loading , setLoading] = useState(true);

    useEffect(()=>{
        fetchTemplate();
    },[]);

    const fetchTemplate = async ()=>{
        try {
            const res = await axios.get(`${BACKEND_URL}/api/template/${id}`);
            setTemplate(res.data);
        } catch (err) {
            console.error(err);
        } finally{
            setLoading(false);
        }
    }

    if(loading) return <div className="p-6">Loading</div>
    if(!template) return <div className="p-6"> Template Not Found </div>

    return (
     <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-8">
               <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    {template.name}
                </h1>
                <p className="text-gray-600 mt-2">
                    Marketplace Template
                </p>
                <p  className="text-sm text-gray-400 mt-1">
                   Created on {new Date(template.created_at).toLocaleDateString()}  
                </p>
           </div>

                   {/* Attributes Table */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-200 text-gray-700">
                <tr>
                <th className="px-4 py-3 text-left">Attribute</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Required</th>
                <th className="px-4 py-3 text-left">Constraints</th>
                </tr>
</thead>
                <tbody>
                     {template.attributes.map((attr) => (
                <tr key={attr.name} className="border-t">
                  <td className="px-4 py-3 font-medium">{attr.name}</td>
                  <td className="px-4 py-3">{attr.type}</td>
                  <td className="px-4 py-3">
                    {attr.required ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {attr.maxLength && `Max length: ${attr.maxLength}`}
                    {attr.enumValues && `Values: ${attr.enumValues}`}
                  </td>
                </tr>
              ))}
                </tbody>
</table>
        </div>
         </main>
    </div>
    )
}

export default TemplateDetails;