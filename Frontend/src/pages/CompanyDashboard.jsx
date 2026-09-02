import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  FaBriefcase, 
  FaPlus, 
  FaUsers, 
  FaSpinner, 
  FaCheckCircle,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCode,
  FaArrowLeft,
  FaStar
} from 'react-icons/fa';

export default function CompanyDashboard() {
  const { user } = useContext(AuthContext);

  // Security Check
  if (user?.role !== 'COMPANY') {
    return <Navigate to="/" />;
  }

  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'post'
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // --- STATE FOR MY JOBS & APPLICANTS ---
  const [myJobs, setMyJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // --- STATE FOR POSTING A JOB ---
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requiredSkills: '', 
    location: '',
    salary: '',
    experienceLevel: 'Entry Level'
  });

  useEffect(() => {
    fetchMyJobs();
  }, []);

    const fetchMyJobs = async () => {
    setLoading(true);
    try {
      // Hits our brand new backend route! No more 403 Forbidden.
      const response = await API.get('/company/my-jobs');
      
      // Because the backend already filtered the jobs to ONLY belong to this company,
      // we can just set them directly into state! No messy frontend filtering needed.
      setMyJobs(response.data.jobs || []);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJobChange = (e) => setJobForm({ ...jobForm, [e.target.name]: e.target.value });

  const handlePostJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const skillsArray = jobForm.requiredSkills.split(',').map(skill => skill.trim()).filter(Boolean);
      const payload = { ...jobForm, requiredSkills: skillsArray };
      
      await API.post('/company/post-job', payload);
      
      setMsg({ type: 'success', text: 'Job posted successfully!' });
      setJobForm({ title: '', description: '', requiredSkills: '', location: '', salary: '', experienceLevel: 'Entry Level' });
      
      // Refresh jobs list and switch tab automatically
      await fetchMyJobs();
      setTimeout(() => {
        setMsg({ type: '', text: '' });
        setActiveTab('jobs');
      }, 1500);
      
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to post job.' });
    } finally {
      setLoading(false);
    }
  };

  const viewApplicants = async (job) => {
    setSelectedJob(job);
    setLoadingApplicants(true);
    try {
      const response = await API.get(`/company/applicants/${job._id}`);
      setApplicants(response.data.applications || []);
    } catch (err) {
      console.error("Failed to fetch applicants", err);
      setApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Tabs */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company Portal</h1>
            <p className="text-gray-500 mt-2">Manage your job listings and review top talent.</p>
          </div>
          
          <div className="flex p-1 bg-gray-100 rounded-xl w-full md:w-auto">
            <button 
              onClick={() => { setActiveTab('jobs'); setSelectedJob(null); fetchMyJobs(); }}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${activeTab === 'jobs' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              My Active Jobs
            </button>
            <button 
              onClick={() => setActiveTab('post')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${activeTab === 'post' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Post a New Job
            </button>
          </div>
        </div>

        {/* --- TAB: POST A JOB --- */}
        {activeTab === 'post' && (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in-up">
            <div className="p-8 bg-blue-600 text-white">
              <h2 className="text-2xl font-bold flex items-center gap-2"><FaPlus /> Create Job Listing</h2>
              <p className="text-blue-100 mt-2">Post a new role and let our AI match you with the best candidates.</p>
            </div>

            <form onSubmit={handlePostJob} className="p-8 space-y-6">
              {msg.text && (
                <div className={`p-4 rounded-xl flex items-center gap-3 font-medium border ${msg.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                  {msg.type === 'success' && <FaCheckCircle className="text-xl" />}
                  {msg.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                  <input type="text" name="title" required value={jobForm.title} onChange={handleJobChange} placeholder="e.g. Full Stack Developer" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description</label>
                  <textarea name="description" required value={jobForm.description} onChange={handleJobChange} placeholder="Describe the role and responsibilities..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl h-32 focus:ring-2 focus:ring-blue-500 outline-none transition"></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Required Skills (Comma separated)</label>
                  <div className="relative">
                    <FaCode className="absolute left-4 top-4 text-gray-400" />
                    <input type="text" name="requiredSkills" required value={jobForm.requiredSkills} onChange={handleJobChange} placeholder="React, Node.js, Python, MongoDB" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-400" />
                    <input type="text" name="location" required value={jobForm.location} onChange={handleJobChange} placeholder="Remote, Hybrid, or City" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Salary Range</label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-4 top-4 text-gray-400" />
                    <input type="text" name="salary" required value={jobForm.salary} onChange={handleJobChange} placeholder="$100k - $120k" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Level</label>
                  <select name="experienceLevel" value={jobForm.experienceLevel} onChange={handleJobChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition">
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 mt-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 shadow-lg disabled:opacity-70 flex justify-center items-center gap-2 transition-all">
                {loading ? <FaSpinner className="animate-spin text-xl" /> : <FaPlus />} Post Job
              </button>
            </form>
          </div>
        )}

        {/* --- TAB: MY JOBS & APPLICANTS --- */}
        {activeTab === 'jobs' && (
          <div className="animate-fade-in-up">
            
            {!selectedJob ? (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Your Active Listings</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{myJobs.length} Jobs</span>
                </div>
                
                {loading ? (
                  <div className="p-10 text-center text-gray-500"><FaSpinner className="animate-spin text-3xl mx-auto mb-3" /> Fetching jobs...</div>
                ) : myJobs.length === 0 ? (
                  <div className="p-10 text-center text-gray-500">
                    <FaBriefcase className="text-4xl mx-auto mb-3 text-gray-300" />
                    <p className="text-lg">You haven't posted any jobs yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {myJobs.map(job => (
                      <div key={job._id} className="p-6 hover:bg-gray-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                            <span className="flex items-center gap-1"><FaMapMarkerAlt /> {job.location}</span>
                            <span className="flex items-center gap-1"><FaDollarSign /> {job.salary}</span>
                            <span className="flex items-center gap-1"><FaUsers /> Click to view applicants</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => viewApplicants(job)}
                          className="px-6 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition whitespace-nowrap shadow-sm"
                        >
                          View Applicants
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden animate-fade-in-up">
                <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <div>
                    <button onClick={() => setSelectedJob(null)} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 text-sm font-semibold mb-2 transition-colors">
                      <FaArrowLeft /> Back to Jobs
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">Applicants: {selectedJob.title}</h2>
                  </div>
                </div>

                {loadingApplicants ? (
                  <div className="p-16 text-center text-gray-500"><FaSpinner className="animate-spin text-4xl mx-auto mb-3 text-blue-600" /> Loading AI scores...</div>
                ) : applicants.length === 0 ? (
                  <div className="p-16 text-center text-gray-500">
                    <FaUsers className="text-5xl mx-auto mb-3 text-gray-300" />
                    <p className="text-lg">No applicants yet for this role.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {applicants.map((app, index) => {
                      const applicant = app.applicant || {};
                      const resumeData = app.resumeData || {};
                      const atsScore = resumeData.atsScore || 0;

                      return (
                        <div key={app._id || index} className="p-6 sm:p-8 hover:bg-gray-50 transition flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                          
                          <div className="flex-shrink-0 relative w-20 h-20 flex items-center justify-center rounded-full bg-white shadow-inner border-[6px] border-gray-50"
                               style={{ borderColor: atsScore >= 75 ? '#22c55e' : atsScore >= 50 ? '#eab308' : '#ef4444' }}>
                            <div className="text-center">
                              <span className="text-xl font-extrabold text-gray-900">{atsScore}</span>
                            </div>
                            {atsScore >= 75 && <FaStar className="absolute -top-2 -right-2 text-yellow-400 text-xl drop-shadow-md" />}
                          </div>

                          <div className="flex-grow">
                            <h3 className="text-xl font-bold text-gray-900">{applicant.name || 'Unknown Candidate'}</h3>
                            <p className="text-sm text-gray-500 mb-2">{applicant.email}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-3">
                              {resumeData.extractedSkills?.map((skill, idx) => (
                                <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md border border-blue-100">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex-shrink-0 w-full sm:w-auto text-center sm:text-right">
                            <button className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition shadow-sm">
                              Download Resume
                            </button>
                            <p className="text-xs text-gray-400 mt-2 font-semibold uppercase">Status: {app.status}</p>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
}