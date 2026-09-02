import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  FaMapMarkerAlt, 
  FaDollarSign, 
  FaCode, 
  FaSpinner, 
  FaBriefcase, 
  FaCalendarAlt, 
  FaCheckCircle 
} from 'react-icons/fa';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State to track which job is currently being applied to
  const [applyingTo, setApplyingTo] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedJobModal, setSelectedJobModal] = useState(null);

  // Fetch jobs from backend on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await API.get('/user/jobs');
        // Extract array from response (Adapts to different backend structures)
        setJobs(response.data.jobs || response.data || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load active jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Handle actual Job Application
  const handleApply = async (jobId) => {
    setApplyingTo(jobId);
    setError('');
    setSuccessMessage('');

    try {
      // Hitting the Backend Apply Route
      const response = await API.post(`/user/apply/${jobId}`);
      setSuccessMessage(response.data?.message || 'Successfully applied for the job!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error("Application error:", err);
      // If the user hasn't uploaded an ATS resume yet, the backend will block it. We catch that here.
      const backendError = err.response?.data?.message || err.response?.data?.error || 'Failed to apply. Have you uploaded your ATS resume yet?';
      setError(backendError);
      
      setTimeout(() => setError(''), 5000);
    } finally {
      setApplyingTo(null);
    }
  };

  // Filter jobs based on search bar input
  const filteredJobs = jobs.filter((job) => 
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.requiredSkills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Floating Notifications */}
      {successMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <FaCheckCircle /> {successMessage}
        </div>
      )}
      
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
          {error}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Find Your Next Role</h1>
          <p className="text-lg text-gray-600">Browse active jobs and use your AI resume to apply instantly.</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex shadow-lg rounded-2xl overflow-hidden border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <input 
              type="text" 
              placeholder="Search job titles, companies, or skills..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 outline-none text-gray-700" 
            />
            <button className="bg-blue-600 text-white px-8 py-4 font-semibold hover:bg-blue-700 transition">
              Search
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-blue-600">
            <FaSpinner className="animate-spin text-4xl mb-4" />
            <p className="text-gray-500 font-medium">Loading active jobs...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredJobs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm max-w-3xl mx-auto">
            <FaBriefcase className="text-gray-300 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500">We couldn't find any jobs matching your criteria.</p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && filteredJobs.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredJobs.map((job) => (
              <div key={job._id} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                
                {/* Top Section: Company, Title, Badge */}
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      {/* Falls back to 'Verified Company' if company name wasn't populated */}
                      <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">
                        {job.company?.name || 'Verified Company'}
                      </h3>
                      <h2 className="text-2xl font-bold text-gray-900 leading-tight">{job.title}</h2>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full whitespace-nowrap border border-blue-100">
                      {job.experienceLevel || 'All Levels'}
                    </span>
                  </div>
                </div>

                {/* Middle Section: Truncated Description */}
                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-gray-500 text-sm mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 font-medium">
                    <FaMapMarkerAlt className="text-gray-400" /> {job.location}
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <FaDollarSign className="text-gray-400" /> {job.salary}
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <FaCalendarAlt className="text-gray-400" /> 
                    {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <div className={`w-2 h-2 rounded-full ${job.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {job.isActive ? 'Actively Hiring' : 'Closed'}
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {job.requiredSkills?.map((skill, idx) => (
                    <span key={idx} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 shadow-sm rounded-lg text-xs font-semibold text-gray-700">
                      <FaCode className="text-blue-500"/> {skill}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => handleApply(job._id)}
                    disabled={!job.isActive || applyingTo === job._id}
                    className="w-full sm:flex-1 py-3 rounded-xl font-bold bg-gray-900 text-white hover:bg-gray-800 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {applyingTo === job._id ? <FaSpinner className="animate-spin" /> : 'Apply Now'}
                  </button>
                  <button 
                    onClick={() => setSelectedJobModal(job)}
                    className="w-full sm:flex-1 py-3 rounded-xl font-bold bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition"
                  >
                    View Details
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* --- REAL JOB DETAILS MODAL --- */}
        {selectedJobModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedJobModal(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full transition"
              >
                ✕
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                  {selectedJobModal.company?.name || 'Verified Company'}
                </span>
                <h2 className="text-3xl font-extrabold text-gray-900 mt-1">{selectedJobModal.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                  <span className="flex items-center gap-1 font-medium"><FaMapMarkerAlt className="text-gray-400"/> {selectedJobModal.location}</span>
                  <span className="flex items-center gap-1 font-medium"><FaDollarSign className="text-gray-400"/> {selectedJobModal.salary}</span>
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-full">{selectedJobModal.experienceLevel || 'All Levels'}</span>
                </div>
              </div>

              {/* Full Description */}
              <div className="mb-6 border-t border-b border-gray-100 py-6">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Job Description</h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {selectedJobModal.description}
                </p>
              </div>

              {/* Required Skills */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Required Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJobModal.requiredSkills?.map((skill, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-xs font-bold text-blue-700">
                      <FaCode /> {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Action Footer */}
              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => {
                    handleApply(selectedJobModal._id);
                    setSelectedJobModal(null);
                  }}
                  disabled={!selectedJobModal.isActive}
                  className="flex-1 py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg disabled:opacity-50"
                >
                  Apply for this Role
                </button>
                <button 
                  onClick={() => setSelectedJobModal(null)}
                  className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}