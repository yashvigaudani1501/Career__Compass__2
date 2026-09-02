import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  FaBuilding, 
  FaEnvelope, 
  FaLock, 
  FaMapMarkerAlt, 
  FaGlobe, 
  FaPlus, 
  FaSpinner, 
  FaCheckCircle,
  FaRobot,
  FaBriefcase // <-- Added new icon for the work field
} from 'react-icons/fa';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  // ADDED 'work' TO INITIAL STATE
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    work: '', 
    website: ''
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const response = await API.post('/admin/create-company', formData);
      
      setMsg({ 
        type: 'success', 
        text: formData.website 
          ? `Success! Company registered & AI profile generated via web scraping.` 
          : 'Success! Company registered successfully.'
      });

      // Reset form, including work
      setFormData({ name: '', email: '', password: '', location: '', work: '', website: '' });
      setTimeout(() => setMsg({ type: '', text: '' }), 6000);

    } catch (err) {
      console.error("Error creating company:", err);
      const backendError = err.response?.data?.message || err.response?.data?.error || 'Failed to register company.';
      setMsg({ type: 'error', text: backendError });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Control Panel</h1>
            <p className="text-gray-500 mt-2">Manage the ATS Tracker ecosystem securely.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-200 shadow-sm">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div> System Online
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-8 bg-gray-900 text-white">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FaBuilding className="text-blue-400" /> Register New Company
              </h2>
              <p className="text-gray-400 mt-2 text-sm">
                Provide a website URL to automatically trigger the ML Web Scraper.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              
              {msg.text && (
                <div className={`p-4 rounded-xl flex items-center gap-3 font-medium border ${
                  msg.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                  {msg.type === 'success' ? <FaCheckCircle className="text-xl" /> : null}
                  {msg.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                  <div className="relative">
                    <FaBuilding className="absolute left-3 top-3.5 text-gray-400" />
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Stripe" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">HR/Admin Email</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="hr@stripe.com" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Initial Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                    <input type="password" name="password" required minLength="6" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Headquarters Location</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
                    <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="San Francisco, CA" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  </div>
                </div>

                {/* ADDED 'WORK' (INDUSTRY) FIELD */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Industry / Work Type</label>
                  <div className="relative">
                    <FaBriefcase className="absolute left-3 top-3.5 text-gray-400" />
                    <input type="text" name="work" value={formData.work} onChange={handleChange} placeholder="e.g. Artificial Intelligence, Financial Services" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Optional manually. If left blank and a website is provided, AI will try to auto-detect this.</p>
                </div>

                <div className="md:col-span-2 border-t border-gray-100 pt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    Official Website <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] uppercase rounded-full tracking-wider font-bold">Triggers AI</span>
                  </label>
                  <div className="relative">
                    <FaGlobe className="absolute left-3 top-3.5 text-blue-400" />
                    <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://stripe.com" className="w-full pl-10 pr-4 py-3 bg-blue-50 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">If provided, our Django AI Microservice will scrape the website to automatically generate the company's profile details.</p>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg disabled:opacity-70 flex justify-center items-center gap-2 transition-all"
                >
                  {loading && formData.website ? (
                    <><FaRobot className="animate-pulse text-xl" /> Scraping Website with AI...</>
                  ) : loading ? (
                    <><FaSpinner className="animate-spin text-xl" /> Registering...</>
                  ) : (
                    <><FaPlus /> Create Company Profile</>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-fit">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-4 mb-4">How it works</h3>
            <ul className="space-y-6 text-sm text-gray-600">
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                <p>Fill out the basic company credentials, location, and industry type.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                <p>Provide the website URL. The Node.js backend will proxy a request to the Django ML API.</p>
              </li>
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold flex-shrink-0">3</div>
                <p>Groq AI reads the website, extracts industry info, and builds the company profile instantly!</p>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}