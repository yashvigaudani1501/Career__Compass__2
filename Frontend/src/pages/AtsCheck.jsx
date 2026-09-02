import React, { useState, useRef } from 'react';
import API from '../services/api';
import { 
  FaCloudUploadAlt, 
  FaFilePdf, 
  FaSpinner, 
  FaCheckCircle, 
  FaMagic, 
  FaBriefcase, 
  FaCode,
  FaTimes
} from 'react-icons/fa';

export default function AtsCheck() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null); // Will hold the AI response

  const fileInputRef = useRef(null);

  // --- Drag and Drop Handlers ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setResults(null); // Clear previous results when a new file is added
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  const clearFile = () => {
    setFile(null);
    setResults(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Upload and ML Analysis ---
  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('resume', file); // Matches Node.js uploadMiddleware

    try {
      // Hit the actual backend route
      const response = await API.post('/user/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Backend returns { message: "...", data: { atsScore, extractedSkills, aiSuggestedJobs } }
      setResults(response.data.data);
    } catch (err) {
      console.error("Upload error:", err);
      const backendError = err.response?.data?.message || err.response?.data?.error || 'Failed to analyze resume. Please try again.';
      setError(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">AI ATS Score Checker</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your resume and let Groq AI analyze it. We'll score it against industry standards, extract your core skills, and match you with the best job titles.
          </p>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div 
          className={`relative bg-white rounded-3xl p-10 border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            accept="application/pdf" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileInput}
          />

          {!file ? (
            <>
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <FaCloudUploadAlt className="text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Drag & Drop your resume here</h3>
              <p className="text-gray-500 mb-6">Only PDF files are supported (Max 5MB)</p>
              <button 
                onClick={() => fileInputRef.current.click()}
                className="px-8 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition shadow-md"
              >
                Browse Files
              </button>
            </>
          ) : (
            <div className="w-full flex flex-col items-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <FaFilePdf className="text-4xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{file.name}</h3>
              <p className="text-sm text-gray-500 mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={clearFile}
                  disabled={loading}
                  className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition disabled:opacity-50 flex items-center gap-2"
                >
                  <FaTimes /> Remove
                </button>
                <button 
                  onClick={handleUpload}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-md disabled:opacity-70 flex items-center gap-2"
                >
                  {loading ? <FaSpinner className="animate-spin text-xl" /> : <FaMagic />}
                  {loading ? 'Analyzing with AI...' : 'Generate ATS Score'}
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl text-center font-medium shadow-sm">
            {error}
          </div>
        )}

        {/* AI Results Section (Only shows when results state is populated) */}
        {results && (
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl animate-fade-in-up">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 font-bold rounded-full text-sm mb-4">
                <FaCheckCircle /> Analysis Complete
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900">Your Resume Results</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Score Gauge */}
              <div className="col-span-1 bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center justify-center text-center">
                <h3 className="text-lg font-bold text-gray-700 mb-6">Overall ATS Score</h3>
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-gray-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path 
                      className={results.atsScore >= 75 ? "text-green-500" : results.atsScore >= 50 ? "text-yellow-500" : "text-red-500"} 
                      strokeDasharray={`${results.atsScore}, 100`} 
                      strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" 
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    />
                  </svg>
                  <div className="absolute text-5xl font-extrabold text-gray-900">{results.atsScore}</div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  {results.atsScore >= 75 ? "Great job! Your resume is highly optimized." : "Consider adding more keywords and formatting clearly."}
                </p>
              </div>

              {/* Data Breakdown */}
              <div className="col-span-1 md:col-span-2 space-y-6">
                
                {/* Extracted Skills */}
                <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <FaCode /> AI Extracted Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {results.extractedSkills?.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 rounded-lg text-sm font-semibold shadow-sm">
                        {skill}
                      </span>
                    ))}
                    {(!results.extractedSkills || results.extractedSkills.length === 0) && (
                      <span className="text-gray-500 italic text-sm">No specific skills detected.</span>
                    )}
                  </div>
                </div>

                {/* Suggested Jobs */}
                <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100">
                  <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <FaBriefcase /> Suggested Job Matches
                  </h3>
                  <div className="space-y-3">
                    {results.aiSuggestedJobs?.map((job, idx) => (
                      <div key={idx} className="flex items-center gap-3 px-4 py-3 bg-white border border-purple-200 rounded-xl text-purple-900 font-medium shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div> {job}
                      </div>
                    ))}
                    {(!results.aiSuggestedJobs || results.aiSuggestedJobs.length === 0) && (
                      <span className="text-gray-500 italic text-sm">Not enough data to suggest jobs.</span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
      
      {/* Tailwind Custom Animation */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}