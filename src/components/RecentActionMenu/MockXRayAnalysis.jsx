import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFileText, FiArrowLeft, FiSearch, FiFilter } from 'react-icons/fi';
import { format } from 'date-fns';

// Mock data for X-ray analyses
const MockXrayAnalyses = [
  {
    id: 'xr-001',
    patientName: 'John Doe',
    patientId: 'P12345',
    fileName: 'chest_xray_frontal.dcm',
    timestamp: new Date(2025, 0, 15, 9, 30),
    findings: 'No abnormalities detected',
    confidence: 0.94,
    status: 'Completed'
  },
  {
    id: 'xr-002',
    patientName: 'Jane Smith',
    patientId: 'P12346',
    fileName: 'abdomen_lateral.dcm',
    timestamp: new Date(2025, 0, 14, 15, 45),
    findings: 'Possible early signs of pneumonia',
    confidence: 0.82,
    status: 'Completed'
  },
  {
    id: 'xr-003',
    patientName: 'Michael Johnson',
    patientId: 'P12347',
    fileName: 'hand_left_ap.dcm',
    timestamp: new Date(2025, 0, 13, 11, 20),
    findings: 'Fracture detected - distal radius',
    confidence: 0.97,
    status: 'Completed'
  },
  {
    id: 'xr-004',
    patientName: 'Emma Williams',
    patientId: 'P12348',
    fileName: 'chest_xray_lateral.dcm',
    timestamp: new Date(2025, 0, 12, 14, 10),
    findings: 'Clear lungs, no acute cardiopulmonary process',
    confidence: 0.91,
    status: 'Completed'
  },
  {
    id: 'xr-005',
    patientName: 'Robert Brown',
    patientId: 'P12349',
    fileName: 'knee_right_ap.dcm',
    timestamp: new Date(2025, 0, 10, 9, 15),
    findings: 'Mild osteoarthritis changes',
    confidence: 0.88,
    status: 'Completed'
  }
];

const XrayAnalysisHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [analyses, setAnalyses] = useState(mockXrayAnalyses);
  
  // Filter analyses based on search term
  const filteredAnalyses = analyses.filter(analysis => 
    analysis.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    analysis.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    analysis.findings.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
            aria-label="Go back"
          >
            <FiArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">X-Ray Analysis History</h1>
            <p className="text-gray-600">View all your previous X-ray analyses</p>
          </div>
        </div>

        {/* Search and filter section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by patient name, file name, or findings..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors duration-200">
              <FiFilter className="h-5 w-5 mr-2" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Analysis table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Findings
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAnalyses.map((analysis, index) => (
                  <motion.tr 
                    key={analysis.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => console.log(`View details for analysis ${analysis.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiFileText className="h-5 w-5 text-blue-500 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {analysis.fileName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{analysis.patientName}</div>
                      <div className="text-sm text-gray-500">{analysis.patientId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(analysis.timestamp, 'MMM d, yyyy')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(analysis.timestamp, 'h:mm a')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {analysis.findings}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${analysis.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-700">
                          {Math.round(analysis.confidence * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {analysis.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MockXrayAnalyses;