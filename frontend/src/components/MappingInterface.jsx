import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

const MappingInterface = ({
  sourceColumns,
  targetAttributes,
  mappings,
  onMappingChange,
}) => {
  
  // Helper functions
  const getMappedTarget = (sourceColumn) => {
    return mappings[sourceColumn] || '';
  };

  const getUsedTargets = () => {
    return Object.values(mappings).filter(val => val !== '');
  };

  const isTargetUsed = (targetName) => {
    return getUsedTargets().includes(targetName);
  };

  const handleMappingSelect = (sourceCol, targetVal) => {
    onMappingChange(sourceCol, targetVal);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Attribute Mapping</h3>
      
      {/* Visual mapping display - 3 column layout */}
      <div className="grid grid-cols-3 lg:grid-cols-3 gap-0 mb-8">
        
        {/* Left: Source columns from seller file */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Source Columns (Your File)
          </h4>
          <div className="space-y-2">
            {sourceColumns.map((column) => {
              const isMapped = getMappedTarget(column);
              
              return (
                <div
                  key={column}
                  className={`p-3 rounded-md border text-sm ${
                    isMapped
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{column}</span>
                    {isMapped && <Check className="h-4 w-4 text-blue-600" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle: Arrow indicator */}
        <div className="flex items-center justify-center">
          <ArrowRight className="h-8 w-8 text-gray-400" />
        </div>

        {/* Right: Target attributes from marketplace */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Target Attributes (Marketplace)
          </h4>
          <div className="space-y-2">
            {targetAttributes.map((attr) => {
              const used = isTargetUsed(attr.name);
              
              return (
                <div
                  key={attr.name}
                  className={`p-3 rounded-md border text-sm ${
                    used
                      ? 'bg-green-50 border-green-200 text-green-900'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{attr.name}</span>
                      {attr.required && (
                        <span className="ml-1 text-red-500" title="Required field">*</span>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {attr.type}
                      </div>
                    </div>
                    {used && <Check className="h-4 w-4 text-green-600" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mapping controls - dropdown selectors */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">
          Map Your Columns to Marketplace Attributes
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sourceColumns.map((sourceColumn) => (
            <div key={sourceColumn} className="space-y-2">
              <label className="block text-xs font-medium text-gray-600">
                {sourceColumn}
              </label>
              <select
                value={getMappedTarget(sourceColumn)}
                onChange={(e) => handleMappingSelect(sourceColumn, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select target --</option>
                {targetAttributes.map((attr) => (
                  <option key={attr.name} value={attr.name}>
                    {attr.name} ({attr.type}){attr.required ? ' *' : ''}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MappingInterface;