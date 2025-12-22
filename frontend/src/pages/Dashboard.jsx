import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Upload, FileText, Layers } from 'lucide-react';
import Header from '../components/Header';
import { useStats } from "../context/StatsContext";

const Dashboard = () => {

  const { stats } = useStats();
  
  const Dstats = [
    { name: 'Templates', value: stats.templates, icon: FileText, href: '/templates' },
    { name: 'Uploaded Files', value: stats.uploaded_files, icon: Upload, href: '/upload' },
    { name: 'Active Mappings', value: stats.active_mappings, icon: Layers, href: '/mappings' },
    { name: 'Products Mapped', value: stats.products_mapped, icon: Package, href: '/mappings' },
  ];

  const quickActions = [
    {
      title: 'Create Template',
      description: 'Define and Upload a new marketplace template with custom attributes',
      href: '/templates',
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Upload Products',
      description: 'Upload seller product files for mapping',
      href: '/upload',
      icon: Upload,
      color: 'bg-green-500',
    },
    {
      title: 'View Mappings',
      description: 'Review and manage existing attribute mappings',
      href: '/mappings',
      icon: Layers,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage marketplace templates, upload product files, and create attribute mappings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Dstats.map((stat) => (
            <Link
              key={stat.name}
              to={stat.href}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${action.color}`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {action.title}
              </h3>
              <p className="mt-2 text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <Upload className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  New product file uploaded
                </p>
                <p className="text-xs text-gray-500">seller_products_jan2025.csv • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <Layers className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Mapping created for Myntra template
                </p>
                <p className="text-xs text-gray-500">245 products mapped • 5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Flipkart template updated
                </p>
                <p className="text-xs text-gray-500">Added new attributes • 1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;